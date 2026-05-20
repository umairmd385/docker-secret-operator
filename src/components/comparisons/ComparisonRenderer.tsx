import type { Comparison } from "@/lib/comparisons";
import { CheckCircle2 } from "lucide-react";

interface ComparisonRendererProps {
  comparison: Comparison;
}

interface ComparisonCardPairProps {
  dsoLabel: string;
  dsoContent: string;
  altLabel: string;
  altContent: string;
  alternative: string;
  highlight?: "dso" | "alt" | "none";
}

function ComparisonCardPair({
  dsoLabel,
  dsoContent,
  altLabel,
  altContent,
  alternative,
  highlight = "none",
}: ComparisonCardPairProps) {
  const dsoStyle = highlight === "dso"
    ? { borderColor: "var(--color-accent)", backgroundColor: "rgba(var(--accent-rgb), 0.05)" }
    : { borderColor: "var(--bg-surface)", backgroundColor: "var(--bg-background)" };
  const altStyle = highlight === "alt"
    ? { borderColor: "#fb923c", backgroundColor: "#fef3c7" }
    : { borderColor: "var(--bg-surface)", backgroundColor: "var(--bg-background)" };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="border rounded-lg p-6" style={dsoStyle}>
        <h3 className="text-lg font-semibold mb-3">{dsoLabel}</h3>
        <p style={{ color: "var(--text-foreground)" }}>{dsoContent}</p>
      </div>
      <div className="border rounded-lg p-6" style={altStyle}>
        <h3 className="text-lg font-semibold mb-3">{altLabel}</h3>
        <p style={{ color: "var(--text-foreground)" }}>{altContent}</p>
      </div>
    </div>
  );
}

export function ComparisonRenderer({ comparison }: ComparisonRendererProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      {/* Hero Section */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold" style={{ color: "var(--text-foreground)" }}>{comparison.title}</h1>
          <p className="text-xl" style={{ color: "var(--text-secondary)" }}>{comparison.problem}</p>
        </div>
      </section>

      {/* Problem Section */}
      <section
        className="border rounded-lg p-6 space-y-2"
        style={{
          borderColor: "var(--color-accent)",
          backgroundColor: "rgba(var(--accent-rgb), 0.05)"
        }}
      >
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-foreground)" }}>The Problem</h2>
        <p style={{ color: "var(--text-secondary)" }}>{comparison.problem}</p>
      </section>

      {/* Comparison Matrix Table */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-foreground)" }}>Feature Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border" style={{ borderColor: "var(--bg-surface)" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--bg-surface)" }}>
                <th className="border px-4 py-3 text-left font-semibold" style={{ borderColor: "var(--bg-surface)", color: "var(--text-foreground)" }}>
                  Category
                </th>
                <th className="border px-4 py-3 text-left font-semibold" style={{ borderColor: "var(--bg-surface)", color: "var(--text-foreground)" }}>
                  Docker Secret Operator
                </th>
                <th className="border px-4 py-3 text-left font-semibold" style={{ borderColor: "var(--bg-surface)", color: "var(--text-foreground)" }}>
                  {comparison.alternative}
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.sections.map((section, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "var(--bg-background)" : "var(--bg-surface)" }}>
                  <td className="border px-4 py-3 font-medium" style={{ borderColor: "var(--bg-surface)", color: "var(--text-foreground)" }}>
                    {section.category}
                  </td>
                  <td className="border px-4 py-3" style={{ borderColor: "var(--bg-surface)", color: "var(--text-secondary)" }}>
                    {section.dso}
                  </td>
                  <td className="border px-4 py-3" style={{ borderColor: "var(--bg-surface)", color: "var(--text-secondary)" }}>
                    {section.alternative}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Downtime Section */}
      <section className="grid md:grid-cols-2 gap-6">
        <div
          className="border rounded-lg p-6"
          style={{
            borderColor: "var(--color-accent)",
            backgroundColor: "rgba(var(--accent-rgb), 0.05)"
          }}
        >
          <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-foreground)" }}>Docker Secret Operator</h3>
          <p className="text-3xl font-bold" style={{ color: "var(--color-accent)" }}>{comparison.downtime.dso}</p>
        </div>
        <div
          className="border rounded-lg p-6"
          style={{
            borderColor: "var(--bg-surface)",
            backgroundColor: "var(--bg-background)"
          }}
        >
          <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-foreground)" }}>{comparison.alternative}</h3>
          <p className="text-3xl font-bold" style={{ color: "#dc2626" }}>{comparison.downtime.alternative}</p>
        </div>
      </section>

      {/* Recovery Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-foreground)" }}>Recovery</h2>
        <ComparisonCardPair
          dsoLabel="DSO"
          dsoContent={comparison.recovery.dso}
          altLabel={comparison.alternative}
          altContent={comparison.recovery.alternative}
          alternative={comparison.alternative}
          highlight="dso"
        />
      </section>

      {/* Health Checks Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-foreground)" }}>Health Checks</h2>
        <ComparisonCardPair
          dsoLabel="DSO"
          dsoContent={comparison.healthChecks.dso}
          altLabel={comparison.alternative}
          altContent={comparison.healthChecks.alternative}
          alternative={comparison.alternative}
        />
      </section>

      {/* Docker Support Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-foreground)" }}>Docker Support</h2>
        <ComparisonCardPair
          dsoLabel="DSO"
          dsoContent={comparison.dockerSupport.dso}
          altLabel={comparison.alternative}
          altContent={comparison.dockerSupport.alternative}
          alternative={comparison.alternative}
        />
      </section>

      {/* Operational Burden Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-foreground)" }}>Operational Burden</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div
            className="border rounded-lg p-6"
            style={{
              borderColor: "var(--color-accent)",
              backgroundColor: "rgba(var(--accent-rgb), 0.05)"
            }}
          >
            <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-foreground)" }}>DSO (Low)</h3>
            <p style={{ color: "var(--text-secondary)" }}>{comparison.operationalBurden.dso}</p>
          </div>
          <div
            className="border rounded-lg p-6"
            style={{
              borderColor: "var(--bg-surface)",
              backgroundColor: "var(--bg-background)"
            }}
          >
            <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-foreground)" }}>
              {comparison.alternative}
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>{comparison.operationalBurden.alternative}</p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-foreground)" }}>Use Cases</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold" style={{ color: "var(--text-foreground)" }}>Best for DSO</h3>
            <ul className="space-y-2">
              {comparison.useCases.dso.map((useCase, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--color-accent)" }} />
                  <span style={{ color: "var(--text-secondary)" }}>{useCase}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold" style={{ color: "var(--text-foreground)" }}>Best for {comparison.alternative}</h3>
            <ul className="space-y-2">
              {comparison.useCases.alternative.map((useCase, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#2563eb" }} />
                  <span style={{ color: "var(--text-secondary)" }}>{useCase}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      <section
        className="border rounded-lg p-6 space-y-4"
        style={{
          borderColor: "var(--color-accent)",
          backgroundColor: "rgba(var(--accent-rgb), 0.05)"
        }}
      >
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-foreground)" }}>Recommendations</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold" style={{ color: "var(--color-accent)" }}>Choose DSO when:</h3>
            <p style={{ color: "var(--text-secondary)" }}>{comparison.recommendations.whenDso}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold" style={{ color: "var(--text-foreground)" }}>Choose {comparison.alternative} when:</h3>
            <p style={{ color: "var(--text-secondary)" }}>{comparison.recommendations.whenAlternative}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
