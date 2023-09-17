import React, { useState, useEffect, createContext } from 'react';
import { io, Socket } from 'socket.io-client';

type WebsocketContextType = {
  socketInstance: Socket;
  loading: boolean;
  buttonStatus: boolean;
};

export const WebsocketContext = createContext<WebsocketContextType>({} as WebsocketContextType);

type WebsocketProviderProps = {
  children: React.ReactNode;
};
export const WebsocketProvider: React.FC<WebsocketProviderProps> = ({ children }) => {

  const [socketInstance, setSocketInstance] = useState<Socket>();
  const [loading, setLoading] = useState(true);
  const [buttonStatus, setButtonStatus] = useState(false);

  const handleClick = () => {
    if (buttonStatus === false) {
      setButtonStatus(true);
    } else {
      setButtonStatus(false);
    }
  };

  const ConnectButton = () => {
    return (
      <button onClick={handleClick}>
        {buttonStatus === false ? "Connect" : "Disconnect"}
      </button>
    );
  }

  useEffect(() => {
    if (buttonStatus === true) {
      const socket = io("localhost:5001/", {
        transports: ["websocket"],
        cors: {
          origin: "http://localhost:3000/",
        },
      });

      setSocketInstance(socket);

      socket.on("connect", (data) => {
        console.log(data);
      });

      setLoading(false);

      socket.on("disconnect", (data) => {
        console.log(data);
      });

      return function cleanup() {
        socket.disconnect();
      };
    }
  }, [buttonStatus]);

  return (
    <WebsocketContext.Provider value={{ 
      socketInstance,
      loading,
      buttonStatus,
    }}>
      {children}
    </WebsocketContext.Provider>
  );
}