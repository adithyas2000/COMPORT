
# from requests import request
# import selenium
import os
from dotenv import load_dotenv
from modules.User import User
from modules import search as SearchStore
from modules import userManagement
from modules import accountManager
from modules import keellsScraper as keels
from modules import foodcityScraper as fcity
from modules import arpicoScraper as arpico
from flask import Flask, jsonify, make_response,request, session
from flask_cors import CORS, cross_origin
import pymongo
from os.path import exists

load_dotenv()

chrome_path=os.environ.get("CHROME_DRIVER")

# Create data dictionary with list of items and size of list
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
app.secret_key='comport secret'
CORS(app)



# ---------MAIN SEARCH----------------------------------------
@app.route('/search')
def search():
    
    if request.method == 'GET':
        authToken=request.headers.get("Authorization")
        print("Auth token: "+str(authToken))
        if(request.args.get('shop1').lower()=='true'):
            shop1=True
        else:
            shop1=False

        if(request.args.get('shop2').lower()=='true'):
            shop2=True
        else:
            shop2=False

        if(request.args.get('shop3').lower()=='true'):
            shop3=True
        else:
            shop3=False


        stext=request.args.get('sitem')

        resultArray=SearchStore.mainSearch(shop1,shop2,shop3,stext,authToken)
        response=make_response(jsonify(resultArray))
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        
        response.status_code=200
        return(response)
    else:
        return corsAllowHeaders()

# ----------------------------------------------------------------------
# ----------------AUTHENTICATION----------------------------------------
@app.route('/logout/',methods=['GET','POST','OPTIONS'])
def logout():
    print("Method : "+str(request.method))
    print("Headers:"+str(request.headers.get("Authorization")))
    authToken=request.headers.get("Authorization")
    print("Auth token: "+str(authToken))
    return({"Logged out":"TRUE"})


def user_load(email:str):
    resp=userManagement.getUser(email)
    user=User(resp['id'],resp['email'],"NREFRESHPASS",True)
    return user

@app.route('/login/',methods=['POST'])
def login():
    if(request.method=='POST'):
        email=request.form["email"]
        password=request.form["password"]
        res=userManagement.login(email,password)
        if("Error" in res):
            return (res)
        user=User(res['id'],res['email'],password,True)
        
    print("Logging in...")
    response=make_response(res)
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return(response)

@app.route('/signup/',methods=['POST'])
def signup():
    if(request.method=='POST'):
        email=request.form["email"]
        password=request.form["password"]
        print("JSON:"+email+"--"+password)
        resp=userManagement.signup(email,password)
        return resp
    else:
        print("Not POST")
# ------------------------------------------------------------------------

# ---------HISTORY MANAGEMENT-----------------------
@app.route('/deleteSpecHistory/')
def removeFromHistory():
    if(request.method=='OPTIONS'):
        return corsAllowHeaders()
    authToken=request.headers.get("Authorization")
    if(authToken!=None):
        timestamp:str=request.args.get('timestamp')
        history=accountManager.removeFromSearchHistory(timestamp,authToken)
        response=make_response(history)
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return(response)
    else:
        return ({"Error":"Log in to continue"})

@app.route('/getHistory/')
def getHistory():
    if(request.method=='OPTIONS'):
        return corsAllowHeaders()
    authToken=request.headers.get("Authorization")
    if(authToken!=None):
        history=accountManager.getSearchHistory(authToken)
        return history
    else:
        return({"Error":"Log in to continue"})

@app.route('/clearHistory/')
def clearHistory():
    if(request.method=='OPTIONS'):
        return corsAllowHeaders()
    authToken=request.headers.get("Authorization")
    if(authToken!=None):
        history=accountManager.clearSearchHistory(authToken)
        return history
    else:
        return{"Error":"Log in to continue"}
# ---------------------------------------------------------
# ---------------------FAVOURITES MANAGEMENT----------------
@app.route('/addToFavs/')
def addtofavs():
    if(request.method=='OPTIONS'):
        return corsAllowHeaders()
    authToken=request.headers.get("Authorization")
    if(authToken!=None):
        prodName=request.args.get('prodname')
        shop=request.args.get('shop')
        res=accountManager.addToFavourites(prodName,shop,authToken)
        return(res)
    else:
        return{"Error":"Log in to continue"}

@app.route('/getFavs/')
def getFavs():
    if(request.method=='OPTIONS'):
        return corsAllowHeaders()
    authToken=request.headers.get("Authorization")
    if(authToken!=None):
        res=accountManager.getAllFavs(authToken)
        return res
    else:
        return{"Error":"Log in to continue"}

@app.route('/removeFromFavs/')
def removeFromFavs():
    if(request.method=='OPTIONS'):
        return corsAllowHeaders()
    authToken=request.headers.get("Authorization")
    if(authToken!=None):
        timestamp=request.args.get('timestamp')
        res=accountManager.removeFromFavourites(timestamp,authToken)
        return res
    else:
        return{"Error":"Log in to continue"}
# ------------------------------------------------------------
# ---------------------TEST ENDPOINTS--------------------------------

@app.route('/')
def index():
    return 'This is index.html'

@app.route('/viewData/<int:val1>')
def viewData(val1):
    return f'This is view data page for {val1}'

@app.route('/testmongo/')
def mongoConnect():
    
    client = pymongo.MongoClient("mongodb+srv://comportadmin:comportadmin123@comportcluster.kgno3pz.mongodb.net/?retryWrites=true&w=majority")
    db = client.u0001
    coll1=db.searchHistory
    data={
        "stext":"testval2",
        "items":"someitems2"
    }
    dataId=coll1.insert_one(data).inserted_id
    dataId

    print(db)
    return 'LOL'

# @app.route('/getCurrentUser/')
# def getCUser():
#     if (flask_login.current_user.is_authenticated):
#         return {"Logged in as":flask_login.current_user.get_email()}
#     else:
#         return {"Error":"Not logged in"}
@app.route('/addHistory/')
def gethdoc():
    if(request.method=='OPTIONS'):
        return corsAllowHeaders()
    authToken=request.headers.get("Authorization")
    if(authToken!=None):
        stext:str=request.args.get('sitem')
        print("Adding "+stext)
        hdoc=accountManager.addToSearchHistory(stext,authToken.replace("Bearer ",""))
        print((hdoc))
        return hdoc 
    else:
        return{"Error":"Login to continue"}

@app.route('/addtoFav/')
def addtofav():
    iname:str=request.args.get('itemname')
    price:str=request.args.get('price')
    iurl:str=request.args.get('iurl')
    purl:str=request.args.get('purl')

@app.route('/keellsitem/')
def getkeellsitem():
    item=request.args.get('itemtext')
    res=keels.getItem(item,chrome_path)
    return res

@app.route('/foodcityitem/')
def getfcitem():
    item=request.args.get('itemtext')
    res=fcity.getItem(item,chrome_path)
    return res
@app.route('/arpicoitem/')
def arpicoitem():
    item=request.args.get('itemtext')
    res=arpico.getItem(item,chrome_path)
    return res


# ------------------------------------------------------------------------
def corsAllowHeaders():
    print("Sending allow headers...")
    res=make_response()
    res.access_control_allow_credentials=True
    res.access_control_allow_credentials=True
    res.access_control_allow_origin="*"
    res.status_code=200
    return res


app.run()

# def checkFile():
#     chrome_path=r"backend/cback/chromeWebdriver/chromedriver.exe"
#     # chromeWebdriver/chromedriver.exe
#     cdriveloc=exists(chrome_path)
#     print("Driver file exists : "+str(cdriveloc))


# checkFile()