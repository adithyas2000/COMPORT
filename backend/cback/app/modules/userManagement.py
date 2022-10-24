import json
from flask_login import current_user, logout_user
import pymongo
import string
from flask import Flask, jsonify,request
import os
from dotenv import load_dotenv
from . import encrypt,User
import bcrypt

load_dotenv()

client = pymongo.MongoClient(os.environ.get("MONGO_URL"))
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
    print(validUser['_id'])
    # Comparing passwords
    passw=validUser["password"]
    
    if bcrypt.checkpw(password.encode('utf-8'),passw):
        print("Match")
        return({"email":email,"id":str(validUser['_id'])})
    else:
        print("No match")
        return({"Error":"Failed to authorize"})

def logout():
    logout_user()
    
def getUser(email:str):
    user=userCollection.find_one({"email":email})
    print(user["email"])
    return({"email":user['email'],"id":str(user['_id'])})