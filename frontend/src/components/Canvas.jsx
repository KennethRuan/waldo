import React, { useEffect, useState, useRef } from 'react';
import { io } from "socket.io-client";
import waldo1 from '../waldo1.jpg'
import magGlass from '../magGlass.png'
import WaldoHeadshot from './WaldoHeadshot';
import ScrollingImage from './ScrollingImage';
import waldo1solved from '../waldo1solved.jpg'
import waldoCircle from '../waldoCircle.png'

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

var area = 0;
var percentage = 0;
const ImageCanvas = () => {

  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ETHistory, setETHistory] = useState([]); // x, y
  const [dataGrab, setDataGrab] = useState(null);
  const [waldoClicked, setWaldoClicked] = useState(false);
  const [xLog, setXLog] = useState([]); 
  const [yLog, setYLog] = useState([]); 

  const [GameOver, setGameOver] = useState(false);
  

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
    if (GameOver) return;

    socket.on("data", (data) => {
      if (GameOver) return;
      if (data.data){
        setETHistory(prevETHistory => [...prevETHistory, data.data]);
        // console.log("Reading", data.data);
  
        // Assuming data.data[0] represents velocity for x-axis and data.data[1] for y-axis
        var [dx, dy] = data.data;

        // Calculate the new position for the magnifying glass based on velocity
        const magnifyingGlass = document.getElementById('magGlass');
        const currentX = parseFloat(getComputedStyle(magnifyingGlass).getPropertyValue('left'));
        const currentY = parseFloat(getComputedStyle(magnifyingGlass).getPropertyValue('top'));

        // ax, ay - adjusted x and y based on relative position of the magnifying glass
        // const ax = (dx - currentX * (7/window.innerWidth)) * 10 
        // const ay = (dy - currentX * (7/window.innerHeight)) * 10 
        const adjustSpeed = (x) => {
          if (x > 0.03) {
            return 10;
          }
          else if (x < -0.03) {
            return -10;
          }
          return 0;
        }
        
        const ax = adjustSpeed(dx);
        const ay = adjustSpeed(dy);

        const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

        // console.log("ax", ax, "ay", ay)

        // Adjust the magnifying glass position based on velocity
        const newX = clamp(currentX + ax, 40, window.innerWidth - 40 - 150);
        const newY = clamp(currentY + ay, 40, window.innerHeight - 40 - 150);

        setXLog(prevXLog => [...prevXLog, newX+75]);
        setYLog(prevYLog => [...prevYLog, newY+75]);

        // if(ax>0) console.log("Right");
        // else if(ax<0) console.log("Left");

        // if(ay>0) console.log("Down");
        // else if(ay<0) console.log("Up");


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

  function drawLine(x1, y1, x2, y2) {
    const distance = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
    const xMid = (x1+x2)/2 - distance / 2;
    const yMid = (y1+y2)/2;
    const slope = Math.atan2(y1 - y2, x1 - x2) * 180 / Math.PI;
    const line = document.createElement('div');
    line.className = 'line';
    // line.style.width = distance + 'px';
    line.style.top = yMid + 'px';
    line.style.left = xMid + 'px';
    line.style.transform = "rotate("+slope+"deg)";
    document.body.appendChild(line);
    console.log("line");
  }
  
  function clickWaldo(){
    setWaldoClicked(true)    
    traceBack()
    //invis magnifying glass
    //change the background001
  }
  function traceBack() {
    console.log("HEREHRE", xLog, yLog);
    var index = 0;
    const intervalID = setInterval(function() {
        if (index > xLog.length || index > yLog.length) {
          clearInterval(intervalID);
          setTimeout(() => {
            setGameOver(true);
          }, 3000);
        }
        if (index > 0) {
          if(xLog[index] >0){
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.style.left = xLog[index] + 'px';
            dot.style.top = yLog[index] + 'px';
            area += 40 * 10;
            document.body.appendChild(dot);
            drawLine(xLog[index], yLog[index], xLog[index - 1], yLog[index - 1]);
            console.log(xLog[index]);
          }
        }
        index++;
        console.log("dot");
        percentage = 100 * area / (window.innerHeight * window.innerWidth);
        console.log("area " + area);
        console.log(percentage + ".7%");
      }, 50)
      
  }
  
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
    <>
      <div className="canvasContainer">
        <WaldoHeadshot />
        {GameOver ? <div className="percentage"><h1> {(Math.round(percentage * 100) / 100).toFixed(2)}% Complete </h1></div> : null}
        <img class="waldoImage" src={waldoClicked ? waldo1solved : waldo1}></img>
        <img id="magGlass" src={magGlass} style={{visibility: (waldoClicked ? 'hidden' : 'visible')}}/>
        <a onClick={clickWaldo}><div id="hitbox"><button></button></div></a>
      </div>
    </>
  )
};

export default ImageCanvas;
