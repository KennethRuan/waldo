''' Demonstrates how to subscribe to and handle data from gaze and event streams '''

import time

import adhawkapi
import adhawkapi.frontend

DOUBLE_BLINK_DURATION = 1
class FrontendData:
    ''' BLE Frontend '''

    def __init__(self):
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
        
        #coordinates for the three corners for the plane
        self.plane_points = []

        #constants for the plane in standard form: ax + by + cz + d = 0
        self.a, self.b, self.c, self.d = 0,0,0,0

        #determines if we are calibrating the plane
        self.plane_calibrate = False

    def shutdown(self):
        '''Shutdown the api and terminate the bluetooth connection'''
        self._api.shutdown()

    def _handle_et_data(self, et_data: adhawkapi.EyeTrackingStreamData):
        ''' Handles the latest et data '''
        if et_data.gaze is not None:
            xvec, yvec, zvec, vergence = et_data.gaze
            self.px, self.py, self.pz = xvec, yvec, zvec
            #print(f'Gaze={xvec:.2f},y={yvec:.2f},z={zvec:.2f},vergence={vergence:.2f}')
        
        if et_data.pupil_diameter is not None:
            if et_data.eye_mask == adhawkapi.EyeMask.BINOCULAR:
                rdiameter, ldiameter = et_data.pupil_diameter
                print(f'Pupil diameter: Left={ldiameter:.2f} Right={rdiameter:.2f}')

    def _handle_events(self, event_type, timestamp, *args):
        if event_type == adhawkapi.Events.BLINK:
            print(timestamp, "Blink")

            if timestamp - self.pblink < DOUBLE_BLINK_DURATION:
                print(timestamp - self.pblink, 'Double Blink!')
                print(self.px, self.py, self.pz)
                if self.plane_calibrate == True:
                    self.plane_points.push([self.px,self.py,self.pz])
                    if len(self.plane_points) == 3:
                        self.plane_calibrate = False

            self.pblink = timestamp
        
    def _handle_tracker_connect(self):
        print("Tracker connected")
        self._api.set_et_stream_rate(60, callback=lambda *args: None)

        self._api.set_et_stream_control([
            adhawkapi.EyeTrackingStreamTypes.GAZE,
            adhawkapi.EyeTrackingStreamTypes.EYE_CENTER,
            adhawkapi.EyeTrackingStreamTypes.PUPIL_DIAMETER,
            adhawkapi.EyeTrackingStreamTypes.IMU_QUATERNION,
        ], True, callback=lambda *args: None)

        self._api.set_event_control(adhawkapi.EventControlBit.BLINK, 1, callback=lambda *args: None)
        self._api.set_event_control(adhawkapi.EventControlBit.EYE_CLOSE_OPEN, 1, callback=lambda *args: None)

    def find_plane_param(self):
        self.plane_calibrate = True
        
    def _handle_tracker_disconnect(self):
        print("Tracker disconnected")


def main():
    ''' App entrypoint '''
    frontend = FrontendData()
    try:
        while True:
            time.sleep(1)
    except (KeyboardInterrupt, SystemExit):
        frontend.shutdown()

if __name__ == '__main__':
    main()
