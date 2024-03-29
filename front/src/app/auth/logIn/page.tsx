import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { FC } from "react";
import { ChevronLeft } from "lucide-react";
import SignIn from "./SignIn";

const page: FC = () => {
  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-20 inset-0 my-[25vh] h-full">
      <Link href="/" className=""></Link>
      <SignIn />
    </div>
  );
};

export default page;
