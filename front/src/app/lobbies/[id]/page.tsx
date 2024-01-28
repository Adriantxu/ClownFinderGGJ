"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import CanvasDraw from "react-canvas-draw";

function User() {
  const ref = useRef<CanvasDraw>(null);
  const [timer, setTimer] = useState(0);
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    setTimer(5);
  }, []);

  // fetch /api/lobbies/:id/theme
  useEffect(() => {
    if (timer === 0) {
      // fetch /api/lobbies/:id/submit
      // pick user
      return;
    }
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="w-full flex items-center justify-center flex-col">
      <CanvasDraw
        ref={ref}
        canvasWidth={500}
        canvasHeight={500}
        brushColor={color}
        lazyRadius={0}
        disabled={timer === 0}
        className="w-full h-auto border-2 border-gray-200 rounded-lg my-5"
      />
      <div className="flex items-center justify-center w-full mx-20 gap-5">
        <input
          type="color"
          className="w-15 h-10 rounded-lg"
          onChange={(d) => setColor(d.target.value)}
        />
        <button
          disabled={timer === 0}
          onClick={() => {
            const raw = ref.current?.getSaveData()!;
            const blob = new Blob([raw], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.download = "canvas.json";
            a.href = url;
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
          }}
          className={`${
            timer === 0
              ? `bg-gray-400 disabled cursor-not-allowed`
              : `bg-blue-400`
          } text-white px-4 py-2 rounded-lg`}
        >
          Export
        </button>
        <button
          disabled={timer === 0}
          onClick={() => ref.current?.undo()}
          className={`${
            timer === 0
              ? `bg-gray-400 disabled cursor-not-allowed`
              : `bg-yellow-400`
          } text-white px-4 py-2 rounded-lg`}
        >
          Undo
        </button>
        <button
          disabled={timer === 0}
          onClick={() => ref.current?.clear()}
          className={`${
            timer === 0
              ? `bg-gray-400 disabled cursor-not-allowed`
              : `bg-red-500`
          } text-white px-4 py-2 rounded-lg`}
        >
          Clean
        </button>
        <button
          disabled={timer === 0}
          className={`${
            timer === 0
              ? `bg-gray-400 disabled cursor-not-allowed`
              : `bg-green-500`
          } text-white px-4 py-2 rounded-lg`}
        >
          Submit ({timer}s)
        </button>
      </div>
    </div>
  );
}

function Host() {
    // wait 30s
    // broadcast channel get all canvas
    // choose one
    // post /room/:id/winner
}

export default function Game() {
  const { id } = useParams();

  return (
    <div className="my-10 flex items-center justify-center flex-col gap-5">
      <h1>Lobby #{id}</h1>
      <div className="max-w-xl w-full rounded-lg h-auto flex items-center justify-center">
        <User />
      </div>
    </div>
  );
}
