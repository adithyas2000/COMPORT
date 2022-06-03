
# from requests import request
import selenium
from flask import Flask, jsonify,request
app=Flask(__name__)

@app.route('/')
def index():
    return 'This is index.html'

@app.route('/viewData/<int:val1>')
def viewData(val1):
    return f'This is view data page for {val1}'

@app.route('/search',methods=['GET','POST'])
def search():
    if request.method == 'GET':
        req=request.args.get('a')
        print("REQ : "+req)
        return jsonify(a=req)
if __name__=='__main__':
    app.run()