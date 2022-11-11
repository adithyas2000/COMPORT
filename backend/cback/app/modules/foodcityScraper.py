from cgi import print_exception
from typing import List
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import requests
# from bs4 import BeautifulSoup
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time




options=webdriver.ChromeOptions()
# options.add_argument('headless')



def scrape(getitem,chrome_path):
    driver=webdriver.Chrome(chrome_path,chrome_options=options)

    # while True:
    #     searchitem=input("What are you looking for ?")
    #     if(searchitem!=""):
    #         break

    searchitem=str(getitem)

    searchlink="https://cargillsonline.com/web/product?PS="+searchitem

    # driver.get('https://cargillsonline.com/')
    driver.get(searchlink)

    time.sleep(3)

    items=driver.find_elements(by=By.XPATH,value='//p[@class="ng-binding"]')
    prices=driver.find_elements(by=By.XPATH,value='//h4[@class="txtSmall ng-binding"]')
    images=driver.find_elements(by=By.XPATH,value='//img[@class="img-fluid"]')
    if(len(items)!=0):
        itemtxt=[]
        pricetxt=[]
        imgilst=[]
        print("Found : "+str(len(items)))
        print("Found images"+str(len(images)))
        # for i in range(len(items)):
        #     print(items[i].text+'--'+prices[i].text)

        for i in range(len(images)):
            url = images[i].get_attribute("src")
            if((url.find("VendorItems")!=-1)or(url.find("loading_img1")!=-1)):
                imgilst.append(images[i].get_attribute("src"))
        print("Filtered images "+str(len(imgilst)))
        for i in range(len(items)):
            # print(items[i].text+" - "+prices[i].text)
            # imgilst.append(images[i].get_attribute("src"))
            itemtxt.append(items[i].text)
            pricetxt.append(prices[i].text)

        class details:
            ilist=itemtxt
            plist=pricetxt
            urllist=imgilst
            lsize=len(items)
            
        return(details)

        # for item in items:
        #     if(item.text!=""):
        #         print(item.text)
    else:
        print("No items found")

    time.sleep(3)
    driver.quit()

def getItem(prodName:str,chrome_path):
    driver=webdriver.Chrome(chrome_path,chrome_options=options)

    # while True:
    #     searchitem=input("What are you looking for ?")
    #     if(searchitem!=""):
    #         break

    searchitem=prodName
    split=searchitem.split('-')

    concatStr:str=""
    if(len(split)>1):
        for n in range (0,len(split)-1):
            print("Iter:"+str(n))
            if (n==0):
                concatStr=concatStr+split[n]
            else:
                concatStr=concatStr+"-"+split[n]
        print(concatStr)

    searchlink="https://cargillsonline.com/web/product?PS="+concatStr

    # driver.get('https://cargillsonline.com/')
    driver.get(searchlink)

    time.sleep(3)

    items=driver.find_elements(by=By.XPATH,value='//p[@class="ng-binding"]')

    if(len(items)>0):
        for item in items:
            if(item.text==prodName):
                item.click()
                time.sleep(2)
                itemurl=driver.current_url
                return itemurl
    else:
        return {"Error":"No items"}
        

# scrape() #For testing only. Comment out in implementation