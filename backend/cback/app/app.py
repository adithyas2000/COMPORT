
# from requests import request
# import selenium
from datetime import datetime
import os
from dotenv import load_dotenv
from modules.User import User
from modules import search as SearchStore
from modules import userManagement
from modules import accountManager
from modules import keellsScraper as keels
from modules import foodcityScraper as fcity
from modules import arpicoScraper as arpico
from modules import common
from flask import Flask, jsonify, make_response,request, session
from flask_cors import CORS
import pymongo
from apscheduler.schedulers.background import BackgroundScheduler

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
# Scheduler for cron jobs
scheduler=BackgroundScheduler(daemon=True)
scheduler.start()



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
    if((authToken!='null') & (authToken!=None)):
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
    if((authToken!='null') & (authToken!=None)):
        print("Auth token: "+str(authToken))
        history=accountManager.getSearchHistory(authToken)
        return history
    else:
        return({"Error":"Log in to continue"})

@app.route('/clearHistory/')
def clearHistory():
    if(request.method=='OPTIONS'):
        return corsAllowHeaders()
    authToken=request.headers.get("Authorization")
    if((authToken!='null') & (authToken!=None)):
        history=accountManager.clearSearchHistory(authToken)
        return history
    else:
        print("Auth token: "+str(authToken))
        return{"Error":"Log in to continue"}
# ---------------------------------------------------------
# ---------------------WATCHLIST--------------------------
@app.route('/getwatchitem/')
def getWatchItem():
    if(request.method=='OPTIONS'):
        return corsAllowHeaders()
    authToken=request.headers.get("Authorization")
    if((authToken!='null') & (authToken!=None)):
        prodName=request.args.get('prodname')
        userfavs=accountManager.getAllFavs(authToken)
        for fav in userfavs.values():
            if fav["name"]==prodName:
                print("User has fav in watch")
                if (fav["URL"].find("keells")!=-1):
                    shop="keells"
                elif(fav["URL"].find("cargills")!=-1):
                    shop="foodcity"
                elif(fav["URL"].find("arpico")!=-1):
                    shop="arpico"
                
                itemDoc:dict=common.getWatchItem(prodName,shop)
                if(itemDoc!=None):
                    itemDoc.pop("_id")
                    itemDoc.pop("name")
                    # Make custom dict for chart
                    n=0
                    chartData=[]
                    for date in itemDoc:
                        print("Date: "+str(date))
                        chartData.append({"date":date,"price":itemDoc[date]})
                        n=n+1
                    print (chartData)
                    return {"Chartdata":chartData}
                else:
                    return{"Error":"Item not found in watchlist"}
            else:
                print("Item not in favs: got - "+str(prodName)+" found - "+fav["name"])
                # return{"Error":"Item not in favs"}
    else:
        return({"Error":"Log in to continue"})

@app.route('/addwatchitem/')
def addWatchItem():
    if(request.method=='OPTIONS'):
        return corsAllowHeaders()
    authToken=request.headers.get("Authorization")
    if((authToken!='null') & (authToken!=None)):
        prodName=request.args.get('prodName')
        shop=request.args.get('shop')
        price=float(request.args.get('price'))
        res=common.addToWatchlist(prodName,shop,price)
        return res
    else:
        return{"Error":"Log in to continue"}

             
# ----------------------------------------------------------
# ---------------------FAVOURITES MANAGEMENT----------------
@app.route('/addToFavs/')
def addtofavs():
    if(request.method=='OPTIONS'):
        return corsAllowHeaders()
    authToken=request.headers.get("Authorization")
    if((authToken!='null') & (authToken!=None)):
        prodName=request.args.get('prodname')
        shop=request.args.get('shop')
        # price=float(request.args.get('price'))
        favRes=accountManager.addToFavourites(prodName,shop,authToken)
        if(("Error" in favRes)):
            print("Error : "+favRes["Error"])
            return favRes
        else:
            watchRes=common.addToWatchlist(prodName,shop,favRes["price"])
            # favRes.update(watchRes)
            print("Added to watchlist")
            return(watchRes)
    else:
        return{"Error":"Log in to continue"}

@app.route('/getFavs/')
def getFavs():
    if(request.method=='OPTIONS'):
        return corsAllowHeaders()
    authToken=request.headers.get("Authorization")
    if((authToken!='null') & (authToken!=None)):
        print("Fav got token: "+str(authToken))
        res=accountManager.getAllFavs(authToken)
        return res
    else:
        return{"Error":"Log in to continue"}

