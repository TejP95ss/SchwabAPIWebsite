# Trade Analyzer Website Overview
A React frontend with Flask backend website made to analyze trades, see current positions, and place orders in a Schwab Account.
## 
To edit this repo, install the necessary python modules and make sure to have react properly set up as well. Then, create a .env file in flask and put the 
following four variables there:

You will need to create an account and apply for a app via the Schwab Developer API platform. Once approved for the application, you can obtain the app key and the app secret from that website. Then you can run transactions.py and it
will prompt you to login. Once you finish loggin in, your hash will be displayed in the terminal and then you can use that
for the hash value
app_key = "Your Schwab App Key"  
app_secret = "Your Schwab App's Secret(essentially a password)"  
hash = "Your Account Number's Hash Value(will be alphanumeric and long)"  
callback_url = "https://127.0.0.1"  

Thanks to Tyler Bowers, as flask/api.py and flask/color_print.py were reused from his excellent github repo for the Schwab API. Here is his github for reference: https://github.com/tylerebowers. You can also use his youtube videos to get help for API related issues. 
