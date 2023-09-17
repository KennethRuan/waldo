import React, { useEffect, useState, useRef } from 'react';
import { io } from "socket.io-client";
import waldo1 from '../waldo1.jpg'

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
      setETHistory(prevETHistory => [...prevETHistory, data.data]);
    });
    return () => {
      socket.off("data", () => {
        console.log("data event was removed");
      });
    };
  }, [socket]);


  const canvasRef = useRef(null);
  let mouseX;
  let mouseY;

  const handleMouseMove = (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    // console.log("X:", mouseX, "Y:", mouseY)
    // scroll(mouseX, mouseY);
  }

  const scroll = (x, y) => {
    // const scrollSpeed = 1;
    if (x < 0.1 * window.innerWidth) {
      console.log("scrolling left")
      // canvasRef.current.scrollLeft -= 5;
      // document.getElementById("App").scrollLeft += 5;
      if (mouseX < window.scrollX) {
        window.scrollTo({left: mouseX, behavior: 'smooth'});
      }
      // document.getElementById("canvas").style.transform = 'translateX(100px)';
      // console.log(document.getElementById("App").scrollLeft);
    } else if (x > 0.9 * window.innerWidth) {
      console.log("scrolling right")
      window.scrollTo({left: mouseX, behavior: 'smooth'});
    }
    if (y < 0.2 * window.innerHeight) {
      console.log("scrolling up")
      if (mouseY < window.scrollY) {
        window.scrollTo({top: mouseY, behavior: 'smooth'});
      }
    } else if (y > 0.8 * window.innerHeight) {
      console.log("scrolling down")
      window.scrollTo({top: mouseY, behavior: 'smooth'});
    }
  }

  useEffect(() => {
    const intervalID = setInterval(() => {
      scroll(mouseX, mouseY);
    }, 100);
  
  })

  // const mousePosition = getMousePosition();
  // const canvasRef = useRef(null);
  // const imageRef = useRef(null);

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext('2d');
  //   const image = imageRef.current;

  //   // Load the image into the canvas
  //   image.onload = () => {
  //     canvas.width = image.width;
  //     canvas.height = image.height;
  //     ctx.drawImage(image, 0, 0);
  //   };

  //   image.src = 'waldo1.jpg'; // Replace with your image URL

  //   // Add mousemove event listener for automatic scrolling
  //   canvas.addEventListener('mousemove', handleMouseMove);

  //   return () => {
  //     canvas.removeEventListener('mousemove', handleMouseMove);
  //   };
  // }, []);

  // let scrollInterval;

  // const handleMouseMove = (e) => {
  //   const canvas = canvasRef.current;
  //   const canvasRect = canvas.getBoundingClientRect();
  //   const mouseX = e.clientX - canvasRect.left;
  //   const mouseY = e.clientY - canvasRect.top;

  //   const scrollSpeed = 5; // Adjust as needed

  //   console.log('CanvasRect:', canvasRect.width, canvasRect.height)
  //   console.log('MouseX:', mouseX);
  //   console.log('MouseY:', mouseY);

  //   clearInterval(scrollInterval);

  //   if (mouseX < 10) {
  //     console.log('Scrolling left');
  //     scrollInterval = setInterval(() => {
  //       canvas.scrollLeft -= scrollSpeed;
  //     }, 10);
  //   } else if (mouseX > canvas.width - 10) {
  //     console.log('Scrolling right');
  //     scrollInterval = setInterval(() => {
  //       canvas.scrollLeft += scrollSpeed;
  //     }, 10);
  //   } else if (mouseY < 10) {
  //     console.log('Scrolling up');
  //     scrollInterval = setInterval(() => {
  //       canvas.scrollTop -= scrollSpeed;
  //     }, 10);
  //   } else if (mouseY > canvas.height - 10) {
  //     console.log('Scrolling down');
  //     scrollInterval = setInterval(() => {
  //       canvas.scrollTop += scrollSpeed;
  //     }, 10);
  //   }
  // };

  // return (
  //   <div style={{ overflow: 'auto' }}>
  //     <canvas ref={canvasRef}></canvas>
  //     <img ref={imageRef} style={{ display: 'none' }} alt="Image" />
  //   </div>
  // );
//  onMouseMove={(event) => handleMouseMove(event)}
  return (
    <div id="canvas" ref={canvasRef} onMouseMove={(event) => handleMouseMove(event)}>
      <img className="image" src={waldo1}></img>
      <a href="GameOver"><div id="hitbox"><button></button></div></a>
    </div>
  )
};

export default ImageCanvas;
