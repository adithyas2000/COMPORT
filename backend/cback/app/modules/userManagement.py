import json
from flask_login import current_user, logout_user
import pymongo
import string
from flask import Flask, jsonify,request
import os
from dotenv import load_dotenv
from . import encrypt,User
import bcrypt
import jwt

load_dotenv()
try:
    client = pymongo.MongoClient(os.environ.get("MONGO_URL"))
except Exception as e:
    print(e)
    try:
        client = pymongo.MongoClient(os.environ.get("MONGO_URL_ALT"))
    except Exception as e2:
        print(e2)


db=client["accounts"]
userCollection=db["users"]


def signup(email:str,password:str):

    



    existingUser=userCollection.find_one({"email":email})
    if(existingUser):
        print("Exixsting user!")


        return({"Error":"User already exists"})
    else:
        encrypedPassword=encrypt.encrypt(password)
        passwordStr:string=encrypedPassword.decode('utf-8')
        newUser=userCollection.insert_one({"email":email,"password":encrypedPassword})
        print("Insert:"+str(newUser))

    
    
    print(client.list_database_names())
    db=client.users

    
    
    userData={
        "email":email
    }

    print("RETURNING:"+"Response : Success")
    return(userData)

def login(email:str,password:str):
    validUser=userCollection.find_one({"email":email})
    if(validUser!=None):
        print(validUser['_id'])
        # Comparing passwords
        passw=validUser["password"]
        
        if bcrypt.checkpw(password.encode('utf-8'),passw):
            print("Match")
            user_jwt=jwt.encode({"email":email,"type":"user"},os.environ.get('JWT_SECRET'))
            return({"email":email,"id":str(validUser['_id']),"auth":user_jwt})
        else:
            print("No match")
            return({"Error":"Failed to authorize"})
    else:
        return({"Error":"No account registered with the email"})

def logout():
    logout_user()
    
def getUser(email:str):
    user=userCollection.find_one({"email":email})
    print(user["email"])
    return({"email":user['email'],"id":str(user['_id'])})

def getLoggedinUser():
    currentEmail:str=current_user.get_email()
    return currentEmail