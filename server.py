#TODO: get plate-number and curse-word from user and save with a timestamp
#TODO: list fee per user
#TODO: pay and reset debt

import json
from flask import Flask, request, send_from_directory,redirect
app = Flask(__name__)

db = {}

@app.route('/src/<path:path>')
def serv_static_src(path):
    return send_from_directory('src', path)

@app.route('/bower_components/<path:path>')
def serv_bower(path):
    return send_from_directory('bower_components', path)

@app.route('/')
def index():
    return send_from_directory('src', 'index.html')

@app.route('/list')
def list_all():
    return json.dumps(db)

@app.route('/asshole/<lpr>')
def fine_as_asshole(lpr):
    print (lpr)
    if lpr in db.keys():
        db[lpr]+=1
    else:
        db[lpr]=1
    return str(db[lpr])

@app.route('/checkout/<lpr>')
def checkout(lpr):
	return redirect('https://www.paypal.com/signin/')

if __name__ == '__main__':
    app.debug = True
    app.run()
