from flask import Flask, jsonify, request
import transactions

app = Flask(__name__)

#transactions page where the user can see all their transactions for inputted time frames
@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    filter_ticker = request.args.get('filter_ticker')

    allTransactions = transactions.get_transactions(start_date, end_date, filter_ticker)
    response = jsonify(allTransactions)
    return response

#positions page that displays the user's current open positions
@app.route('/api/currentpositions', methods=['GET'])
def get_positions():
    allPositions = transactions.get_positions()
    response = jsonify(allPositions)
    return response

#allows the user to place STOP, MARKET, LIMIT, and STOP-LIMIT orders on stocks and options.
@app.route('/api/placeorder', methods=['POST'])
def place_order():
    data = request.json
    ticker = data.get('ticker')
    typeOf = data.get('type')
    quantity = int(data.get('quantity'))
    price = data.get('price')
    bs = data.get('buysell')
    optionInfo = data.get('infodict')
    respCode = transactions.submit_order(ticker, quantity, typeOf, price, bs, optionInfo)
    return jsonify(respCode)

@app.route('/api/cancel', methods=['POST'])
def cancel_order():
    data = request.json
    respCode = transactions.cancelOrder(data.get("orderNumber"))
    return respCode

#sends the user all the currently open orders.
@app.route('/api/openorders', methods=["GET"])
def open_orders():
    all_open_orders = transactions.open_orders()
    return jsonify(all_open_orders)

if __name__ == '__main__':
    app.run(debug=True)