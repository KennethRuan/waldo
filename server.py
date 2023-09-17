import json
from flask import Flask
from flask_socketio import SocketIO, emit

app = Flask(__name__)
sio = SocketIO(app, cors_allowed_origins="*")

@sio.on("connect")
def connect():
    emit("server_status", "server_up")
    print("connect ")

@sio.on("message")
def message(data):
    print("message ", data)

@sio.on("disconnect")
def disconnect():
    print('disconnect ')

class Server(object):
    def __init__(self):
        self.thread = None

    def start_server(self):
        print("starting")
        sio.run(app, debug=True, use_reloader=False)

    def start(self):
        self.thread = sio.start_background_task(self.start_server)

    def send_msg(self, type, data):
        print("Sending message", data)
        sio.emit(type, data)

    def wait(self):
        self.thread.join()

if __name__ == "__main__":
    server = Server()
    server.start()

    while True:
         sio.sleep(15)
         server.send_msg("data", {"data": "This is a test"})

    server.wait()