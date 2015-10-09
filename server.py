#TODO: get plate-number and curse-word from user and save with a timestamp
#TODO: list fee per user
#TODO: pay and reset debt

import json
import pusher
import sendgrid
import braintree
from flask import Flask, request, send_from_directory,redirect

app = Flask(__name__)

db = {}

braintree.Configuration.configure(
    braintree.Environment.Sandbox,
    'ffdqc9fyffn7yn2j',
    'qj65nndbnn6qyjkp',
    'a3de3bb7dddf68ed3c33f4eb6d9579ca'
)

p = pusher.Pusher(
  app_id='146865',
  key='a19117ca2435e0159c2a',
  secret='8ee46bf07101b82d5ba2',
  ssl=True,
  host='api-eu.pusher.com',
  port=443
)

p.trigger('test_channel', 'hello', {'message': 'hello world'})

sg = sendgrid.SendGridClient('EmGbmhmMTvm38ryQaTowyw')

sendgrid.SendGridClient('EmGbmhmMTvm38ryQaTowyw')
message = sendgrid.Mail()
message.add_to('John Doe <kobi.kadosh@gmail.com>')
message.set_subject('Example')
message.set_html('Body')
message.set_text('Body')
message.set_from('Doe John <kobi.kadosh@gmail.com>')
status, msg = sg.send(message)

def push_a_jerk(jerkId, score):
    p.trigger('test_channel', 'a_jerk', {'message': 'new jerk', 'jerkId': jerkId, 'score': score})

def send_jerk_list(jerkId):
    sg = sendgrid.SendGridClient('EmGbmhmMTvm38ryQaTowyw')
    message = sendgrid.Mail()
    message.add_to('John Doe <kobi.kadosh@gmail.com>')
    message.set_subject('Example')
    message.set_html('Body')
    message.set_text('Body')
    message.set_from('Doe John <kobi.kadosh@gmail.com>')
    status, msg = sg.send(message)

@app.route("/client_token", methods=["GET"])
def client_token():
  return json.dumps(braintree.ClientToken.generate())

@app.route('/src/<path:path>')
def serv_static_src(path):
    return send_from_directory('src', path)

@app.route('/lib/<path:path>')
def serv_bower(path):
    return send_from_directory('lib', path)

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

    # push new jerk
    push_a_jerk(lpr, db[lpr])

    return str(db[lpr])

@app.route('/checkout/<t>', methods=["POST"])
def checkout(t):
    nonce = request.form["payment_method_nonce"]
    lpr = request.form["payment-lpr"]
    # Use payment method nonce here...
    result = braintree.Transaction.sale({
      "amount": "10.00",
      "payment_method_nonce": nonce
    })

    # remove the jerk
    if lpr in db.keys():
        del db[lpr]
    else:
        del db[0]


    return send_from_directory('src', 'index.html')
    #return render_template('paid.html', { 'status' : 'paid', 'jerkId': lpr , 'res': result })
    # return json.dumps({ 'status' : 'paid', 'res': result })

if __name__ == '__main__':
    app.debug = True
    app.run()
