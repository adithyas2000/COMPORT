import os
from dotenv import load_dotenv
from flask_login import current_user
import pymongo
from modules import userManagement
from datetime import datetime
from modules import keellsScraper as keells
from modules import foodcityScraper as foodcity
from modules import arpicoScraper as arpico


load_dotenv()

chrome_path=os.environ.get("CHROME_DRIVER")

fav_filter={"Doc_ID":"Favourites"}
history_filter={"Doc_ID":"History"}

client = pymongo.MongoClient(os.environ.get("MONGO_URL"))
db=client["users"]



def addToSearchHistory(historyItem:str):
    loggedinuser=userManagement.getLoggedinUser()
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

def removeFromSearchHistory(item:str):
    loggedinuser=userManagement.getLoggedinUser()
    userDocs=db[loggedinuser]
    try:
        historyDoc=userDocs.find_one(history_filter)
        searchText:str=historyDoc[item]
        updatedHistory=userDocs.update_one(history_filter,{"$unset":{item:searchText}})
        # print("Updated: "+str(updatedHistory.modified_count))
        return({"Updated":str(updatedHistory.modified_count)})
    except Exception as e:
        print(str(e))
        return({"Error":str(e)})

def clearSearchHistory():
    loggedinuser=userManagement.getLoggedinUser()
    userDocs=db[loggedinuser]
    try:
        deletedoc=userDocs.delete_one(history_filter)
        print("deleted count: "+str(deletedoc.deleted_count))
        return({"Deleted count":str(deletedoc.deleted_count)})
    except Exception as e:
        print(str(e))
        return({"Error":str(e)})

def getSearchHistory():
    loggedinuser=userManagement.getLoggedinUser()
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
    except Exception as e:
        print("ERROR : "+str(e))
        return({"Error":str(e)})

def addToFavourites(productname:str,shop:str):
    loggedinuser=userManagement.getLoggedinUser()
    userDocs=db[loggedinuser]
    # Check if has a favs doc, if not create
    itemurl:str=""
    if(shop=="keells"):
        itemurl=keells.getItem(productname,chrome_path)
        trimmedUrl=itemurl.split("keellssuper.com/")[1]
    elif(shop=="foodcity"):
        itemurl=foodcity.getItem(productname,chrome_path)
    elif(shop=="arpico"):
        itemurl=arpico.getItem(productname,chrome_path)
        print(itemurl)
        
    try:
        favsDoc=userDocs.find_one(fav_filter)
        if(favsDoc==None):
            favDoc=userDocs.insert_one(fav_filter)
        time=datetime.now().isoformat(timespec='seconds')
        currentFavs=getAllFavs()
        duplicate:bool=False
        for fav in currentFavs.values():
            print(fav)
            if(fav==itemurl):
                duplicate=True
                break
        if(duplicate):
            return {"Warn":"Duplicate"}
        else:
            favsUpdated=userDocs.update_one(fav_filter,{"$set":{time:itemurl}})
            return {"Modified":str(favsUpdated.modified_count)}
    except Exception as e:
        print(str(e))
        return({"Error":str(e)})
        


def removeFromFavourites(timestamp:str):
    loggedinuser=userManagement.getLoggedinUser()
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

def getAllFavs():
    loggedinuser=userManagement.getLoggedinUser()
    userDocs=db[loggedinuser]
    try:
        favDoc=userDocs.find_one(fav_filter)
        if(favDoc!=None):
            favDict={}
            n:int=1
            for item in favDoc:
                if(n>2):
                    favDict[str(item)]=str(favDoc[item])
                    print("Item "+str(n-2)+" : "+str(favDoc[item]))
                else:
                    print(str(item)+" : "+str(favDoc[item]))
                n=n+1
            return favDict
    except Exception as e:
        print(str(e))
        return({"Error":str(e)})