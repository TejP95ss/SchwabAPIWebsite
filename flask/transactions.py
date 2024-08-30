import api
from dotenv import load_dotenv
from datetime import datetime
import pytz
import os

# these four lines are using os.getenv to access the app key, app secret and the account hash from a non-tracked file.
# all 3 of these are unique to the user and should not be made public for security reasons.
# however, if you downloaded this repo, you can simply place the secret, key, and hash as variables in this file;
# just make sure to never share them with anyone.
load_dotenv()
c = api.Client(os.getenv('app_key'), os.getenv('app_secret')) # key and secret are obtained from schwab's developer api.
hash = os.getenv('hash') # hash will be obtained by loggin in to the relevant schwab account.
c.update_tokens_auto()


# returns all the transactions taken in the given period between start and end.
def get_transactions(start, end, filterTicker):
    if(start == None or end == None):
        return
    trades = []
    if(filterTicker == None):
        transactions = c.transactions(hash, datetime.strptime(start, "%Y-%m-%d"), datetime.strptime(end, "%Y-%m-%d"), "TRADE").json()
    else:  
        transactions = c.transactions(hash, datetime.strptime(start, "%Y-%m-%d"), datetime.strptime(end, "%Y-%m-%d"), "TRADE", filterTicker).json()
    sortedTrades = sorted(transactions, key=lambda x: x['time'])
    for i in range(len(sortedTrades)):
        curTrans = sortedTrades[i]["transferItems"]
        val = len(curTrans) - 1
        ticker = curTrans[val]["instrument"]["symbol"]
        quantity = curTrans[val]["amount"]
        price = curTrans[val]["price"]
        estTime = datetime.strptime(sortedTrades[i]["time"], "%Y-%m-%dT%H:%M:%S%z").astimezone(pytz.timezone("US/Eastern"))
        total = round(quantity * price, 2) 
        curDict = {"ticker": ticker, "date": str(estTime)[:-6], "quantity": quantity, "price": price, "amount": total}
        trades.append(curDict)
    return trades

# displays the current positions so the user can visualize their investments
def get_positions():
    allInfo = c.account_details(hash, "positions").json()
    allPositions = []
    cash = allInfo["securitiesAccount"]["currentBalances"]["cashBalance"]
    liqVal = allInfo["securitiesAccount"]["currentBalances"]["liquidationValue"]
    try:
        pos = allInfo["securitiesAccount"]["positions"]
    except:
        return
    for i in range(len(pos)):
        ticker = pos[i]["instrument"]["symbol"]
        avgPrice = round(pos[i]["averagePrice"], 2)
        quantity = pos[i]["longQuantity"]
        PL = round(pos[i]["longOpenProfitLoss"], 2)
        perPL = round(((PL / (avgPrice * quantity)) * 100), 2)
        perAcc = round(((avgPrice * quantity) / liqVal) * 100, 2)
        curDict = {"ticker": ticker, "avgPrice": avgPrice, "quantity": quantity, "PL": PL, "perPL": perPL, "perAcc": perAcc}
        allPositions.append(curDict)
    allPositions.append({"ticker": "cash", "avgPrice": 1, "quantity": cash, "perAcc": round((cash/liqVal) * 100, 2)})
    allPositions.append({"ticker": "liqVal", "value": liqVal})
    return allPositions

# allows the user to submit market, limit, stop orders to buy and sell stocks and options.
def submit_order(ticker, quantity, type, price, buySell, optionInfo):
    if(len(optionInfo) == 3):
        print(optionInfo)
        symDict = {"symbol": createOptionSymbol(optionInfo, ticker), "assetType": "OPTION"}
    else:
        symDict = {"symbol": ticker, "assetType": "EQUITY"}
    order = {"orderType": type, "session": "NORMAL", "duration": "GOOD_TILL_CANCEL", "orderStrategyType": "SINGLE",
         "orderLegCollection": [
             {"instruction": buySell, "quantity": quantity, "instrument": symDict}]}
    if(type == "LIMIT" or type == "LIMIT_ON_CLOSE"):
        order["price"] = price
    elif(type ==  "STOP"):
        order["stopPrice"] = price
    resp = c.order_place(hash, order)
    print(resp.text)
    return {"code": resp.status_code}

#creates the ticker symbol the option contract from the given information
def createOptionSymbol(optionInfo, ticker):
    spacedTicker = ticker + (' ' * (6 - len(ticker)))
    date_obj = datetime.strptime(optionInfo[0], '%Y-%m-%d')
    date_formatted = date_obj.strftime('%y%m%d')
    cp = "C" if optionInfo[2] == "CALL" else "P"
    preDec = 0
    strStrike = str(optionInfo[1])
    for i in range(len(strStrike)):
        if(strStrike[i] == "."):
            break
        else:
            preDec += 1
    nonDecStrike = ''.join(filter(str.isdigit, strStrike))
    actualStrike = ((5 - preDec) * '0') + nonDecStrike + ('0' * (8 - (len(nonDecStrike) + (5 - preDec))))

    return spacedTicker + date_formatted + cp + actualStrike
