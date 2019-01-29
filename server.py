from socket import socket, AF_INET, SOCK_STREAM
import threading
host =""
port = 8080
s = socket(AF_INET,SOCK_STREAM)
s.bind((host,port))
s.listen(5)
print("Server is running")

def clientHandler():
    conn,addr = s.accept()
    print(addr," is connected")
    while 1:
        data = conn.recv(1024)
        if not data:
            break
        print("Received ",repr(data))

#for i in range(5):
t1 = threading.Thread(target=clientHandler)
t2 = threading.Thread(target=clientHandler)
t1.start()
t2.start()
#s.close()

