'use client';

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";

const steps = [
  {
    number: 1,
    title: "Install Plugin",
    code: "curl -fsSL https://get.dso.sh | sudo bash",
    description: "Install the latest binary or use 'docker plugin install'.",
  },
  {
    number: 2,
    title: "Configure Secrets",
    code: "cat > dso.yaml <<EOF\nprovider: aws\nsecrets:\n  - name: my-db-pass\n    inject: env\nEOF",
    description: "Define your cloud providers and secret mappings.",
  },
  {
    number: 3,
    title: "Run Command",
    code: "docker dso up -d",
    description: "Inject secrets directly into a Docker Compose stack.",
  },
];

export function Quickstart() {
  return (
    <section id="how-it-works" className="py-24 bg-bg-primary">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-text-primary mb-4"
          >
            Get started in minutes.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg"
          >
            A simple three-step process that fits straight into your existing workflow.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-full bg-accent text-bg-primary flex items-center justify-center font-bold">
                  {step.number}
                </span>
                <h3 className="text-xl font-bold text-text-primary">{step.title}</h3>
              </div>

              <div className="p-5 bg-bg-secondary border border-border-primary rounded-2xl overflow-hidden shadow-sm group">
                <code className="text-xs font-mono font-bold text-accent whitespace-pre-wrap break-all block">
                   {step.code}
                </code>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed px-1">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
