from socket import AF_INET,SOCK_STREAMs
s = socket(AF_INET,SOCK_STREAM)
s.connect(('',8080))
while True:
    message = input("Your Message : ")
    s.send(message)
    print("Awaiting Reply")
    reply = s.recv(1024)
    print("Received ",repr(reply))
s.close()

