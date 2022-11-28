import os
import pymongo
from datetime import datetime
try:
    client = pymongo.MongoClient(os.environ.get("MONGO_URL"))
    db=client["watchlist"]
    keelsCollection=db["keells"]
    foodcityCollection=db["foodcity"]
    arpicoCollection=db["arpico"]

except Exception as err:
    print(err)

def getWatchlist():
    pass
def getWatchItem(prodName:str,shop:str):
    if(shop=="keells"):
        itemDoc=keelsCollection.find_one({"name":prodName})
        return itemDoc
    elif(shop=="foodcity"):
        itemDoc=foodcityCollection.find_one({"name":prodName})
        return itemDoc
    elif(shop=="arpico"):
        itemDoc=arpicoCollection.find_one({"name":prodName})
        return itemDoc

def addToWatchlist(prodName:str,shop:str,price:float):
    
    date=str(datetime.now().isoformat(timespec='seconds')).split("T")[0]
    try:
        if(shop=="keells"):
            print("Adding to keels watchlist")
            itemDoc=keelsCollection.find_one({"name":prodName})
            if(itemDoc==None):
                newItem=keelsCollection.insert_one({"name":prodName,date:price})
                if(newItem!=None):
                    return {"Success":"Added to watchlist"}
            else:
                updateItem=keelsCollection.update_one({"name":prodName},{"$set":{date:price}})
                if(updateItem!=None):
                    return {"Success":"Added to watchlist"}
        elif(shop=="foodcity"):
            print("Adding to foodcity watchlist")
            itemDoc=foodcityCollection.find_one({"name":prodName})
            if(itemDoc==None):
                newItem=foodcityCollection.insert_one({"name":prodName,date:price})
                if(newItem!=None):
                    return {"Success":"Added to watchlist"}
            else:
                updateItem=foodcityCollection.update_one({"name":prodName},{"$set":{date:price}})
                if(updateItem!=None):
                    return {"Success":"Added to watchlist"}
        elif(shop=="arpico"):
            print("Adding to arpico watchlist")
            itemDoc=arpicoCollection.find_one({"name":prodName})
            if(itemDoc==None):
                newItem=arpicoCollection.insert_one({"name":prodName,date:price})
                if(newItem!=None):
                    return {"Success":"Added to watchlist"}
            else:
                updateItem=arpicoCollection.update_one({"name":prodName},{"$set":{date:price}})
                if(updateItem!=None):
                    return {"Success":"Added to watchlist"}
    except Exception as e:
        print(e)