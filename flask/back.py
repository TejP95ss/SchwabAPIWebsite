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
@app.route('/api/placeorder', methods=['GET'])
def place_order():
    ticker = request.args.get('ticker')
    typeOf = request.args.get('type')
    quantity = int(request.args.get('quantity'))
    price = request.args.get('price')
    bs = request.args.get('buysell')
    optionInfo = request.args.get('infodict')
    respCode = transactions.submit_order(ticker, quantity, typeOf, price, bs, optionInfo.split(','))
    return jsonify(respCode)

if __name__ == '__main__':
    app.run(debug=True)