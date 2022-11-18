import time
from cgi import print_exception

import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
# from bs4 import BeautifulSoup
from selenium.webdriver.support.ui import WebDriverWait

options=webdriver.ChromeOptions()
# ----Uncomment the following line to hide browser window (Headless mode)----
# options.add_argument('headless')



def scrape(getitem,chrome_path):
    driver=webdriver.Chrome(chrome_path,chrome_options=options)

    searchitem=str(getitem)

    searchlink="https://cargillsonline.com/web/product?PS="+searchitem

    # search does not work if hoempage is not visited
    driver.get('https://cargillsonline.com/')
    time.sleep(5)
    driver.get(searchlink)

    # wait for items to load
    wait=WebDriverWait(driver,15)
    itemVisible=wait.until(EC.visibility_of_element_located((By.XPATH,'//p[@class="ng-binding"]')),"Element item name loading timeout")
    
    # Scroll till bottom to load all elements
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight)")

    # Get references to WebElements
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
            itemtxt.append(items[i].get_attribute('title'))
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

    driver.get("https://cargillsonline.com/web/")
    time.sleep(5)
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