''' Demonstrates how to subscribe to and handle data from gaze and event streams '''

import json
from flask import Flask
from flask_socketio import SocketIO, emit

app = Flask(__name__)
sio = SocketIO(app, cors_allowed_origins="*")

server = None

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


import time
import numpy as np
import adhawkapi
import adhawkapi.frontend

DOUBLE_BLINK_DURATION = 1.2


class FrontendData:
    ''' BLE Frontend '''

    def __init__(self):
        
        #0: null
        #1: calibrating the points
        #2: gameplay
        self.state = 1

        # Instantiate an API object
        # TODO: Update the device name to match your device
        self._api = adhawkapi.frontend.FrontendApi(ble_device_name='ADHAWK MINDLINK-297')

        # Tell the api that we wish to receive eye tracking data stream
        # with self._handle_et_data as the handler
        self._api.register_stream_handler(adhawkapi.PacketType.EYETRACKING_STREAM, self._handle_et_data)

        # Tell the api that we wish to tap into the EVENTS stream
        # with self._handle_events as the handler
        self._api.register_stream_handler(adhawkapi.PacketType.EVENTS, self._handle_events)

        # Start the api and set its connection callback to self._handle_tracker_connect/disconnect.
        # When the api detects a connection to a MindLink, this function will be run.
        self._api.start(tracker_connect_cb=self._handle_tracker_connect,
                        tracker_disconnect_cb=self._handle_tracker_disconnect)
        
        #stores the previous (x,y,z) coordinate for gaze
        self.px, self.py, self.pz = 0,0,0

        #stores the time of the previous blink
        self.pblink = -1000
        
        #coordinates for the three corners for the plane, starting from the top left and going clockwise
        self.plane_points = []

        #constants for the plane in standard form: ax + by + cz + d = 0
        self.a, self.b, self.c, self.d = 0,0,0,0
        
        #screen sizes
        self.height, self.width = 0,0

        #check if the last seq of blinks was a double blink or not
        self.doubleBlink = False
    
    def updateState(self, state):
        self.state = state

    def find_plane_param(self):
        point1 = self.plane_points[0]
        point2 = self.plane_points[1]
        point3 = self.plane_points[2]

        point1 = np.array(point1)
        point2 = np.array(point2)
        point3 = np.array(point3)

        self.width = max(point3[0], point2[0], point1[0]) - min(point3[0], point2[0], point2[0]) #bottom right - top right (y coord)
        self.height = max(point3[1], point2[1], point1[1]) - min(point3[1], point2[1], point2[1]) #bottom right - top right (y coord)
        print(f"height {self.height}, width {self.width}")
        # Calculate two vectors on the plane
        vector1 = point2 - point1
        vector2 = point3 - point1

        # Calculate the normal vector of the plane using the cross product
        normal_vector = np.cross(vector1, vector2)

        # The equation of the plane is in the form ax + by + cz + d = 0, so we need to find d
        # You can use any of the three points to find d
        self.a, self.b, self.c = normal_vector[0], normal_vector[1], normal_vector[2]
        self.d = -np.dot(normal_vector, point1)

        # The equation of the plane is now determined
        print(f"The equation of the plane is {normal_vector[0]}x + {normal_vector[1]}y + {normal_vector[2]}z + {self.d} = 0")
        
    def shutdown(self):
        '''Shutdown the api and terminate the bluetooth connection'''
        self._api.shutdown()

    def normalize_point(self, pt):
        # Calculate the distance from the fourth point to the global plane
        pt = np.array(pt)
        x0,y0,z0 = pt[0], pt[1], pt[2]
        t = - (self.a*x0 + self.b*y0 + self.c*z0)/(self.a**2 + self.b ** 2+ self.c**2)

        closest_point_on_plane = [x0 + t*self.a,y0 + t*self.b,z0 + t*self.c]
        closest_point_on_plane -= np.array(self.plane_points[0])
        closest_point_on_plane[1] *= -1 #flip the y-coord

        closest_point_on_plane[0]/=self.width
        closest_point_on_plane[1]/=self.height
        
        return closest_point_on_plane

    def _handle_et_data(self, et_data: adhawkapi.EyeTrackingStreamData):
        ''' Handles the latest et data '''
        if et_data.gaze is not None:
            xvec, yvec, zvec, vergence = et_data.gaze
            # if self.state == 2:
            #     normalized_point = self.normalize_point ([xvec, yvec, zvec])
            #     self.px, self.py, self.pz = normalized_point[0], normalized_point[1], normalized_point[2]
            # else:
            print(f'Gaze={xvec:.2f},y={yvec:.2f}')
        
        if et_data.pupil_diameter is not None:
            if et_data.eye_mask == adhawkapi.EyeMask.BINOCULAR:
                rdiameter, ldiameter = et_data.pupil_diameter
                #print(f'Pu  pil diameter: Left={ldiameter:.2f} Right={rdiameter:.2f}')

    def _handle_events(self, event_type, timestamp, *args):
        if event_type == adhawkapi.Events.BLINK:
            #print(timestamp, "Blink")
            # if self.doubleBlink == True:
            #     if self.state == 1: # in the actual application, double blink might be difficult to get consistently
            #         print(f"Coord  {len(self.plane_points)}:  {self.px}, {self.py}, {self.pz}")
            #         self.plane_points.append([self.px,self.py,self.pz])
            #         if len(self.plane_points) == 3:
            #             print("Finished Calibrating")
            #             self.find_plane_param()
            #             self.state = 2
            #     self.doubleBlink = False
        
            # print(f"Blink:  {[self.px, self.py, self.pz]}")
            # if self.state == 2:
            #     print(f"Normalized {self.normalize_point([self.px,self.py,self.pz])}")
            # if timestamp - self.pblink < DOUBLE_BLINK_DURATION:
            #     print(timestamp - self.pblink, 'Double Blink!')
            #     self.doubleBlink = True
        
            self.pblink = timestamp
        
    def _handle_tracker_connect(self):
        print("Tracker connected")
        self._api.set_et_stream_rate(20, callback=lambda *args: None)

        self._api.set_et_stream_control([
            adhawkapi.EyeTrackingStreamTypes.GAZE,
            adhawkapi.EyeTrackingStreamTypes.EYE_CENTER,
            adhawkapi.EyeTrackingStreamTypes.PUPIL_DIAMETER,
            adhawkapi.EyeTrackingStreamTypes.IMU_QUATERNION,
        ], True, callback=lambda *args: None)

        self._api.set_event_control(adhawkapi.EventControlBit.BLINK, 1, callback=lambda *args: None)
        self._api.set_event_control(adhawkapi.EventControlBit.EYE_CLOSE_OPEN, 1, callback=lambda *args: None)

    def _handle_tracker_disconnect(self):
        print("Tracker disconnected")

    def emit_data_woo(self):
        sio.emit("data", {"data": f"{self.px} {self.py} {self.pz}"})
    

def main():
    global server
    server = Server()
    server.start()

    # while True:
    #     sio.sleep(15)
    #     server.send_msg("data", {"data": "This is a test"})

    ''' AdHawk entrypoint '''
    frontend = FrontendData(server)
    try:
        while True:
            sio.sleep(1)
            frontend.emit_data_woo()
    except (KeyboardInterrupt, SystemExit):
        frontend.shutdown()


if __name__ == '__main__':
    main()