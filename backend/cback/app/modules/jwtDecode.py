import os
import jwt
from dotenv import load_dotenv

load_dotenv()

def decode(token:str):
    try:
        if(token.find(" ")!=-1):
            tokenSplit:str=token.replace("Bearer ","")
            print(os.environ.get("JWT_SECRET"))
            decoded=jwt.decode(tokenSplit,os.environ.get("JWT_SECRET"),algorithms=["HS256"])
            print(decoded)
            return(decoded)
        else:
            return(jwt.decode(token,os.environ.get("JWT_SECRET"),algorithms=["HS256"]))

    except Exception as e:
        print(str(e))
        return "ERROR"
    