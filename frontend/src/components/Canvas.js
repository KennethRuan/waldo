import React, { useRef, useEffect } from 'react';

const ImageCanvas = () => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = imageRef.current;

    // Load the image into the canvas
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
    };

    image.src = 'waldo1.jpg'; // Replace with your image URL

    // Add mousemove event listener for automatic scrolling
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  let scrollInterval;

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const canvasRect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;

    const scrollSpeed = 5; // Adjust as needed

    console.log('CanvasRect:', canvasRect.width, canvasRect.height)
    console.log('MouseX:', mouseX);
    console.log('MouseY:', mouseY);

    clearInterval(scrollInterval);

    if (mouseX < 10) {
      console.log('Scrolling left');
      scrollInterval = setInterval(() => {
        canvas.scrollLeft -= scrollSpeed;
      }, 10);
    } else if (mouseX > canvas.width - 10) {
      console.log('Scrolling right');
      scrollInterval = setInterval(() => {
        canvas.scrollLeft += scrollSpeed;
      }, 10);
    } else if (mouseY < 10) {
      console.log('Scrolling up');
      scrollInterval = setInterval(() => {
        canvas.scrollTop -= scrollSpeed;
      }, 10);
    } else if (mouseY > canvas.height - 10) {
      console.log('Scrolling down');
      scrollInterval = setInterval(() => {
        canvas.scrollTop += scrollSpeed;
      }, 10);
    }
  };

  return (
    <div style={{ overflow: 'auto' }}>
      <canvas ref={canvasRef}></canvas>
      <img ref={imageRef} style={{ display: 'none' }} alt="Image" />
    </div>
  );
};

export default ImageCanvas;
