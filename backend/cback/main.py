
# from requests import request
# import selenium
import kellsScraper as keels
from flask import Flask, jsonify,request
from flask_cors import CORS
import pymongo

def getDataDict(dataobj):
    data={}
    for i in range(dataobj.lsize):
        data[dataobj.ilist[i]]=dataobj.plist[i]
        print(dataobj.ilist[i]+" -- "+dataobj.plist[i])
    return data


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
        req=request.args.get('sitem')
        # print("REQ : "+req)
        prodDet=keels.scrape(req)
        prodDict=getDataDict(prodDet)

        return jsonify(prodDict)

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

