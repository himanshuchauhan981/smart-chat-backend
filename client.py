from socket import socket,AF_INET,SOCK_STREAM
s = socket(AF_INET,SOCK_STREAM)
host ="127.0.0.1"
port = 8080
s.connect((host,port))
while True:
    message = bytes(input("Your Message : "),'utf-8')
    s.send(message)
    print("Awaiting Reply")
    reply = s.recv(1024)
    print("Received ",repr(reply))
s.close()

