"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";

const roomsData = [
  {
    id: 1,
    name: "Room 1",
    password: "",
    players: 10,
    max_size: 12,
  },
  {
    id: 2,
    name: "Room 2",
    password: "",
    players: 3,
    max_size: 10,
  },
  {
    id: 3,
    name: "Room 3",
    password: "",
    players: 5,
    max_size: 5,
  },
  {
    id: 4,
    name: "Room 4",
    password: "",
    players: 10,
    max_size: 10,
  },
];

interface Room {
  id: number;
  name: string;
  password: string;
  players: number;
  max_size: number;
}

const svgFiles = [
  "/circus-svgrepo-com.svg",
  "/clown-svgrepo-com.svg",
  "/magician-svgrepo-com.svg",
  "theater-on-wheels-svgrepo-com.svg",
];

const Sidebar = () => {
  return (
    <div className="flex flex-col w-24 justify-center items-center h-screen space-y-4">
      {svgFiles.map((_svg, _index) => <></>)}
    </div>
  );
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [name, setName] = useState("");
  const [players, setPlayers] = useState(0);
  const [randomSvgs, setRandomSvgs] = useState([""]);

  const queryRooms = async () => {
    const response = await fetch(process.env.NEST_URL + "/rooms", {
      method: "GET",
    });
    const _rooms = await response.json();
    setRooms(_rooms);
  };

  const createRoom = async () => {
    const response = await fetch(process.env.NEST_URL + "/rooms/create", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        password: "",
        max_size: players,
      }),
    });
    const room = await response.json();
    setRooms([...rooms, room]);
  };

  const joinRoom = async (room: Room) => {
    const response = await fetch(
      process.env.NEST_URL + "/rooms/access/" + room.id,
      {
        method: "POST",
        body: JSON.stringify({
          password: room.password,
        }),
      },
    );
    const _room = await response.json();
    setRooms([...rooms, _room]);
  };

  const getRandomSvg = () => {
    const randomIndex = Math.floor(Math.random() * svgFiles.length);
    return svgFiles[randomIndex];
  };

  useEffect(() => {
    const newSvgs = Array.from({ length: 4 }, getRandomSvg); // Create an array of 4 random SVGs
    setRandomSvgs(newSvgs);
  }, []);

  return (
    <div className="flex justify-between items-start min-h-screen bg-teal-400">
      <Sidebar />
      <div className="flex-grow ">
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-teal-500">
          <main className="flex flex-col items-center justify-center w-9/12 space-y-6">
            <Link href="/">
              <h1 className="text-4xl font-bold">ClownFinder 🤡</h1>
            </Link>
            <div className="w-full max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle>Create a new room</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="room-name">Room Name</Label>
                      <Input
                        className="text-black"
                        id="room-name"
                        placeholder="Enter room name"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="players">Number of Players</Label>
                      <Input
                        className="text-black"
                        id="players"
                        max="10"
                        min="2"
                        type="number"
                        onChange={(e) => setPlayers(Number(e.target.value))}
                      />
                    </div>
                    <br />
                    <Link href={"/room/" + (roomsData.length + 1)}>
                      <Button
                        className="w-full bg-white text-blue-950"
                        type="submit"
                        onClick={createRoom}
                      >
                        Create Room
                      </Button>
                    </Link>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="w-full max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle>Available Rooms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {roomsData.map((room) => (
                      <div
                        key={room.id}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center">
                          {/* Adjust size as needed */}
                          <div>
                            <h3 className="font-semibold">{room.name}</h3>
                            <p className="text-sm text-blue-900">
                              {room.players}/{room.max_size} Players
                            </p>
                          </div>
                        </div>
                        <Link
                          className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                          href={"/lobbies/" + room.id}
                          onClick={() => joinRoom(room)}
                        >
                          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl text-blue-400">
                            Join
                          </span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
      <Sidebar />
    </div>
  );
}
