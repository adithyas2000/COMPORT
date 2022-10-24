class User:
    
    def __init__(self,uid:int,uemail:str,upass:str,auth:bool):
        self.is_authenticated:bool=auth
        self.id=uid
        self.email=uemail
        self.password=upass
    def get_id(self):
        return self.email
    def get_email(self):
        return self.email