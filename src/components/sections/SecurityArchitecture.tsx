"use client";

import React from "react";
import { SecurityBoundaries } from "@/components/diagrams/SecurityBoundaries";

export const SecurityArchitecture = () => {
  return (
    <section className="relative py-20 sm:py-32 bg-background border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SecurityBoundaries variant="detailed" />
      </div>
    </section>
  );
};
