import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { FC } from "react";
import { ChevronLeft } from "lucide-react";
import SignUp from "./SignUp";
const page: FC = () => {
    return (
        <div>
            <div className="inset-0 my-[25vh] h-full">
                <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-20">
                    <Link href="/" className=""></Link>
                    <SignUp />
                </div>
            </div>
        </div>
    );
};

export default page;
