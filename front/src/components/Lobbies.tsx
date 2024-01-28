"use client";
import { useState } from "react";
import { MdCancelPresentation } from "react-icons/md";
import { FaCheck, FaLock, FaUser } from "react-icons/fa";
import { IoExit, IoExitOutline } from "react-icons/io5";

interface ILobby {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
  game: string;
  status: string;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
  private: boolean;
}

const SAMPLE_LOBBIES: ILobby[] = [
  {
    id: "1",
    name: "Lobby 1",
    players: 1,
    maxPlayers: 4,
    game: "Pictionary",
    status: "Waiting",
    owner: "Jabolo",
    createdAt: new Date(),
    updatedAt: new Date(),
    private: true,
  },
  {
    id: "2",
    name: "Lobby 2",
    players: 2,
    maxPlayers: 4,
    game: "Pictionary",
    status: "Waiting",
    owner: "Adrianchu",
    createdAt: new Date(),
    updatedAt: new Date(),
    private: false,
  },
  {
    id: "3",
    name: "Lobby 3",
    players: 3,
    maxPlayers: 4,
    game: "Pictionary",
    status: "Waiting",
    owner: "Alrax",
    createdAt: new Date(),
    updatedAt: new Date(),
    private: false,
  },
  {
    id: "4",
    name: "Lobby 4",
    players: 4,
    maxPlayers: 4,
    game: "Pictionary",
    status: "Waiting",
    owner: "xRozzo",
    createdAt: new Date(),
    updatedAt: new Date(),
    private: true,
  },
  {
    id: "5",
    name: "Lobby 5",
    players: 4,
    maxPlayers: 4,
    game: "Pictionary",
    status: "Waiting",
    owner: "elXokas",
    createdAt: new Date(),
    updatedAt: new Date(),
    private: true,
  },
  {
    id: "5",
    name: "Lobby 6",
    players: 24,
    maxPlayers: 25,
    game: "Pictionary",
    status: "Waiting",
    owner: "Lamar",
    createdAt: new Date(),
    updatedAt: new Date(),
    private: true,
  },
];

export function Lobby(lobby: ILobby) {
  const [password, setPassword] = useState<string>("");
  const [drawer, setDrawer] = useState(false);

  const handleClick = () => {
    if (lobby.private) {
      return setDrawer(true);
    }
    location.href = `/lobbies/${lobby.id}`;
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-5 px-5 py-5">
        <div className="bg-blue-300 text-blue-600 p-5 rounded-lg">
          {lobby.private ? <FaLock /> : <FaUser />}
        </div>
        <div className="w-full flex flex-col gap-1">
          <h2 className="font-bold">{lobby.name}</h2>
          <p>
            @{lobby.owner}
          </p>
        </div>
        <div className="flex items-center flex-row gap-5">
          {!drawer
            ? (
              <>
                <div className="flex flex-row items-center gap-2 text-gray-300">
                  {lobby.private ? <FaLock /> : <FaUser />}
                  <p className="text-gray-300">
                    {lobby.players}/{lobby.maxPlayers}
                  </p>
                </div>
                <button
                  className={`${
                    lobby.players === lobby.maxPlayers
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-600"
                  } text-white px-4 py-2 rounded-lg`}
                  onClick={handleClick}
                >
                  Join
                </button>
              </>
            )
            : (
              <>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="border border-gray-300 rounded-lg px-4 py-2"
                />
                <div className="flex flex-row gap-2">
                  <button
                    className="bg-green-600 text-white px-4 py-3 rounded-lg"
                    onClick={() => setDrawer(false)}
                  >
                    <FaCheck />
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-3 rounded-lg"
                    onClick={() => setDrawer(false)}
                  >
                    <IoExitOutline />
                  </button>
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
}

export default function Lobbies() {
  return (
    <div className="max-w-xl w-full border-2 rounded-lg">
      {SAMPLE_LOBBIES.map((lobby) => <Lobby key={lobby.id} {...lobby} />)}
    </div>
  );
}
