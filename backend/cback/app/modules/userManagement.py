
import json
import pymongo
import string
from flask import Flask, jsonify,request
import os
from dotenv import load_dotenv
from . import encrypt
import bcrypt

load_dotenv()
def signup(email:str,password:str):

    

    client = pymongo.MongoClient(os.environ.get("MONGO_URL"))
    db=client["accounts"]
    userCollection=db["users"]

    existingUser=userCollection.find_one({"email":email})
    if(existingUser):
        print("Exixsting user!")
        # Comparing passwords

        # hashedPassword=(encrypt.encrypt(password))
        # passw=existingUser["password"]
        
        # if bcrypt.checkpw(password.encode('utf-8'),hashedPassword):
        #     print("Match")
        # else:
        #     print("No match")

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