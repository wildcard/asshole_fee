#TODO: get plate-number and curse-word from user and save with a timestamp
#TODO: list fee per user
#TODO: pay and reset debt

from flask import Flask
app = Flask(__name__)

db = {}

@app.route('/')
def index():
    return 'Nothing to see here, carry on...'

@app.route('/asshole/<lpr>')
def fine_as_asshole(lpr):
    print (lpr)
    if lpr in db.keys():
        db[lpr]+=1
    else:
        db[lpr]=1
    return str(db[lpr])

if __name__ == '__main__':
    app.debug = True
    app.run()