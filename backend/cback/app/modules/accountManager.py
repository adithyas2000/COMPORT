import os
from dotenv import load_dotenv
from flask_login import current_user
import pymongo
from modules import userManagement
from datetime import datetime


load_dotenv()

client = pymongo.MongoClient(os.environ.get("MONGO_URL"))
db=client["users"]



def addToSearchHistory(historyItem:str):
    loggedinuser=userManagement.getLoggedinUser()
    userDocs=db[loggedinuser]
    try:
        historyDoc=userDocs.find_one({"Doc_ID":"History"})

        # historyDoc=userDocs.find_one_and_update({"Doc_ID":"History"},{set:{"TestKEY":"TestVALUE"}},upsert=True)
        # If the user has no history document, create new
        if(historyDoc==None):
            print("No history doc. Creating...")
            historyDoc=userDocs.insert_one({"Doc_ID":"History"})
            time=str(datetime.now().isoformat(timespec='seconds'))
            updatedHistory=userDocs.find_one_and_update({"Doc_ID":"History"},{"$set":{str(time):str(historyItem)}})
            # print(str(updatedHistory))
            return(str(updatedHistory['_id']))
        else:
            #If user has a history doc...
            time=str(datetime.now().isoformat(timespec='seconds'))
            updatedHistory=userDocs.find_one_and_update({"Doc_ID":"History"},{"$set":{str(time):str(historyItem)}})
            # print(str(updatedHistory))
            return str(updatedHistory['_id'])
    except Exception as e:
        print(e)
        return("ERROR : "+str(e))

def removeFromSearchHistory(item:str):
    loggedinuser=userManagement.getLoggedinUser()
    userDocs=db[loggedinuser]
    try:
        historyDoc=userDocs.find_one({"Doc_ID":"History"})
        searchText:str=historyDoc[item]
        updatedHistory=userDocs.update_one({"Doc_ID":"History"},{"$unset":{item:searchText}})
        # print("Updated: "+str(updatedHistory.modified_count))
        return({"Updated":str(updatedHistory.modified_count)})
    except Exception as e:
        print(str(e))
        return({"Error":str(e)})

def clearSearchHistory():
    loggedinuser=userManagement.getLoggedinUser()
    userDocs=db[loggedinuser]
    try:
        deletedoc=userDocs.delete_one({"Doc_ID":"History"})
        print("deleted count: "+str(deletedoc.deleted_count))
        return({"Deleted count":str(deletedoc.deleted_count)})
    except Exception as e:
        print(str(e))
        return({"Error":str(e)})

def getSearchHistory():
    loggedinuser=userManagement.getLoggedinUser()
    userDocs=db[loggedinuser]
    try:
        fullHistory=userDocs.find_one({"Doc_ID":"History"})
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

def addToWishlist(productURL:str):
    pass

def removeFromWishlist(productURL:str):
    pass