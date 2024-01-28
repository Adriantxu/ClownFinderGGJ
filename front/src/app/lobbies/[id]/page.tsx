"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import CanvasDraw from "react-canvas-draw";
import { FaCheck } from "react-icons/fa";
import confetti from "canvas-confetti";

function User() {
  const ref = useRef<CanvasDraw>(null);
  const channel = useRef<BroadcastChannel | null>(null);
  const winner = useRef<BroadcastChannel | null>(null);
  const [timer, setTimer] = useState(-1);
  const [color, setColor] = useState("#000000");
  const [isWinner, setIsWinner] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (message.length > 0) {
      setTimer(45);
    }
  }, [message]);

  useEffect(() => {
    if (isWinner) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isWinner]);

  useEffect(() => {
    const initChannel = () => {
      channel.current = new BroadcastChannel("canvas");
      winner.current = new BroadcastChannel("winner");

      winner.current.onmessage = (e) => {
        if (e.data.data.event === "WINNER") {
          setIsWinner(true);
        }
        if (e.data.data.event === "MESSAGE") {
          setMessage(e.data.data.message);
        }
      };

      return () => {
        channel.current!.close();
        winner.current!.close();
      };
    };

    const cleanup = initChannel();

    return cleanup;
  }, []);

  // fetch /api/lobbies/:id/theme
  useEffect(() => {
    if (timer === 0) {
      winner.current!.postMessage({
        type: "message",
        data: {
          event: "END",
          userName: "Jabolo (#1)",
        },
      });
      winner.current!.postMessage({
        type: "message",
        data: {
          event: "END",
          userName: "Adrian (#2)",
        },
      });
      winner.current!.postMessage({
        type: "message",
        data: {
          event: "END",
          userName: "Alex (#3)",
        },
      });
      return;
    }
    if (timer === -1) {
      return;
    }
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
      // send data in broadcast channel
      channel.current!.postMessage({
        type: "message",
        data: ref.current?.getSaveData(),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="w-full flex items-center justify-center flex-col">
      {isWinner && (
        <h1 className="text-green-500 text-3xl mb-2">Congrats! You won!</h1>
      )}
      {message.length > 0 && (
        <div className="flex flex-col gap-5 items-center justify-center w-full">
          <h1>Message from host:</h1>
          <p>{message}</p>
        </div>
      )}
      <CanvasDraw
        ref={ref}
        canvasWidth={500}
        canvasHeight={500}
        brushColor={color}
        lazyRadius={0}
        disabled={timer === 0}
        className={`w-full h-auto border-2 border-gray-200 rounded-lg my-5 ${
          isWinner ? `border-3 rounded-lg border-green-500` : ``
        }`}
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
          onClick={() => setTimer(0)}
          className={`${
            timer === 0
              ? `bg-gray-400 disabled cursor-not-allowed`
              : `bg-green-500`
          } text-white px-4 py-2 rounded-lg`}
        >
          Submit ({timer < 0 ? "..." : timer}s)
        </button>
      </div>
    </div>
  );
}

function Host() {
  const [users, setUsers] = useState<string[]>([]);
  const ref = useRef<CanvasDraw>(null);
  const channel = useRef<BroadcastChannel | null>(null);
  const winner = useRef<BroadcastChannel | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const initChannel = () => {
      channel.current = new BroadcastChannel("canvas");
      winner.current = new BroadcastChannel("winner");

      channel.current.onmessage = (e) => {
        ref.current?.loadSaveData(e.data.data, true);
      };

      winner.current.onmessage = (e) => {
        if (e.data.data.event === "END") {
          setUsers((users) => [...users, e.data.data.userName]);
        }
      };

      return () => {
        channel.current!.close();
        winner.current!.close();
      };
    };

    const cleanup = initChannel();

    return cleanup;
  }, []);

  return (
    <>
      <CanvasDraw
        ref={ref}
        disabled
        canvasWidth={500}
        canvasHeight={500}
        className="w-full h-auto border-2 border-gray-200 rounded-lg my-5"
      />
      <p>Write your idea for all participants here:</p>
      <input
        className="w-[87%] rounded-md border-2 py-2 px-4"
        type="text"
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer"
        onClick={() => {
          winner.current?.postMessage({
            type: "message",
            data: {
              event: "MESSAGE",
              message,
            },
          });
        }}
      >
        Send
      </button>
      {users.length > 0 && (
        <div className="flex flex-col gap-5 items-center justify-center">
          <h1>Choose a winner:</h1>
          <div className="flex flex-col gap-5">
            {users.map((user, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-5 px-5 w-full">
                  <div className="w-full flex flex-row gap-10 items-center justify-between">
                    <h2 className="font-bold">{user}</h2>
                    <div className="bg-green-100 p-2 rounded-md">
                      <FaCheck
                        onClick={() => {
                          winner.current?.postMessage({
                            type: "message",
                            data: {
                              event: "WINNER",
                              userName: user,
                            },
                          });
                        }}
                        className="text-green-500 text-3xl cursor-pointer hover:text-green-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function Game() {
  const { id } = useParams();

  return (
    <div className="my-10 flex items-center justify-center flex-col gap-5">
      <h1>Lobby #1</h1>
      <div className="max-w-xl w-full rounded-lg h-auto flex items-center justify-center">
        {id === "1"
          ? (
            <div className="flex items-center justify-center flex-col gap-5 w-full">
              <Host />
            </div>
          )
          : (
            <div className="flex items-center justify-center flex-col gap-5 w-full">
              <User />
            </div>
          )}
      </div>
    </div>
  );
}
