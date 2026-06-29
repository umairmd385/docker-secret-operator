"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Home, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden"
      style={{ background: "#05070A" }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(0,230,192,0.06) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 number */}
          <p
            className="text-8xl sm:text-9xl font-bold font-mono tracking-tighter mb-4 select-none"
            style={{
              color: "#00E6C0",
              textShadow: "0 0 80px rgba(0,230,192,0.25)",
              opacity: 0.8,
            }}
          >
            404
          </p>

          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tighter mb-4"
            style={{ color: "#F8FAFC" }}
          >
            Page not found
          </h1>

          <p
            className="text-base leading-relaxed mb-10"
            style={{ color: "#94A3B8" }}
          >
            This page doesn&apos;t exist or may have moved. Check the URL or
            navigate to a page that does.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:opacity-90"
              style={{
                background: "#00E6C0",
                color: "#05070A",
                boxShadow: "0 0 30px rgba(0,230,192,0.2)",
              }}
            >
              <Home className="w-4 h-4" />
              Go home
            </a>
            <a
              href="/docs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border transition-all duration-200 hover:border-white/30 hover:text-white"
              style={{
                borderColor: "rgba(255,255,255,0.12)",
                color: "#94A3B8",
              }}
            >
              <BookOpen className="w-4 h-4" />
              Read the docs
            </a>
            <a
              href="/deploy"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border transition-all duration-200 hover:border-white/30 hover:text-white"
              style={{
                borderColor: "rgba(255,255,255,0.12)",
                color: "#94A3B8",
              }}
            >
              Deploy
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
