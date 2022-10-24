
# from requests import request
# import selenium
from modules.User import User
from modules import arpicoScraper as arpico
from modules import kellsScraper as keells
from modules import foodcityScraper as fcity
from modules import search as SearchStore
from modules import userManagement
from flask import Flask, jsonify,request, session
from flask_cors import CORS
import pymongo
from os.path import exists
import flask_login


chrome_path=r"backend/cback/chromeWebdriver/chromedriver.exe"

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
cors=CORS(app)

login_manager = flask_login.LoginManager()

login_manager.init_app(app)
login_manager.login_view='login'

@app.route('/')
def index():
    return 'This is index.html'

@app.route('/viewData/<int:val1>')
def viewData(val1):
    return f'This is view data page for {val1}'

@flask_login.login_required
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

        if(request.args.get('shop3').lower()=='true'):
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

        arpicoProdDict={"NULL":"NULL"}
        if(shop3):
            arpicoDet=arpico.scrape(stext,chrome_path)
            arpicoProdDict=getDataDict(arpicoDet)
        finalDict=[keellsProdDict,fcProdDict,arpicoProdDict]
        return jsonify(finalDict)

@app.route('/logout/',methods=['GET','POST'])
@flask_login.login_required
def logout():
    print("Logging out ",flask_login.current_user.is_authenticated,sep=" , ")
    flask_login.logout_user()
    print("Logging out ",flask_login.current_user.is_authenticated,sep=" , ")
    return({"Logged out":"TRUE"})

@login_manager.user_loader
def user_load(email:str):
    resp=userManagement.getUser(email)
    user=User(resp['id'],resp['email'],"NREFRESHPASS",True)
    return user

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

@app.route('/login/',methods=['POST'])
def login():
    if(request.method=='POST'):
        email=request.form["email"]
        password=request.form["password"]
        res=userManagement.login(email,password)
        if("Error" in res):
            return (res)
        user=User(res['id'],res['email'],password,True)
        loggedin=flask_login.login_user(user,force=True)
        print(flask_login.current_user,"Auth",user.is_authenticated,"loggedin",loggedin,sep=" , ")
        
    print("Logging in...")
    
    return(res)

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


app.run()

# def checkFile():
#     chrome_path=r"backend/cback/chromeWebdriver/chromedriver.exe"
#     # chromeWebdriver/chromedriver.exe
#     cdriveloc=exists(chrome_path)
#     print("Driver file exists : "+str(cdriveloc))


# checkFile()