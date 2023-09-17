import React, { useEffect, useState, useRef } from 'react';
import { io } from "socket.io-client";
import waldo1 from '../waldo1.jpg'
import magGlass from '../magGlass.png'

// function getMousePosition() {
//   const [mousePosition, setMousePosition] = useState({x: null, y: null});

//   const handleMouseMove = e => {
//     setMousePosition({
//       x: e.pageX,
//       y: e.pageY,
//     });
//   };

//   useEffect(() => {
//     window.addEventListener('mousemove', handleMouseMove);

//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//     };
//   }, []);

//   return mousePosition;
// }

const ImageCanvas = () => {

  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ETHistory, setETHistory] = useState([]); // x, y

  useEffect(() => {
    const socket_ = io("localhost:5000/", {
      transports: ["websocket"],
      cors: {
        origin: "http://localhost:3000/",
      },
    });

    setSocket(socket_);

    socket_.on("connect", (data) => {
      console.log(data);
    });

    setLoading(false);

    socket_.on("disconnect", (data) => {
      console.log(data);
    });

    return function cleanup() {
      socket_.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("data", (data) => {
      console.log("New ET data", data.data)

      if (data.data){
        setETHistory(prevETHistory => [...prevETHistory, data.data]);
        console.log("Reading", data.data)

        const triggerKeyDown = (key) => {
          const event = new KeyboardEvent('keydown', {
            key: key,
            code: `Key${key.toUpperCase()}`,
            keyCode: key.charCodeAt(0),
            which: key.charCodeAt(0),
            bubbles: true,
          });
          console.log("Event", event);
          window.dispatchEvent(event);
        };
        
        if (data.data[0] < 0) {
          triggerKeyDown('a');
        } else if (data.data.x > 0) {
          triggerKeyDown('d');
        }

        if (data.data[1] < 0) {
          triggerKeyDown('w');
        } else if (data.data.y > 0) {
          triggerKeyDown('s');
        }

      }
    });

    
    return () => {
      socket.off("data", () => {
        console.log("data event was removed");
      });
    };
  }, [socket]);



  document.addEventListener('keydown', function(event) {
    // Check if the pressed key is "W" (case-insensitive)
    if (event.key === 'd' || event.key === 'D') {
      const startX = window.scrollX;
      const theMag = document.getElementById('magGlass');
      const theMagX = parseFloat(getComputedStyle(theMag).getPropertyValue('left'));
      const middleX = window.innerWidth /  2 - 75;
      if (theMagX < middleX) {
        const newMagX = theMagX + 10;
        document.getElementById('magGlass').style.left = newMagX + 'px';
      } else {
        window.scrollTo({left: startX+50, behavior: 'smooth'});
      }
    }
  });

  document.addEventListener('keydown', function(event) {
    // Check if the pressed key is "W" (case-insensitive)
    if (event.key === 's' || event.key === 'S') {
      const startY = window.scrollY;
      window.scrollTo({top: startY+50, behavior: 'smooth'});
    }
  });

  document.addEventListener('keydown', function(event) {
    // Check if the pressed key is "W" (case-insensitive)
    if (event.key === 'w' || event.key === 'W') {
      const startY = window.scrollY;
      window.scrollTo({top: startY-50, behavior: 'smooth'});
    }
  });

  document.addEventListener('keydown', function(event) {
    // Check if the pressed key is "W" (case-insensitive)
    if (event.key === 'a' || event.key === 'A') {
      const startX = window.scrollX;
      if (startX == 0) {
        const theMag = document.getElementById('magGlass');
        const theMagX = Math.max(-32, parseFloat(getComputedStyle(theMag).getPropertyValue('left')) - 10);
        document.getElementById('magGlass').style.left = theMagX + 'px';
      } else {
        window.scrollTo({left: startX-50, behavior: 'smooth'});
      }
    }
  });

  document.addEventListener('mousedown', function(event) {
    // console.log(event.clientX, event.clientY);
    console.log(document.getElementById('magGlass').style.width);
    console.log(window.scrollY);
  });


  return (
    <div id="canvas">
      <img className="image" src={waldo1}></img>
      <img id="magGlass" src={magGlass}></img>
      <a href="GameOver"><div id="hitbox"><button></button></div></a>
    </div>
  )
};

export default ImageCanvas;
