"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SignUpData {
    accessToken: string;
    userId: string;
}

export default function SignUpComp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(false); // New state for login erro

    const handleSubmit = async (event: any) => {
        event.preventDefault(); // Prevents the default form submission behavior

        const userData = { email, password, name };

        try {
            const response = await fetch(`http://localhost:3030/auth/signup`, {
                // api endpoint of adrian / type response
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            // modal different (read..)
            if (!response.ok) {
                setLoginError(true);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: SignUpData = await response.json();
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("userId", data.userId);
            window.location.href = '/rooms';
            console.log(data);
            //!  change to another page...
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className="mx-auto max-w-md space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Sign Up</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Crate your account by filling out the form below
                </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name">Name</label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                        type="text"
                        className={loginError ? "border-red-500" : ""}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="email">Email</label>
                    <Input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        type="email"
                        className={loginError ? "border-red-500" : ""}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="password">Password</label>
                    <Input
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        type="password"
                        className={loginError ? "border-red-500" : ""}
                    />
                </div>
                {loginError && (
                    <p className="text-red-500 text-sm text-center">
                        An error ocurred, try again...
                    </p>
                )}
                <Button className="w-full bg-gray-200" type="submit">
                    SignUp
                </Button>
            </form>
        </div>
    );
}
