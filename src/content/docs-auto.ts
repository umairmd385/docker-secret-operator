export const docsStructure = {
  "gettingStarted": {
    "title": "Getting Started",
    "pages": [
      {
        "title": "Getting Started with DSO",
        "href": "/docs/guide/getting-started",
        "description": "Documentation for Getting Started with DSO",
        "keywords": [
          "getting-started",
          "Getting Started with DSO"
        ]
      }
    ]
  },
  "guides": {
    "title": "Core Guides",
    "pages": [
      {
        "title": "DSO Architecture Guide (SRE & Security Reference)",
        "href": "/docs/guide/architecture",
        "description": "Documentation for DSO Architecture Guide (SRE & Security Reference)",
        "keywords": [
          "architecture",
          "DSO Architecture Guide (SRE & Security Reference)"
        ]
      },
      {
        "title": "DSO Configuration Reference",
        "href": "/docs/guide/configuration",
        "description": "Documentation for DSO Configuration Reference",
        "keywords": [
          "configuration",
          "DSO Configuration Reference"
        ]
      }
    ]
  },
  "cli": {
    "title": "CLI Reference",
    "pages": [
      {
        "title": "DSO CLI Reference (Phase 1-6)",
        "href": "/docs/guide/cli",
        "description": "Documentation for DSO CLI Reference (Phase 1-6)",
        "keywords": [
          "cli",
          "DSO CLI Reference (Phase 1-6)"
        ]
      }
    ]
  },
  "providers": {
    "title": "Providers",
    "pages": [
      {
        "title": "Secret Provider Setup Guide",
        "href": "/docs/guide/providers",
        "description": "Documentation for Secret Provider Setup Guide",
        "keywords": [
          "providers",
          "Secret Provider Setup Guide"
        ]
      }
    ]
  },
  "other": {
    "title": "Other",
    "pages": [
      {
        "title": "CNCF Sandbox Application — Docker Secret Operator (DSO)",
        "href": "/docs/guide/CNCF_SANDBOX_APPLICATION",
        "description": "Documentation for CNCF Sandbox Application — Docker Secret Operator (DSO)",
        "keywords": [
          "CNCF_SANDBOX_APPLICATION",
          "CNCF Sandbox Application — Docker Secret Operator (DSO)"
        ]
      },
      {
        "title": "DSO Configuration Reference",
        "href": "/docs/guide/CONFIG_REFERENCE",
        "description": "Documentation for DSO Configuration Reference",
        "keywords": [
          "CONFIG_REFERENCE",
          "DSO Configuration Reference"
        ]
      },
      {
        "title": "DSO Operational Limitations & Design Assumptions",
        "href": "/docs/guide/OPERATIONAL_LIMITATIONS",
        "description": "Documentation for DSO Operational Limitations & Design Assumptions",
        "keywords": [
          "OPERATIONAL_LIMITATIONS",
          "DSO Operational Limitations & Design Assumptions"
        ]
      },
      {
        "title": "DSO Persistence Model",
        "href": "/docs/guide/PERSISTENCE_MODEL",
        "description": "Documentation for DSO Persistence Model",
        "keywords": [
          "PERSISTENCE_MODEL",
          "DSO Persistence Model"
        ]
      },
      {
        "title": "DSO Quick Reference",
        "href": "/docs/guide/QUICKREF",
        "description": "Documentation for DSO Quick Reference",
        "keywords": [
          "QUICKREF",
          "DSO Quick Reference"
        ]
      },
      {
        "title": "DSO Recovery Procedures",
        "href": "/docs/guide/RECOVERY_PROCEDURES",
        "description": "Documentation for DSO Recovery Procedures",
        "keywords": [
          "RECOVERY_PROCEDURES",
          "DSO Recovery Procedures"
        ]
      },
      {
        "title": "Concepts & Architecture",
        "href": "/docs/guide/concepts",
        "description": "Documentation for Concepts & Architecture",
        "keywords": [
          "concepts",
          "Concepts & Architecture"
        ]
      },
      {
        "title": "Docker Compose Integration",
        "href": "/docs/guide/docker-compose",
        "description": "Documentation for Docker Compose Integration",
        "keywords": [
          "docker-compose",
          "Docker Compose Integration"
        ]
      },
      {
        "title": "DSO Docker Plugin Integration",
        "href": "/docs/guide/docker-plugin",
        "description": "Documentation for DSO Docker Plugin Integration",
        "keywords": [
          "docker-plugin",
          "DSO Docker Plugin Integration"
        ]
      },
      {
        "title": "DSO Operational Guide (Day-2 Operations)",
        "href": "/docs/guide/operational-guide",
        "description": "Documentation for DSO Operational Guide (Day-2 Operations)",
        "keywords": [
          "operational-guide",
          "DSO Operational Guide (Day-2 Operations)"
        ]
      },
      {
        "title": "DSO Runtime Operation & Systemd Integration",
        "href": "/docs/guide/runtime",
        "description": "Documentation for DSO Runtime Operation & Systemd Integration",
        "keywords": [
          "runtime",
          "DSO Runtime Operation & Systemd Integration"
        ]
      }
    ]
  }
};

