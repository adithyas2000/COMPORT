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

    searchlink="https://arpicosupercentre.com/catalogsearch/result/?q="+searchitem

    # driver.get('https://cargillsonline.com/')
    driver.get(searchlink)

    time.sleep(3)

    items=driver.find_elements(by=By.XPATH,value='//a[@class="product-item-link"]')
    prices=driver.find_elements(by=By.XPATH,value='//div[@class="product-item-info"]//descendant::span[@data-price-type="finalPrice"]/span[@class="price"]')
    
    images=driver.find_elements(by=By.XPATH,value='//span[@class="main-image"]//descendant::img[@class="product-image-photo"]')
    
    if(len(items)!=0):
        itemtxt=[]
        pricetxt=[]
        imgilst=[]
        print("Found : "+str(len(items)))
        print("Found images"+str(len(images)))
        print("Found prices "+str(len(prices)))
        for i in range (len(prices)):
            print(str(i)+": "+prices[i].text)
        # for i in range(len(items)):
        #     print(items[i].text+'--'+prices[i].text)

        for i in range(len(images)):
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

def getItem(prodName:str,chrome_path:str):
    driver=webdriver.Chrome(chrome_path,chrome_options=options)

    # while True:
    #     searchitem=input("What are you looking for ?")
    #     if(searchitem!=""):
    #         break

    searchitem=str(prodName)

    searchlink="https://arpicosupercentre.com/catalogsearch/result/?q="+searchitem

    # driver.get('https://cargillsonline.com/')
    driver.get(searchlink)

    time.sleep(3)

    items=driver.find_elements(by=By.XPATH,value='//a[@class="product-item-link"]')

    if(len(items)>0):
        for item in items:
            if(item.text==prodName):
                itemdata={}
                itemdata["name"]=item.text

                item.click()
                time.sleep(3)

                price=driver.find_elements(by=By.XPATH,value='//span[@class="price"]')[1]
                image=driver.find_element(by=By.XPATH,value='//img[@class="fotorama__img"]')
                itemdata["image"]=image.get_attribute('src')
                itemdata["price"]=price.text
                itemdata["URL"]=driver.current_url
                return itemdata
                
    else:
        return {"Error":"No matches"}

    
#For testing only. Comment out in implementation
# scrape('carrot',r"backend/cback/chromeWebdriver/chromedriver.exe") 