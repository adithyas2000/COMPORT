getstr="asdas1-asdasd2-asdasd3-asdads4-asdads5"
split=getstr.split('-')
print(len(split))

concatStr:str=""
if(len(split)>1):
    for n in range (0,len(split)-1):
        print("Iter:"+str(n))
        if (n==0):
            concatStr=concatStr+split[n]
        else:
            concatStr=concatStr+"-"+split[n]
    print(concatStr)
