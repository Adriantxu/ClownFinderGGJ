import Lobbies from "@/components/Lobbies";

export default function Home() {
  return (
    <div className="my-10 flex items-center justify-center flex-col gap-5">
      <h1>Lobby</h1>
      <Lobbies />
    </div>
  );
}
