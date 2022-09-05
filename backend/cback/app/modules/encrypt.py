import os
import string
import bcrypt
import hashlib

def encrypt(data:string):
    salt:string=bcrypt.gensalt()
    encoded=data.encode('utf-8')
    hashedData=bcrypt.hashpw(encoded,salt)
    return hashedData