"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Laptop, Cloud, Award, Code, Lock, RotateCcw } from "lucide-react";

interface DeploymentPath {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  category: "dev" | "prod";
  providers?: string[];
  steps: {
    step: number;
    command: string;
    explanation: string;
  }[];
}

const PathCard = ({ path, isSelected, onClick }: { path: DeploymentPath; isSelected: boolean; onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ y: -4 }}
    className={`text-left p-4 sm:p-6 rounded-lg border-2 transition-all ${
      isSelected
        ? "border-accent bg-accent/10"
        : "border-gray-800 bg-gray-900/30 hover:border-accent/50"
    }`}
  >
    <div className="flex items-start gap-3 mb-2">
      <div className="text-accent mt-0.5">{path.icon}</div>
      <h3 className="font-semibold text-foreground text-sm sm:text-base">{path.title}</h3>
    </div>
    <p className="text-xs sm:text-sm text-gray-400">{path.description}</p>
    {path.providers && path.providers.length > 0 && (
      <div className="flex flex-wrap gap-1 mt-3">
        {path.providers.map((provider) => (
          <span key={provider} className="text-[10px] px-2 py-1 rounded bg-accent/10 text-accent">
            {provider}
          </span>
        ))}
      </div>
    )}
  </motion.button>
);

const StepBlock = ({ step, index }: { step: DeploymentPath["steps"][0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="space-y-2"
  >
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
        <span className="text-accent text-xs font-bold">{step.step}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 font-mono text-xs sm:text-sm text-gray-300 break-all">
          {step.command}
        </div>
        <p className="text-xs text-gray-400 mt-2">{step.explanation}</p>
      </div>
    </div>
  </motion.div>
);

export const DeploymentPaths = () => {
  const [selectedPath, setSelectedPath] = useState<string>("local-compose");

  const paths: DeploymentPath[] = [
    {
      id: "local-compose",
      title: "Docker Compose (Dev)",
      icon: <Code className="w-5 h-5" />,
      category: "dev",
      description: "Get started locally with Docker Compose. No cloud account required.",
      steps: [
        {
          step: 1,
          command: "curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | bash",
          explanation: "Install DSO CLI",
        },
        {
          step: 2,
          command: "docker dso init",
          explanation: "Initialize local encrypted vault (~/.dso/vault.enc). Enter passphrase when prompted.",
        },
        {
          step: 3,
          command: 'docker dso secret set DB_PASSWORD "prod-password" && docker dso secret set API_KEY "sk-123456"',
          explanation: "Add your first secrets to the local vault",
        },
        {
          step: 4,
          command: "docker dso up -f docker-compose.yml",
          explanation: "Start containers. DSO injects secrets at runtime without restarting.",
        },
      ],
    },
    {
      id: "agent-aws",
      title: "AWS Secrets Manager",
      icon: <Cloud className="w-5 h-5" />,
      category: "prod",
      description: "Production setup using AWS IAM Instance Profile for auth.",
      providers: ["AWS Secrets Manager"],
      steps: [
        {
          step: 1,
          command: "curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | sudo bash",
          explanation: "Install DSO system-wide (requires sudo)",
        },
        {
          step: 2,
          command: "sudo docker dso system bootstrap --provider aws --region us-east-1",
          explanation: "Bootstrap agent with AWS provider. Uses IAM Instance Profile (no credentials needed).",
        },
        {
          step: 3,
          command: "sudo systemctl enable dso-agent && sudo systemctl start dso-agent",
          explanation: "Start agent as systemd service. Will run on every boot.",
        },
        {
          step: 4,
          command: "curl http://localhost:8081/health",
          explanation: 'Verify agent is running and connected to AWS. Expect {"status":"ok","provider":"aws"}',
        },
      ],
    },
    {
      id: "agent-azure",
      title: "Azure Key Vault",
      icon: <Cloud className="w-5 h-5" />,
      category: "prod",
      description: "Production setup using Azure Managed Identity for auth.",
      providers: ["Azure Key Vault"],
      steps: [
        {
          step: 1,
          command: "curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | sudo bash",
          explanation: "Install DSO system-wide (requires sudo)",
        },
        {
          step: 2,
          command: "sudo docker dso system bootstrap --provider azure --vault-url https://my-vault.vault.azure.net",
          explanation: "Bootstrap agent with Azure provider. Uses Managed Identity (no credentials needed).",
        },
        {
          step: 3,
          command: "sudo systemctl enable dso-agent && sudo systemctl start dso-agent",
          explanation: "Start agent as systemd service. Will run on every boot.",
        },
        {
          step: 4,
          command: "curl http://localhost:8081/health",
          explanation: 'Verify agent is running and connected to Azure. Expect {"status":"ok","provider":"azure"}',
        },
      ],
    },
    {
      id: "agent-vault",
      title: "HashiCorp Vault",
      icon: <Lock className="w-5 h-5" />,
      category: "prod",
      description: "Production setup with self-hosted or Vault Cloud. AppRole auth.",
      providers: ["HashiCorp Vault"],
      steps: [
        {
          step: 1,
          command: "curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | sudo bash",
          explanation: "Install DSO system-wide (requires sudo)",
        },
        {
          step: 2,
          command: "sudo docker dso system bootstrap --provider vault --address http://vault:8200",
          explanation: "Bootstrap agent with Vault provider. Supports AppRole or token auth.",
        },
        {
          step: 3,
          command: "sudo systemctl enable dso-agent && sudo systemctl start dso-agent",
          explanation: "Start agent as systemd service. Will run on every boot.",
        },
        {
          step: 4,
          command: "curl http://localhost:8081/health",
          explanation: 'Verify agent is running and connected to Vault. Expect {"status":"ok","provider":"vault"}',
        },
      ],
    },
    {
      id: "agent-huawei",
      title: "Huawei Cloud KMS",
      icon: <Cloud className="w-5 h-5" />,
      category: "prod",
      description: "Production setup using Huawei Cloud Key Management Service.",
      providers: ["Huawei Cloud KMS"],
      steps: [
        {
          step: 1,
          command: "curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | sudo bash",
          explanation: "Install DSO system-wide (requires sudo)",
        },
        {
          step: 2,
          command: "sudo docker dso system bootstrap --provider huawei --region cn-east-2",
          explanation: "Bootstrap agent with Huawei provider. Uses IAM credentials from environment.",
        },
        {
          step: 3,
          command: "sudo systemctl enable dso-agent && sudo systemctl start dso-agent",
          explanation: "Start agent as systemd service. Will run on every boot.",
        },
        {
          step: 4,
          command: "curl http://localhost:8081/health",
          explanation: 'Verify agent is running and connected to Huawei Cloud. Expect {"status":"ok","provider":"huawei"}',
        },
      ],
    },
    {
      id: "agent-local",
      title: "Production Local Mode",
      icon: <RotateCcw className="w-5 h-5" />,
      category: "prod",
      description: "Production without cloud. Uses local encrypted vault with systemd agent.",
      steps: [
        {
          step: 1,
          command: "curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | sudo bash",
          explanation: "Install DSO system-wide (requires sudo)",
        },
        {
          step: 2,
          command: "sudo docker dso init --vault-path /etc/dso/vault.enc",
          explanation: "Initialize encrypted vault at system path. Only DSO process can decrypt.",
        },
        {
          step: 3,
          command: 'sudo docker dso secret set DB_PASSWORD "prod-secret" --vault /etc/dso/vault.enc',
          explanation: "Add secrets to system vault",
        },
        {
          step: 4,
          command: "sudo systemctl enable dso-agent && sudo systemctl start dso-agent",
          explanation: "Start agent. Will manage rotations and monitor secret changes.",
        },
      ],
    },
  ];

  const selected = paths.find((p) => p.id === selectedPath) || paths[0];

  return (
    <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="text-accent text-sm font-semibold uppercase tracking-wide mb-2">Production Deployment</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Deploy to Production
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Choose your provider and follow step-by-step setup. AWS, Azure, HashiCorp Vault, or offline mode.
          </p>
        </motion.div>

        {/* Path Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {paths.map((path, idx) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <PathCard path={path} isSelected={selectedPath === path.id} onClick={() => setSelectedPath(path.id)} />
            </motion.div>
          ))}
        </div>

        {/* Selected Path Details */}
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 max-w-3xl mx-auto"
        >
          {/* Title & Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-accent">{selected.icon}</div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">{selected.title}</h3>
              {selected.category === "dev" && (
                <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">Development</span>
              )}
              {selected.category === "prod" && (
                <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">Production</span>
              )}
            </div>
            <p className="text-gray-400">{selected.description}</p>
          </div>

          {/* Steps */}
          <div className="space-y-4 p-6 sm:p-8 rounded-xl border border-gray-800 bg-gray-900/30">
            <h4 className="font-semibold text-foreground text-sm">Setup Steps</h4>
            <div className="space-y-4">
              {selected.steps.map((step, idx) => (
                <StepBlock key={`${selected.id}-${step.step}`} step={step} index={idx} />
              ))}
            </div>
          </div>

          {/* Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 sm:p-5 rounded-lg border border-accent/20 bg-accent/5 text-sm text-gray-400 space-y-2"
          >
            {selected.id === "local-compose" && (
              <>
                <p>✓ Perfect for local development</p>
                <p>✓ No cloud dependencies or authentication required</p>
                <p>✓ Secrets stored in encrypted local vault</p>
              </>
            )}
            {selected.id === "agent-aws" && (
              <>
                <p>✓ Uses AWS IAM Instance Profile (no credentials on instance)</p>
                <p>✓ Automatically rotates secrets from AWS Secrets Manager</p>
                <p>✓ Agent runs as systemd service, monitoring for changes</p>
              </>
            )}
            {selected.id === "agent-azure" && (
              <>
                <p>✓ Uses Azure Managed Identity (no credentials on instance)</p>
                <p>✓ Automatically rotates secrets from Azure Key Vault</p>
                <p>✓ Agent runs as systemd service, monitoring for changes</p>
              </>
            )}
            {selected.id === "agent-vault" && (
              <>
                <p>✓ Works with HashiCorp Vault (self-hosted or Vault Cloud)</p>
                <p>✓ Supports AppRole or token-based authentication</p>
                <p>✓ Agent runs as systemd service, monitoring for changes</p>
              </>
            )}
            {selected.id === "agent-local" && (
              <>
                <p>✓ Production without cloud dependencies</p>
                <p>✓ Secrets stored in encrypted vault on system</p>
                <p>✓ Agent runs as systemd service with full rotation capabilities</p>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Key Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="max-w-3xl mx-auto p-6 sm:p-8 rounded-xl border border-accent/20 bg-accent/5 space-y-3"
        >
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-2">Start Local, Scale to Cloud</h4>
              <p className="text-sm text-gray-400">
                Develop with Docker Compose locally, then promote to Agent Mode with your chosen provider (AWS, Azure, Vault, or Local).
                Same CLI workflow. Same guarantees. Different scale.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
