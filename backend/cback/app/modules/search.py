import os
from dotenv import load_dotenv
import flask_login
from modules import arpicoScraper as arpico
from modules import keellsScraper as keells
from modules import foodcityScraper as fcity
from modules import accountManager

load_dotenv()

chrome_path=os.environ.get("CHROME_DRIVER")

def mainSearch(shop1:bool,shop2:bool,shop3:bool,searchItem:str):

    if(flask_login.current_user.is_authenticated):
        accountManager.addToSearchHistory(searchItem)

    keellsProdDict={"NULL":"NULL"}
    if(shop1):
        keellsProdDet=keells.scrape(searchItem,chrome_path)
        keellsProdDict=getDataDict(keellsProdDet)

    fcProdDict={"NULL":"NULL"}
    if(shop2):
        fcProdDet=fcity.scrape(searchItem,chrome_path)
        fcProdDict=getDataDict(fcProdDet)

    arpicoProdDict={"NULL":"NULL"}
    if(shop3):
        arpicoDet=arpico.scrape(searchItem,chrome_path)
        arpicoProdDict=getDataDict(arpicoDet)

    resultArray=[keellsProdDict,fcProdDict,arpicoProdDict]
    return resultArray

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