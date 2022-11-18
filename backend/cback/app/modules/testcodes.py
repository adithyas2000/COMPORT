# getstr="asdas1-asdasd2-asdasd3-asdads4-asdads5"
# split=getstr.split('-')
# print(len(split))

# concatStr:str=""
# if(len(split)>1):
#     for n in range (0,len(split)-1):
#         print("Iter:"+str(n))
#         if (n==0):
#             concatStr=concatStr+split[n]
#         else:
#             concatStr=concatStr+"-"+split[n]
#     print(concatStr)

x = 0
for i in range(24):
  colors = ""
  for j in range(5):
    code = str(x+j)
    colors = colors + "\33[" + code + "m\\33[" + code + "m\033[0m "
  print(colors)
  x = x + 5