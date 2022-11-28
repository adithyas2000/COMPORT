from cgi import print_exception
from optparse import check_choice
from typing import Any
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import requests
# from bs4 import BeautifulSoup
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

from os.path import exists


# chromeWebdriver/chromedriver.exe

options=webdriver.ChromeOptions()
# options.add_argument('headless')




# def saveSS():
#     global fnum
#     driver.save_screenshot(fpath)
#     fnum=fnum+1

def scrape(iname,path):
    chrome_path=path
    driver=webdriver.Chrome(chrome_path,chrome_options=options)
    driver.get('https://keellssuper.com/home')
    # fnum=0
    # fname=str(fnum)+'kss.png'
    # fpath='/Users/Lenovo/Pictures/PythonSS/'+fname
    # driver.save_screenshot('/Users/Lenovo/Pictures/PythonSS/lll.png')



    time.sleep(2)
    # wlcBtn=driver.find_element(By.ID,'welcome_browse_btn')

    # saveSS()
    # wlcBtn.click()

    # soup=BeautifulSoup(driver.page_source,'html.parser')

    # try1=driver.find_element(By.CLASS_NAME,'product-card-name')
    print("\n\n\nReady...\n\n\n")

    try:
        elm=WebDriverWait(driver,10).until(EC.presence_of_element_located((By.CLASS_NAME,'product-card-name')))
        # print(str(elm))
    except:
        print_exception("Error. Element not loaded/not found\n")
    else:
        # links=soup.find_all(True, {"class":"product-card-name"})
        # while True:
        #     searchitem=input("What are you searching for?")
        #     if(searchitem!=""):
        #         break
        searchitem=iname
        searchlink="https://keellssuper.com/product?cat=4&s=~"+searchitem
        driver.get(searchlink)

        time.sleep(3)
        # Scroll till bottom to load all elements
        initialHeight=driver.execute_script("return document.body.scrollHeight")

        while True:
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(0.5)
            newHeight=driver.execute_script("return document.body.scrollHeight")
            if(newHeight==initialHeight):
                break
            initialHeight=newHeight

        items=driver.find_elements(by=By.XPATH,value='//div[@class="product-card-name btn col-md-12"]')
        prices=driver.find_elements(by=By.XPATH,value='//div[@class="product-card-final-price"]')
        images=driver.find_elements(by=By.XPATH,value='//img[@class="img-fluid"]')

        # imageFiltered:Any
        for image in images:
            if((image.get_attribute("src").find("essstr.blob"))==-1):
                print("Removing : "+image.get_attribute("src"))
                images.remove(image)
        
        print("\n\n\nFound:\n")
        print(str(len(items)))
        print(str(len(prices)))
        print(str(len(images)))
        for item in items:
            icheck=item.text.find("Keells")
            if(icheck!=-1):
                print(item.text)
            else:
                print("No items found")
            if(item.text!=""):
                print(item.text)

        if(len(items)!=0):
            itemtxt=[]
            pricetxt=[]
            imgUrl=[]
            for i in range(len(items)):
                imgUrl.append(images[i].get_attribute("src"))
                itemtxt.append(items[i].text)
                pricetxt.append(prices[i].text)


    finally:
        driver.quit()
        # return details

    
    class details():
        ilist=itemtxt
        plist=pricetxt
        urllist=imgUrl
        lsize=len(items)
    return(details)

def checkFile():
    chrome_path=r"backend/cback/chromeWebdriver/chromedriver.exe"
    # chromeWebdriver/chromedriver.exe
    cdriveloc=exists(chrome_path)
    print("Driver file exists : "+str(cdriveloc))

def getItem(itemText:str,path:str):
    chrome_path=path
    driver=webdriver.Chrome(chrome_path,chrome_options=options)
    driver.get('https://keellssuper.com/home')
    # fnum=0
    # fname=str(fnum)+'kss.png'
    # fpath='/Users/Lenovo/Pictures/PythonSS/'+fname
    # driver.save_screenshot('/Users/Lenovo/Pictures/PythonSS/lll.png')



    time.sleep(2)
    # wlcBtn=driver.find_element(By.ID,'welcome_browse_btn')

    # saveSS()
    # wlcBtn.click()

    # soup=BeautifulSoup(driver.page_source,'html.parser')

    # try1=driver.find_element(By.CLASS_NAME,'product-card-name')
    print("\n\n\nReady...\n\n\n")

    try:
        elm=WebDriverWait(driver,10).until(EC.presence_of_element_located((By.CLASS_NAME,'product-card-name')))
        # print(str(elm))
    except:
        print_exception("Error. Element not loaded/not found\n")
    else:
        searchitem=itemText
        print("Searching for item : "+itemText)
        searchlink="https://keellssuper.com/product?cat=4&s=~"+searchitem
        driver.get(searchlink)

        time.sleep(3)

        items=driver.find_elements(by=By.XPATH,value='//div[@class="product-card-name btn col-md-12"]')
        images=driver.find_elements(by=By.XPATH,value='//img[@class="img-fluid"]')
        
        # imageFiltered:Any
        for image in images:
            if((image.get_attribute("src").find("essstr.blob"))==-1):
                print("Removing : "+image.get_attribute("src"))
                images.remove(image)
        length=len(items)
        ind=0
        print("Items: "+str(length))
        if(length>0):
            for item in items:
                if(item.text==searchitem):
                    itemDetails={}
                    

                    prodImage=driver.find_elements(by=By.XPATH,value='//img[@class="img-fluid"]')

                    itemDetails["image"]=images[ind].get_attribute("src")
                    print("Images : "+str(len(images))+" Items: "+str(len(items)))
                    item.click()
                    time.sleep(5)

                    itemurl=driver.current_url
                    
                    price=driver.find_element(by=By.XPATH,value='//span[@class="product-card-final-price"]')

                    itemDetails["URL"]=itemurl
                    itemDetails["name"]=itemText
                    itemDetails["price"]=price.text
                    print("Keells get item: ")
                    print(itemDetails)
                    return itemDetails

                else:
                    print("ITEMTEXT: "+item.text)
                    print("sTEXT: "+searchitem)
                ind=ind+1

            return 'nomatch found'
        else:
            return({"Error":"Item not found"})
    finally:
        driver.close()

checkFile()