@app.route('/removeFromFavs/')
def removeFromFavs():
    if(request.method=='OPTIONS'):
        return corsAllowHeaders()
    authToken=request.headers.get("Authorization")
    if((authToken!='null') & (authToken!=None)):
        timestamp=request.args.get('timestamp')
        res=accountManager.removeFromFavourites(timestamp,authToken)
        return res
    else:
        return{"Error":"Log in to continue"}
# ------------------------------------------------------------
# ---------------------PASSWORD CHANGE------------------------------
@app.route('/changepass/',methods=['POST'])
def changePass():
    print("Changepass method : "+str(request.method))
    if(request.method!='POST'):
        return corsAllowHeaders()
    authToken=request.headers.get("Authorization")
    if((authToken!='null') & (authToken!=None)):
        currentPass=request.form["currentPass"]   
        newPass=request.form["newPass"]
        print("Current pass:"+currentPass)
        print("New pass: "+newPass)
        res=accountManager.changePass(authToken,currentPass,newPass)
        resp=make_response(res)
        resp.access_control_allow_origin="*"
        return resp
    else:
        return{"Error":"Log in to continue"}
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
    if((authToken!='null') & (authToken!=None)):
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

@app.route('/runcron/',methods=['GET','POST'])
def runcron():
    print("----------------STARTING CRON JOBS------------------------")
    try:
        client = pymongo.MongoClient(os.environ.get("MONGO_URL"))
    except Exception as e:
        print(e)
        try:
            client = pymongo.MongoClient(os.environ.get("MONGO_URL_ALT"))
        except Exception as e2:
            print(e2)
    else:
        db=client["watchlist"]
        keelsCollection=db["keells"]
        foodcityCollection=db["foodcity"]
        arpicoCollection=db["arpico"]

        keellsWatchlist=keelsCollection.find()
        for item in keellsWatchlist:
            print(item["name"])
            prod=keels.getItem(item["name"],chrome_path)
            if(prod!=None):
                price=float(prod["price"].split(" ")[1].replace(",",""))
                print(price)
                date=str(datetime.now().isoformat(timespec='seconds')).split("T")[0]
                doc=keelsCollection.find_one_and_update(item,{"$set":{date:price}})
                if(doc==None):
                    print("Doc is none")
                else:
                    print(doc)

        foodcityWatchlist=foodcityCollection.find()
        for item in foodcityWatchlist:
            print(item["name"])
            prod=fcity.getItem(item["name"],chrome_path)
            if(prod!=None):
                price=float(prod["price"].split(" ")[1])
                print(price)
                date=str(datetime.now().isoformat(timespec='seconds')).split("T")[0]
                doc=foodcityCollection.find_one_and_update(item,{"$set":{date:price}})
                if(doc==None):
                    print("Doc is none")
                else:
                    print(doc)       

        arpicoWatchlist=arpicoCollection.find()
        for item in arpicoWatchlist:
            print(item["name"])
            prod=arpico.getItem(item["name"],chrome_path)
            if(prod!=None):
                price=float(prod["price"].replace("LKR","").replace(",",""))
                print(price)
                date=str(datetime.now().isoformat(timespec='seconds')).split("T")[0]
                doc=arpicoCollection.find_one_and_update(item,{"$set":{date:price}})
                if(doc==None):
                    print("Doc is none")
                else:
                    print(doc)            
            # propcount=0
            # for prop in item:
            #     if(propcount>1):
            #         print (prop+":     "+str(item[prop]))
            #     propcount=propcount+1
        print("---------------------------FINISHING CRON JOBS----------------------------")
        return "Done"

# ---------------------------------------------------------------------------------
# ----------------------------CORS HEADERS--------------------------------------------
def corsAllowHeaders():
    print("Sending allow headers...")
    res=make_response()
    # res.access_control_allow_credentials=True
    res.access_control_allow_credentials=True
    res.access_control_allow_origin="*"
    res.status_code=200
    return res

# adding jobs to scheduler
scheduler.add_job(runcron,trigger="cron",hour=17,minute=38)

app.run()

# def checkFile():
#     chrome_path=r"backend/cback/chromeWebdriver/chromedriver.exe"
#     # chromeWebdriver/chromedriver.exe
#     cdriveloc=exists(chrome_path)
#     print("Driver file exists : "+str(cdriveloc))


# checkFile()