export const docsStructure = {
  "gettingStarted": {
    "title": "Getting Started",
    "pages": []
  },
  "guides": {
    "title": "Core Guides",
    "pages": []
  },
  "cli": {
    "title": "CLI Reference",
    "pages": []
  },
  "providers": {
    "title": "Providers",
    "pages": []
  },
  "other": {
    "title": "Other",
    "pages": [
      {
        "title": "DSO Documentation",
        "href": "/docs/guide/README",
        "description": "Documentation for DSO Documentation",
        "keywords": [
          "README",
          "DSO Documentation"
        ]
      }
    ]
  }
};

export function getAllDocPages() {
  return [
    {
      title: "DSO Documentation",
      href: "/docs/guide/README",
      description: "Documentation for DSO Documentation",
      keywords: ["README","DSO Documentation"],
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