import React, { useRef, useEffect, useState } from 'react';

const ScrollingImage = () => {
  const canvasRef = useRef(null);
  const [velocityX, setVelocityX] = useState(0); // Initialize with 0 velocity
  const [velocityY, setVelocityY] = useState(0); // Initialize with 0 velocity

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      setVelocityX(-1);
    } else if (event.key === 'ArrowRight') {
      setVelocityX(1);
    } else if (event.key === 'ArrowUp') {
      setVelocityY(-1);
    } else if (event.key === 'ArrowDown') {
      setVelocityY(1);
    }
    
    

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.src = 'waldo1.jpg'; // Replace with your image path

    let x = 0;
    let y = 0;

    const drawImage = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, x, y);
    };

    const animate = () => {
      x += velocityX;
      y += velocityY;

      const imageWidth = image.width;
      const imageHeight = image.height;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Check if we've reached the end of the image in the X-axis
      if (x + imageWidth <= canvasWidth && x >= 0) {
        drawImage();
      } else {
        // Stop scrolling in the X-axis
        if (x + imageWidth <= canvasWidth) {
          x = 0;
        } else {
          x = canvasWidth - imageWidth;
        }
      }

      // Check if we've reached the end of the image in the Y-axis
      if (y + imageHeight <= canvasHeight && y >= 0) {
        drawImage();
      } else {
        // Stop scrolling in the Y-axis
        if (y + imageHeight <= canvasHeight) {
          y = 0;
        } else {
          y = canvasHeight - imageHeight;
        }
      }

      requestAnimationFrame(animate);
    };

    image.onload = () => {
      canvas.width = image.width; // Set canvas dimensions to image dimensions
      canvas.height = image.height;
      drawImage();
      animate();
    };

    return () => {
      // Cleanup
      cancelAnimationFrame(animate);
    };
  }, [velocityX, velocityY]);

  // Dynamically adjust velocityX and velocityY as needed in your app

  return <canvas ref={canvasRef} />;
};

export default ScrollingImage;
