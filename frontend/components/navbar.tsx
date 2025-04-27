"use client"

import Link from "next/link";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";

export default function Navbar() {
    return <header className="sticky top-0 z-50 w-full border-b border-[#F0F0F0] bg-[#FCFCFC]/90 backdrop-blur supports-[backdrop-filter]:bg-[#FCFCFC]/60">
        <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-violet-500" />
                <span className="inline-block font-bold text-xl tracking-tight">SoulLift</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
                <Link
                    href="#features"
                    className="text-sm font-medium text-gray-600 hover:text-violet-500 transition-colors"
                >
                    Features
                </Link>
                <Link
                    href="#how-it-works"
                    className="text-sm font-medium text-gray-600 hover:text-violet-500 transition-colors"
                >
                    How It Works
                </Link>
                <Link href="#about" className="text-sm font-medium text-gray-600 hover:text-violet-500 transition-colors">
                    About
                </Link>
                <Button onClick={() => {window.location.href="/register"}} className="bg-violet-500 hover:bg-violet-600 rounded-full px-6">Get Started</Button>
            </nav>
            <Button variant="ghost" size="icon" className="md:hidden">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                >
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
            </Button>
        </div>
    </header>
}