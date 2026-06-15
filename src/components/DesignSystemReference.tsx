"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { StandardizedCard, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/StandardizedCard";
import { H1, H2, H3, H4, P, Code } from "@/components/ui/Typography";
import { Section, SectionHeading } from "@/components/layout/Section";

/**
 * DesignSystemReference
 *
 * Developer guide for DSO Design System
 * Shows all component patterns, typography, and usage guidelines
 * Not rendered by default - for internal reference only
 */

export const DesignSystemReference = () => {
  return (
    <div className="bg-background min-h-screen p-8 space-y-16">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <H1>DSO Design System</H1>
          <P>Inspired by Linear, Vercel, Supabase, Stripe</P>
          <P className="text-gray-400">
            This document serves as a reference for developers building on the DSO website.
            Consistency is more important than individuality.
          </P>
        </div>

        {/* Typography */}
        <Section size="md" bordered>
          <SectionHeading
            title="Typography"
            subtitle="Linear-inspired hierarchy for clear information structure"
          />
          <div className="space-y-8">
            <div className="space-y-2">
              <H1>Display Large (H1)</H1>
              <Code>text-4xl sm:text-5xl lg:text-6xl font-bold</Code>
            </div>
            <div className="space-y-2">
              <H2>Heading Large (H2)</H2>
              <Code>text-3xl sm:text-4xl font-bold</Code>
            </div>
            <div className="space-y-2">
              <H3>Heading Medium (H3)</H3>
              <Code>text-2xl sm:text-3xl font-bold</Code>
            </div>
            <div className="space-y-2">
              <H4>Heading Small (H4)</H4>
              <Code>text-xl font-bold</Code>
            </div>
            <div className="space-y-2">
              <P>Body text (P): Use for running paragraphs. Comfortable reading width, consistent line height.</P>
              <Code>text-base text-gray-300 leading-relaxed</Code>
            </div>
          </div>
        </Section>

        {/* Button Variants */}
        <Section size="md" bordered>
          <SectionHeading
            title="Buttons"
            subtitle="Four standard variants with consistent sizing and states"
          />
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Primary (CTA)</h4>
              <Button variant="primary">Primary Action</Button>
              <Code>variant="primary"</Code>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Secondary</h4>
              <Button variant="secondary">Secondary Action</Button>
              <Code>variant="secondary"</Code>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Ghost</h4>
              <Button variant="ghost">Ghost Action</Button>
              <Code>variant="ghost"</Code>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Outline</h4>
              <Button variant="outline">Outline Action</Button>
              <Code>variant="outline"</Code>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <p className="text-sm text-gray-400">All buttons include:</p>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>• Focus-visible outline (WCAG AA compliant)</li>
              <li>• Hover state with visual feedback</li>
              <li>• Active state with scale transform</li>
              <li>• Smooth transitions (200ms base)</li>
            </ul>
          </div>
        </Section>

        {/* Cards */}
        <Section size="md" bordered>
          <SectionHeading
            title="Cards"
            subtitle="Unified card styling with consistent spacing and hover states"
          />
          <div className="grid sm:grid-cols-2 gap-6">
            <StandardizedCard variant="default">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>Most common pattern across site</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300">Bordered card with subtle hover state.</p>
              </CardContent>
            </StandardizedCard>
            <StandardizedCard variant="interactive">
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>Clickable with enhanced hover</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300">Use for selectable options or CTAs.</p>
              </CardContent>
            </StandardizedCard>
            <StandardizedCard variant="ghost">
              <CardHeader>
                <CardTitle>Ghost Card</CardTitle>
                <CardDescription>No border, minimal visual weight</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300">For secondary information.</p>
              </CardContent>
            </StandardizedCard>
            <StandardizedCard variant="accent">
              <CardHeader>
                <CardTitle>Accent Card</CardTitle>
                <CardDescription>Highlights important information</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300">Accent border and subtle background.</p>
              </CardContent>
            </StandardizedCard>
          </div>
        </Section>

        {/* Layout */}
        <Section size="md" bordered>
          <SectionHeading
            title="Layout & Spacing"
            subtitle="Predictable, consistent container widths and spacing"
          />
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Container Widths</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• <Code>max-w-2xl</Code> - sm (32rem)</li>
                <li>• <Code>max-w-3xl</Code> - md (42rem)</li>
                <li>• <Code>max-w-4xl</Code> - lg (64rem)</li>
                <li>• <Code>max-w-5xl</Code> - xl (80rem) — Default</li>
                <li>• <Code>max-w-6xl</Code> - 2xl (88rem)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Section Spacing</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• Mobile: <Code>py-20</Code></li>
                <li>• Desktop: <Code>sm:py-32</Code></li>
                <li>• Always include bottom border: <Code>border-b border-gray-800</Code></li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Colors */}
        <Section size="md" bordered>
          <SectionHeading
            title="Colors"
            subtitle="Keep dark theme, teal accent, minimal visual noise"
          />
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="w-full h-20 bg-background border border-gray-800 rounded-lg"></div>
              <Code>background: #0d1117</Code>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-gray-900 border border-gray-800 rounded-lg"></div>
              <Code>surface: #161b22</Code>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-accent rounded-lg"></div>
              <Code>accent: #00e6c0</Code>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <p className="text-sm text-gray-400">Rules:</p>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>✓ Keep dark theme throughout</li>
              <li>✓ Use teal accent consistently</li>
              <li>✗ No gradients (except subtle section backgrounds)</li>
              <li>✗ No heavy glow effects</li>
              <li>✗ No rainbow colors</li>
            </ul>
          </div>
        </Section>

        {/* Motion */}
        <Section size="md" bordered>
          <SectionHeading
            title="Motion & Transitions"
            subtitle="Very limited, intentional animations only"
          />
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Allowed</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• Hover transitions (200ms base)</li>
                <li>• Fade-in on load (150ms fast)</li>
                <li>• Focus ring animation</li>
                <li>• Border color changes</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Forbidden</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>✗ Parallax effects</li>
                <li>✗ Particle animations</li>
                <li>✗ Continuous loop animations</li>
                <li>✗ More than 300ms transitions</li>
              </ul>
            </div>
            <Code>transition-all duration-200</Code>
          </div>
        </Section>

        {/* Accessibility */}
        <Section size="md" bordered={false}>
          <SectionHeading
            title="Accessibility"
            subtitle="WCAG AA compliance required"
          />
          <div className="space-y-4">
            <ul className="space-y-2 text-sm text-gray-300">
              <li>✓ Focus states on all interactive elements</li>
              <li>✓ Color contrast 4.5:1 minimum (text/background)</li>
              <li>✓ Keyboard navigation throughout</li>
              <li>✓ Semantic HTML (button, a, label, etc.)</li>
              <li>✓ Alt text on meaningful images</li>
              <li>✓ Aria labels where needed</li>
              <li>✓ Touch targets minimum 44x44px</li>
            </ul>
          </div>
        </Section>
      </div>
    </div>
  );
};
