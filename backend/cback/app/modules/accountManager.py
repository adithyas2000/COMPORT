import os
from dotenv import load_dotenv
import pymongo
from modules import userManagement
from datetime import datetime
from modules import keellsScraper as keells
from modules import foodcityScraper as foodcity
from modules import arpicoScraper as arpico
from modules import encrypt

from modules import jwtDecode
import bcrypt


load_dotenv()

chrome_path=os.environ.get("CHROME_DRIVER")

fav_filter={"Doc_ID":"Favourites"}
history_filter={"Doc_ID":"History"}

client = pymongo.MongoClient(os.environ.get("MONGO_URL"))
db=client["users"]
accountdb=client["accounts"]


def addToSearchHistory(historyItem:str,token:str):
    tokenResult=jwtDecode.decode(token)
    print(tokenResult)
    loggedinuser=tokenResult["email"]
    userDocs=db[loggedinuser]
    try:
        historyDoc=userDocs.find_one(history_filter)

        # historyDoc=userDocs.find_one_and_update(history_filter,{set:{"TestKEY":"TestVALUE"}},upsert=True)
        # If the user has no history document, create new
        if(historyDoc==None):
            print("No history doc. Creating...")
            historyDoc=userDocs.insert_one(history_filter)
            time=str(datetime.now().isoformat(timespec='seconds'))
            updatedHistory=userDocs.find_one_and_update(history_filter,{"$set":{str(time):str(historyItem)}})
            # print(str(updatedHistory))
            return(str(updatedHistory['_id']))
        else:
            #If user has a history doc...
            time=str(datetime.now().isoformat(timespec='seconds'))
            updatedHistory=userDocs.find_one_and_update(history_filter,{"$set":{str(time):str(historyItem)}})
            # print(str(updatedHistory))
            return str(updatedHistory['_id'])
    except Exception as e:
        print(e)
        return("ERROR : "+str(e))

def removeFromSearchHistory(item:str,token:str):
    tokenResult=jwtDecode.decode(token)
    print(tokenResult)
    loggedinuser=tokenResult["email"]
    userDocs=db[loggedinuser]
    try:
        historyDoc=userDocs.find_one(history_filter)
        searchText:str=historyDoc[item]
        updatedHistory=userDocs.update_one(history_filter,{"$unset":{item:searchText}})
        # print("Updated: "+str(updatedHistory.modified_count))
        return({"Updated":updatedHistory.modified_count})
    except Exception as e:
        print(str(e))
        return({"Error":str(e)})

def clearSearchHistory(token:str):
    tokenResult=jwtDecode.decode(token)
    print(tokenResult)
    loggedinuser=tokenResult["email"]
    userDocs=db[loggedinuser]
    try:
        deletedoc=userDocs.delete_one(history_filter)
        print("deleted count: "+str(deletedoc.deleted_count))
        return({"Deleted count":str(deletedoc.deleted_count)})
    except Exception as e:
        print(str(e))
        return({"Error":str(e)})

def getSearchHistory(token:str):
    print("Token at getSearchHistory : "+token)
    tokenResult=jwtDecode.decode(token)
    print(tokenResult)
    loggedinuser=tokenResult["email"]
    userDocs=db[loggedinuser]
    try:
        fullHistory=userDocs.find_one(history_filter)
        if(fullHistory!=None):
            n:int=1
            dateList=[]
            dateDict={}
            # Create a list with all dates
            for item in fullHistory:
                # Skip mongo _id and Doc_ID (first 2 items)
                if(n>2):
                    tempTime=datetime.strptime(item,"%Y-%m-%dT%H:%M:%S")
                    dateList.append(tempTime)
                    dateDict[str(item)]=str(fullHistory[item])
                    print("Item "+str(n)+" : "+str(item))
                n=n+1
            return(dateDict)
        else:
            return ({})
    except Exception as e:
        print("ERROR : "+str(e))
        return({"Error":str(e)})

def addToFavourites(productname:str,shop:str,token:str):
    tokenResult=jwtDecode.decode(token)
    print(tokenResult)
    loggedinuser=tokenResult["email"]
    userDocs=db[loggedinuser]
    # Check if has a favs doc, if not create
    Itemdata=None
    if(shop=="keells"):
        Itemdata=keells.getItem(productname,chrome_path)
    elif(shop=="foodcity"):
        Itemdata=foodcity.getItem(productname,chrome_path)
    elif(shop=="arpico"):
        Itemdata=arpico.getItem(productname,chrome_path)
    print("Itemdata:"+str(Itemdata))
        
    try:
        favsDoc=userDocs.find_one(fav_filter)
        if(favsDoc==None):
            favDoc=userDocs.insert_one(fav_filter)
        time=datetime.now().isoformat(timespec='seconds')
        currentFavs=getAllFavs(token)
        duplicate:bool=False
        for fav in currentFavs.values():
            print(fav)
            if(fav==Itemdata):
                duplicate=True
                break
        if(duplicate):
            return {"Warn":"Duplicate","price":Itemdata["price"]}
        else:
            if("Error" in Itemdata):
                return Itemdata
            favsUpdated=userDocs.update_one(fav_filter,{"$set":{time:Itemdata}})
            return {"price":Itemdata["price"]}
    except Exception as e:
        print(str(e))
        return({"Error":str(e)})
        


def removeFromFavourites(timestamp:str,token:str):
    tokenResult=jwtDecode.decode(token)
    print(tokenResult)
    loggedinuser=tokenResult["email"]
    userDocs=db[loggedinuser]
    try:
        favDoc=userDocs.find_one(fav_filter)
        if(favDoc!=None):
            favUpdated=userDocs.update_one(fav_filter,{"$unset":{timestamp:favDoc[timestamp]}})
            return {"Updated":favUpdated.modified_count}
        else:
            return {"Error":"No fav doc"}
    except Exception as e:
        return {"Error":str(e)}

def getAllFavs(token:str):
    tokenResult=jwtDecode.decode(token)
    print(tokenResult)
    loggedinuser=tokenResult["email"]
    userDocs=db[loggedinuser]
    try:
        favDoc:dict=userDocs.find_one(fav_filter)
        if(favDoc!=None):
            favDict={}
            n:int=1
            for item in favDoc:
                if(n>2):
                    favDict[item]=favDoc[item]
                    print("Item "+str(n-2)+" : "+str(favDoc[item]))
                else:
                    print(str(item)+" : "+str(favDoc[item]))
                n=n+1
            return favDict
    except Exception as e:
        print(str(e))
        return({"Error":str(e)})

def changePass(token:str,currentPass:str,newPass:str):
    tokenResult=jwtDecode.decode(token)
    print(tokenResult)
    loggedinuser=tokenResult["email"]
    print("User: "+str(loggedinuser))
    users=accountdb["users"]
    try:
        user=users.find_one({"email":loggedinuser})
        if(user!=None):
            password=user["password"]
            if(bcrypt.checkpw(currentPass.encode('utf-8'),password)):
                # print("Passwords match")
                encryptedPass=encrypt.encrypt(newPass)
                updatePass=users.update_one({"email":loggedinuser},{'$set':{"password":encryptedPass}})
                if(updatePass.modified_count>0):
                    return{"Success":"Updated password"}
                else:
                    return{"Error":"Domething went wrong"}
            else:
                print("Passwords dont match")
                return{"Error":"Email or password do not match"}
        else:
            return{"Error":"Invalid user"}
    except Exception as e:
        print(str(e))
        return{"Error":str(e)}
