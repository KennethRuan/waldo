import React, { useEffect, useState, useRef } from 'react';
import { io } from "socket.io-client";
import waldo1 from '../waldo1.jpg'
import magGlass from '../magGlass.png'
import ScrollingImage from './ScrollingImage';

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
  const [dataGrab, setDataGrab] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'a' || event.key === 'A') {
        // Handle 'a' key press
        const startX = window.scrollX;
        if (startX === 0) {
          // Modify the magnifying glass position or perform other actions
          const theMag = document.getElementById('magGlass');
          const theMagX = Math.max(
            -32,
            parseFloat(getComputedStyle(theMag).getPropertyValue('left')) - 10
          );
          document.getElementById('magGlass').style.left = theMagX + 'px';
        } else {
          // Scroll to the left
          window.scrollTo({ left: startX - 50, behavior: 'smooth' });
        }
      } else if (event.key === 'd' || event.key === 'D') {
        // Handle 'd' key press
        const startX = window.scrollX;
        const theMag = document.getElementById('magGlass');
        const theMagX = parseFloat(
          getComputedStyle(theMag).getPropertyValue('left')
        );
        const middleX = window.innerWidth / 2 - 75;
        if (theMagX < middleX) {
          // Modify the magnifying glass position or perform other actions
          const newMagX = theMagX + 10;
          document.getElementById('magGlass').style.left = newMagX + 'px';
        } else {
          // Scroll to the right
          window.scrollTo({ left: startX + 50, behavior: 'smooth' });
        }
      } else if (event.key === 'w' || event.key === 'W') {
        // Handle 'w' key press
        const startY = window.scrollY;
        // Scroll up
        window.scrollTo({ top: startY - 50, behavior: 'smooth' });
      } else if (event.key === 's' || event.key === 'S') {
        // Handle 's' key press
        const startY = window.scrollY;
        // Scroll down
        window.scrollTo({ top: startY + 50, behavior: 'smooth' });
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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

    setDataGrab(
      setInterval(function() {
        socket_.emit('grabData');
      }, 100)
    );

    return function cleanup() {
      socket_.disconnect();
      clearInterval(dataGrab);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("data", (data) => {
      console.log("New ET data", data.data)

      if (data.data){
        setETHistory(prevETHistory => [...prevETHistory, data.data]);
        console.log("Reading", data.data);
  
        // Assuming data.data[0] represents velocity for x-axis and data.data[1] for y-axis
        var [dx, dy] = data.data;
        dx*=10
        dy*=10
        // Calculate the new position for the magnifying glass based on velocity
        const magnifyingGlass = document.getElementById('magGlass');
        const currentX = parseFloat(getComputedStyle(magnifyingGlass).getPropertyValue('left'));
        const currentY = parseFloat(getComputedStyle(magnifyingGlass).getPropertyValue('top'));
        
        // Adjust the magnifying glass position based on velocity
        const newX = currentX + dx;
        const newY = currentY + dy;
        if(dx>0) console.log("Right");
        else if(dx<0) console.log("Left");
        if(dy>0) console.log("Down");
        else if(dy<0) console.log("Up");


        // Set the new position for the magnifying glass
        magnifyingGlass.style.left = newX + 'px';
        magnifyingGlass.style.top = newY + 'px';
      }
    });

    return () => {
      socket.off("data", () => {
        console.log("data event was removed");
      });
    };
  }, [socket]);



  // document.addEventListener('keydown', function(event) {
  //   // Check if the pressed key is "W" (case-insensitive)
  //   if (event.key === 'd' || event.key === 'D') {
  //     const startX = window.scrollX;
  //     const theMag = document.getElementById('magGlass');
  //     const theMagX = parseFloat(getComputedStyle(theMag).getPropertyValue('left'));
  //     const middleX = window.innerWidth /  2 - 75;
  //     if (theMagX < middleX) {
  //       const newMagX = theMagX + 10;
  //       document.getElementById('magGlass').style.left = newMagX + 'px';
  //     } else {
  //       window.scrollTo({left: startX+50, behavior: 'smooth'});
  //     }
  //   }
  // });

  // document.addEventListener('keydown', function(event) {
  //   // Check if the pressed key is "W" (case-insensitive)
  //   if (event.key === 's' || event.key === 'S') {
  //     const startY = window.scrollY;
  //     window.scrollTo({top: startY+50, behavior: 'smooth'});
  //   }
  // });

  // document.addEventListener('keydown', function(event) {
  //   // Check if the pressed key is "W" (case-insensitive)
  //   if (event.key === 'w' || event.key === 'W') {
  //     const startY = window.scrollY;
  //     window.scrollTo({top: startY-50, behavior: 'smooth'});
  //   }
  // });

  // document.addEventListener('keydown', function(event) {
  //   // Check if the pressed key is "W" (case-insensitive)
  //   if (event.key === 'a' || event.key === 'A') {
  //     const startX = window.scrollX;
  //     if (startX == 0) {
  //       const theMag = document.getElementById('magGlass');
  //       const theMagX = Math.max(-32, parseFloat(getComputedStyle(theMag).getPropertyValue('left')) - 10);
  //       document.getElementById('magGlass').style.left = theMagX + 'px';
  //     } else {
  //       window.scrollTo({left: startX-50, behavior: 'smooth'});
  //     }
  //   }
  // });

  // document.addEventListener('mousedown', function(event) {
  //   // console.log(event.clientX, event.clientY);
  //   console.log(document.getElementById('magGlass').style.width);
  //   console.log(window.scrollY);
  // });


  return (
    <div id="canvas">
      <img className="image" src={waldo1}></img>
      <img id="magGlass" src={magGlass}></img>
      <a href="GameOver"><div id="hitbox"><button></button></div></a>
    </div>
  )
};

export default ImageCanvas;