export function getAllDocPages() {
  return [
    {
      title: "CNCF Sandbox Application — Docker Secret Operator (DSO)",
      href: "/docs/guide/CNCF_SANDBOX_APPLICATION",
      description: "Documentation for CNCF Sandbox Application — Docker Secret Operator (DSO)",
      keywords: ["CNCF_SANDBOX_APPLICATION","CNCF Sandbox Application — Docker Secret Operator (DSO)"],
    },
    {
      title: "DSO Configuration Reference",
      href: "/docs/guide/CONFIG_REFERENCE",
      description: "Documentation for DSO Configuration Reference",
      keywords: ["CONFIG_REFERENCE","DSO Configuration Reference"],
    },
    {
      title: "DSO Operational Limitations & Design Assumptions",
      href: "/docs/guide/OPERATIONAL_LIMITATIONS",
      description: "Documentation for DSO Operational Limitations & Design Assumptions",
      keywords: ["OPERATIONAL_LIMITATIONS","DSO Operational Limitations & Design Assumptions"],
    },
    {
      title: "DSO Persistence Model",
      href: "/docs/guide/PERSISTENCE_MODEL",
      description: "Documentation for DSO Persistence Model",
      keywords: ["PERSISTENCE_MODEL","DSO Persistence Model"],
    },
    {
      title: "DSO Quick Reference",
      href: "/docs/guide/QUICKREF",
      description: "Documentation for DSO Quick Reference",
      keywords: ["QUICKREF","DSO Quick Reference"],
    },
    {
      title: "DSO Recovery Procedures",
      href: "/docs/guide/RECOVERY_PROCEDURES",
      description: "Documentation for DSO Recovery Procedures",
      keywords: ["RECOVERY_PROCEDURES","DSO Recovery Procedures"],
    },
    {
      title: "DSO Architecture Guide (SRE & Security Reference)",
      href: "/docs/guide/architecture",
      description: "Documentation for DSO Architecture Guide (SRE & Security Reference)",
      keywords: ["architecture","DSO Architecture Guide (SRE & Security Reference)"],
    },
    {
      title: "DSO CLI Reference (Phase 1-6)",
      href: "/docs/guide/cli",
      description: "Documentation for DSO CLI Reference (Phase 1-6)",
      keywords: ["cli","DSO CLI Reference (Phase 1-6)"],
    },
    {
      title: "Concepts & Architecture",
      href: "/docs/guide/concepts",
      description: "Documentation for Concepts & Architecture",
      keywords: ["concepts","Concepts & Architecture"],
    },
    {
      title: "DSO Configuration Reference",
      href: "/docs/guide/configuration",
      description: "Documentation for DSO Configuration Reference",
      keywords: ["configuration","DSO Configuration Reference"],
    },
    {
      title: "Docker Compose Integration",
      href: "/docs/guide/docker-compose",
      description: "Documentation for Docker Compose Integration",
      keywords: ["docker-compose","Docker Compose Integration"],
    },
    {
      title: "DSO Docker Plugin Integration",
      href: "/docs/guide/docker-plugin",
      description: "Documentation for DSO Docker Plugin Integration",
      keywords: ["docker-plugin","DSO Docker Plugin Integration"],
    },
    {
      title: "Getting Started with DSO",
      href: "/docs/guide/getting-started",
      description: "Documentation for Getting Started with DSO",
      keywords: ["getting-started","Getting Started with DSO"],
    },
    {
      title: "DSO Operational Guide (Day-2 Operations)",
      href: "/docs/guide/operational-guide",
      description: "Documentation for DSO Operational Guide (Day-2 Operations)",
      keywords: ["operational-guide","DSO Operational Guide (Day-2 Operations)"],
    },
    {
      title: "Secret Provider Setup Guide",
      href: "/docs/guide/providers",
      description: "Documentation for Secret Provider Setup Guide",
      keywords: ["providers","Secret Provider Setup Guide"],
    },
    {
      title: "DSO Runtime Operation & Systemd Integration",
      href: "/docs/guide/runtime",
      description: "Documentation for DSO Runtime Operation & Systemd Integration",
      keywords: ["runtime","DSO Runtime Operation & Systemd Integration"],
    }
  ];
}

export function searchDocs(query: string) {
  const searchQuery = query.toLowerCase();
  return getAllDocPages().filter(
    page =>
      page.title.toLowerCase().includes(searchQuery) ||
      page.description.toLowerCase().includes(searchQuery) ||
      page.keywords.some(kw => kw.toLowerCase().includes(searchQuery))
  );
}