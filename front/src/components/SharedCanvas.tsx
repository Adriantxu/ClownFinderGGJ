"use client";

import { useEffect, useRef, useState } from "react";

const SharedCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [erasing, setErasing] = useState(false); // Added erasing state
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Function to create a Broadcast Channel
    const createBroadcastChannel = () => {
      return new BroadcastChannel("sharedCanvasChannel");
    };

    // Event listeners for drawing
    const startDrawing = (e: { clientX: number; clientY: number }) => {
      if (erasing) { // Check if erasing mode is enabled
        setDrawing(true);
        erase(e); // Call erase function
      } else {
        setDrawing(true);
        setLastPosition({
          x: e.clientX - canvas.offsetLeft,
          y: e.clientY - canvas.offsetTop,
        });
      }
    };

    const draw = (e: { clientX: number; clientY: number }) => {
      if (!drawing || !channelRef.current) {
        return;
      }

      const x = e.clientX - canvas.offsetLeft;
      const y = e.clientY - canvas.offsetTop;

      if (erasing) { // Check if erasing mode is enabled
        erase(e); // Call erase function
      } else {
        // Draw on the local canvas
        drawLine(ctx!, lastPosition.x, lastPosition.y, x, y);

        // Broadcast the drawing event to other tabs
        channelRef.current.postMessage({
          type: "draw",
          data: { lastX: lastPosition.x, lastY: lastPosition.y, x, y },
        });

        setLastPosition({ x, y });
      }
    };

    const stopDrawing = () => {
      setDrawing(false);
    };

    // Handle messages from other tabs
    const handleChannelMessage = (
      ...[event]: Parameters<NonNullable<BroadcastChannel["onmessage"]>>
    ) => {
      const { type, data } = event.data;

      switch (type) {
        case "draw":
          if (erasing) { // Check if erasing mode is enabled
            erase(data); // Call erase function
          } else {
            // Draw on the local canvas
            drawLine(ctx!, data.lastX, data.lastY, data.x, data.y);
          }
          break;
        // Add more cases for different types of messages if needed
        default:
          break;
      }
    };

    // Initialize the Broadcast Channel and event listeners
    const initChannel = () => {
      channelRef.current = createBroadcastChannel();
      channelRef.current.onmessage = handleChannelMessage;

      return () => {
        channelRef.current!.close();
      };
    };

    const cleanupChannel = initChannel();

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseout", stopDrawing);
      cleanupChannel();
    };
  }, [drawing, lastPosition, erasing]); // Added erasing dependency

  const erase = (e: { clientX: number; clientY: number }) => {
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;

    ctx!.globalCompositeOperation = "destination-out"; // Set the composite operation to erase
    ctx!.beginPath();
    ctx!.arc(x, y, 10, 0, Math.PI * 2, false); // Increase the radius of the arc
    ctx!.fill();
    ctx!.closePath();
    ctx!.globalCompositeOperation = "source-over"; // Reset the composite operation
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="border-black rounded-md border-2"
        width={500}
        height={500}
      />
      <button
        onClick={() => setErasing(!erasing)}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded ${
          erasing ? "bg-red-500" : ""
        }`}
      >
        {erasing ? "Disable Eraser" : "Enable Eraser"}
      </button>
      {" "}
    </div>
  );
};

// listLobbies
// 

const drawLine = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
) => {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.closePath();
};

export default SharedCanvas;
