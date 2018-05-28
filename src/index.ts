// Require Stylesheets
import './index.css';

// Add a canvas element to the DOM
const canvasElement = document.createElement('canvas');
const canvasContext = canvasElement.getContext("2d");
document.body.appendChild(canvasElement);

// Define a render function for the canvas
const render = () => {
  // Fetch the current pixel size of the canvas
  const width = canvasElement.clientWidth;
  const height = canvasElement.clientHeight;

  // Draw a black rectangle over the entire canvas
  canvasContext.beginPath();
  canvasContext.rect(0, 0, width, height);
  canvasContext.fillStyle = 'black';
  canvasContext.fill();
};

// Attach event listeners for the render function
document.addEventListener('DOMContentLoaded', render);
window.addEventListener('resize', render);
