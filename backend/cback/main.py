
# from requests import request
# import selenium
from math import fabs
import kellsScraper as keells
import foodcityScraper as fcity
from flask import Flask, jsonify,request
from flask_cors import CORS
import pymongo

chrome_path=r"backend/cback/chromeWebdriver/chromedriver.exe"

def getDataDict(dataobj):
    data={}
    for i in range(dataobj.lsize):
        darray=[dataobj.ilist[i],dataobj.plist[i],dataobj.urllist[i]]
        data[str(i)]=darray
        print(dataobj.ilist[i]+" -- "+dataobj.plist[i])
    data['size']=dataobj.lsize
    print("DATA :")
    print(data)
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
        if(request.args.get('shop1').lower()=='true'):
            shop1=True
        else:
            shop1=False

        if(request.args.get('shop2').lower()=='true'):
            shop2=True
        else:
            shop2=False

        if(request.args.get('shop2').lower()=='true'):
            shop3=True
        else:
            shop3=False


        stext=request.args.get('sitem')
        
        keellsProdDict={"NULL":"NULL"}
        if(shop1):
            keellsProdDet=keells.scrape(stext,chrome_path)
            keellsProdDict=getDataDict(keellsProdDet)

        fcProdDict={"NULL":"NULL"}
        if(shop2):
            fcProdDet=fcity.scrape(stext,chrome_path)
            fcProdDict=getDataDict(fcProdDet)

        arpicoDict={"NULL":"NULL"}
        if(shop3):
            # Shop3 scraper
            # Create shop3 dictionary
            pass
        finalDict=[keellsProdDict,fcProdDict,arpicoDict]
        return jsonify(finalDict)

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

