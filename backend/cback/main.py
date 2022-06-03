
# from requests import request
import selenium
from flask import Flask, jsonify,request
from flask_cors import CORS
import pymongo

app=Flask(__name__)
cors=CORS(app)

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

@app.route('/testmongo/')
def mongoConnect():
    
    client = pymongo.MongoClient("mongodb+srv://comportadmin:comportadmin123@comportcluster.kgno3pz.mongodb.net/?retryWrites=true&w=majority")
    db = client.u0001
    coll1=db.searchHistory
    data={
        "stext":"testval",
        "items":"someitems"
    }
    dataId=coll1.insert_one(data).inserted_id
    dataId

    print(db)
    return 'LOL'

if __name__=='__main__':
    app.run()