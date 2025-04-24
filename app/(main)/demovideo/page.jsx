"use client";

import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure the player only renders on the client-side
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-5xl mb-6">
        <Link href="/">
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">
        🎥 AI Career Guide – Demo
      </h1>

      {/* Only render ReactPlayer on the client side */}
      {isClient && (
        <div className="w-full max-w-3xl aspect-video mb-6">
          <ReactPlayer
            url="https://www.youtube.com/watch?v=g6HBWKK_rJ0"
            controls
            width="100%"
            height="100%"
          />
        </div>
      )}
    </div>
  );
}
