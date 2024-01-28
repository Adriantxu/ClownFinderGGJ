"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LogInData {
    accessToken: string;
    userId: string;
}

export default function LogInComp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(false); // New state for login erro

    const handleSubmit = async (event: any) => {
        event.preventDefault(); // Prevents the default form submission behavior
        setLoginError(false);

        try {
            const response = await fetch(`http://localhost:3030/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                setLoginError(true);
                return;
            }

            const data = await response.json();
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("userId", data.userId);
            window.location.href = '/rooms';
            // push to desi
            
        } catch (error) {
            console.error(error);
            // You might want to handle network errors differently here
        }
    };

    return (
        <div className="mx-auto max-w-md space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Log In</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Initiate session in your account by filling out the form
                    below
                </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                        Incorrect email or password.
                        <Link href="/auth/signUp">
                            <span className="text-red-500 underline"> Sign Up</span>
                        </Link>
                    </p>
                )}
                <Button className="w-full bg-gray-200" type="submit">
                    Log In
                </Button>
            </form>
        </div>
    );
}
