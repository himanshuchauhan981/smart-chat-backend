from socket import socket, AF_INET, SOCK_STREAM


host =""
port = 8080
s = socket(AF_INET,SOCK_STREAM)
s.bind((host,port))
s.listen(1)
conn,addr = s.accept()
print("Connected by", addr)
while True:
    print("Hello")
    data = conn.recv(1024)
    print("Received ",repr(data))
    reply = input("Reply : ")
    conn.sendall(reply)
conn.close()
