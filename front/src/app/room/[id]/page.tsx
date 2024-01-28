"use client";
import { useParams } from "next/navigation";
import { FaInfo, FaLock, FaUser } from "react-icons/fa";

interface IUser {
  id: string;
  username: string;
  joinedAt: Date;
}

const SAMPLE_USERS: IUser[] = [
  {
    id: "1",
    username: "Jabolo",
    joinedAt: new Date(),
  },
  {
    id: "2",
    username: "Adrianchu",
    joinedAt: new Date(),
  },
  {
    id: "3",
    username: "Alrax",
    joinedAt: new Date(),
  },
  {
    id: "4",
    username: "xRozzo",
    joinedAt: new Date(),
  },
];

function Person(user: IUser) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-5 px-5 py-5">
        <div className="bg-blue-300 text-blue-600 p-5 rounded-lg">
          {<FaUser />}
        </div>
        <div className="w-full flex flex-col gap-1">
          <h2 className="font-bold">{user.username}</h2>
          <p>
            Joined at {user.joinedAt.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center flex-row gap-5">
          <div className="flex flex-row items-center gap-2 text-gray-300">
            <FaInfo />
          </div>
          <button
            className={`bg-red-500 text-white px-4 py-2 rounded-lg`}
            onClick={() => void 0}
          >
            Kick
          </button>
        </div>
      </div>
    </div>
  );
}

function Controls() {
  return (
    <div className="flex flex-row gap-5">
      <button
        className="bg-green-600 text-white px-4 py-3 rounded-lg w-20"
        onClick={() => void 0}
      >
        Start
      </button>
      <button
        className="bg-red-600 text-white px-4 py-3 rounded-lg w-20"
        onClick={() => void 0}
      >
        End
      </button>
    </div>
  );
}

export default function Room() {
  const { id } = useParams();

  return (
    <div className="my-10 flex items-center justify-center flex-col gap-5">
      <h1>Room #{id}</h1>
      <div className="max-w-xl w-full border-2 rounded-lg">
        {SAMPLE_USERS.map((user) => <Person key={user.id} {...user} />)}
        <div className="w-full flex items-center justify-center">
          <div className="border-b border-gray-300 w-[80%] my-2" />
        </div>
        <div className="w-full flex items-center justify-center my-4">
          <Controls />
        </div>
      </div>
    </div>
  );
}
