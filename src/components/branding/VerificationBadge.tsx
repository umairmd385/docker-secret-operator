import React from "react";
import { BRAND_COLORS } from "@/lib/branding/colors";

export interface VerificationBadgeProps {
  lastVerified?: string; // YYYY-MM-DD format
  provider?: string;
  status?: "verified" | "in-progress" | "needs-review";
  size?: "sm" | "md" | "lg";
  variant?: "badge" | "card" | "inline";
  className?: string;
  showDate?: boolean;
}

/**
 * Verification Badge Component
 *
 * Trust signal indicating documentation verification status.
 * Supports multiple layouts for different contexts.
 */
export function VerificationBadge({
  lastVerified,
  provider,
  status = "verified",
  size = "md",
  variant = "badge",
  className = "",
  showDate = true,
}: VerificationBadgeProps) {
  const statusConfig = {
    verified: {
      color: BRAND_COLORS.success.main,
      bgColor: "#E8F5E9",
      icon: "✓",
      label: "Verified",
      description: "Verified against official documentation",
    },
    "in-progress": {
      color: BRAND_COLORS.warning.main,
      bgColor: "#FFF3E0",
      icon: "◐",
      label: "In Progress",
      description: "Verification in progress",
    },
    "needs-review": {
      color: BRAND_COLORS.error.main,
      bgColor: "#FFEBEE",
      icon: "!",
      label: "Needs Review",
      description: "Content needs verification",
    },
  };

  const config = statusConfig[status];

  const sizeConfig = {
    sm: {
      padding: "4px 8px",
      fontSize: "12px",
      iconSize: "14px",
    },
    md: {
      padding: "6px 12px",
      fontSize: "14px",
      iconSize: "16px",
    },
    lg: {
      padding: "8px 16px",
      fontSize: "16px",
      iconSize: "18px",
    },
  };

  const sizes = sizeConfig[size];

  if (variant === "badge") {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-full ${className}`}
        style={{
          backgroundColor: config.bgColor,
          padding: sizes.padding,
        }}
      >
        <span
          style={{
            color: config.color,
            fontSize: sizes.iconSize,
            fontWeight: "bold",
          }}
        >
          {config.icon}
        </span>
        <span style={{ color: config.color, fontSize: sizes.fontSize }}>
          {config.label}
        </span>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span
          style={{
            color: config.color,
            fontSize: sizes.iconSize,
            fontWeight: "bold",
          }}
        >
          {config.icon}
        </span>
        <div style={{ fontSize: sizes.fontSize }}>
          <strong style={{ color: config.color }}>{config.label}</strong>
          {showDate && lastVerified && (
            <span style={{ color: "#666", marginLeft: "8px" }}>
              {new Date(lastVerified).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Card variant
  return (
    <div
      className={`rounded-lg border p-4 ${className}`}
      style={{
        borderColor: config.color,
        backgroundColor: config.bgColor,
      }}
    >
      <div className="flex items-start gap-3">
        <span
          style={{
            color: config.color,
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          {config.icon}
        </span>
        <div>
          <h4 style={{ color: config.color, fontWeight: "bold", margin: 0 }}>
            {config.label}
          </h4>
          <p style={{ color: "#555", margin: "4px 0 0 0", fontSize: "14px" }}>
            {config.description}
          </p>
          {provider && (
            <p style={{ color: "#777", margin: "4px 0 0 0", fontSize: "12px" }}>
              Provider: <strong>{provider}</strong>
            </p>
          )}
          {showDate && lastVerified && (
            <p style={{ color: "#999", margin: "4px 0 0 0", fontSize: "12px" }}>
              Last verified:{" "}
              <strong>
                {new Date(lastVerified).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Quick Verification Status Indicator
 *
 * Minimal indicator for documentation headers.
 */
export function VerificationIndicator({
  lastVerified,
  compact = true,
}: {
  lastVerified?: string;
  compact?: boolean;
}) {
  if (!lastVerified) return null;

  const date = new Date(lastVerified);
  const now = new Date();
  const daysOld = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  const isRecent = daysOld < 30;
  const isStale = daysOld > 90;

  const status = isStale ? "needs-review" : isRecent ? "verified" : "in-progress";

  if (compact) {
    return (
      <VerificationBadge
        status={status}
        size="sm"
        variant="inline"
        lastVerified={lastVerified}
        showDate={false}
      />
    );
  }

  return (
    <VerificationBadge
      status={status}
      size="md"
      variant="inline"
      lastVerified={lastVerified}
      showDate={true}
    />
  );
}
