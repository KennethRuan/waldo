import React, { useRef, useEffect, useState, useCallback } from 'react';

const ScrollingImageWithIcon = () => {
  const canvasRef = useRef(null);
  const [velocityX, setVelocityX] = useState(0); // Initialize with 0 velocity
  const [velocityY, setVelocityY] = useState(0); // Initialize with 0 velocity
  const [imageX, setImageX] = useState(0); // Image X position
  const [imageY, setImageY] = useState(0); // Image Y position
  const [iconX, setIconX] = useState(0); // Icon X position
  const [iconY, setIconY] = useState(0); // Icon Y position
  const iconSpeed = 2; // Adjust the speed of the icon movement

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.src = 'path_to_your_image.jpg'; // Replace with your image path

    const icon = new Image();
    icon.src = 'path_to_your_icon.png'; // Replace with your icon path
    const iconWidth = 32; // Set the icon width
    const iconHeight = 32; // Set the icon height

    let x = 0;
    let y = 0;

    const drawImage = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, x, y);
      ctx.drawImage(icon, iconX, iconY, iconWidth, iconHeight);
    };

    const moveIcon = {
      
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
        setIconX(x);
        drawImage();
      } else { // We have reached the end
        // Stop scrolling in the X-axis
        if (x + imageWidth <= canvasWidth) {
          x = 0;
        } else {
          x = canvasWidth - imageWidth;
        }
        setIconX(prevX => prevX + velocityX);
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
      moveIcon();
      animate();
    };

    return () => {
      // Cleanup
      cancelAnimationFrame(animate);
    };
  }, [velocityX, velocityY, iconX, iconY]);

  // Dynamically adjust velocityX and velocityY as needed in your app

  return <canvas ref={canvasRef} />;
};

export default ScrollingImageWithIcon;
