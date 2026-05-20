#!/usr/bin/env node

/**
 * Documentation Generator
 *
 * Automatically converts markdown docs from /dso/docs/ into Next.js pages
 * Run: node scripts/generate-docs.js
 */

const fs = require('fs');
const path = require('path');

// Get the project root (docker-secret-operator directory)
const projectRoot = path.dirname(__dirname);
const DSO_DOCS_DIR = path.join(projectRoot, '..', 'dso', 'docs');
const OUTPUT_DIR = path.join(projectRoot, 'src', 'app', 'docs', 'guide');
const CONTENT_DIR = path.join(projectRoot, 'src', 'content');

// Parse markdown frontmatter and content
function parseMd(content) {
  let frontmatter = {};
  let mdContent = content;

  // Check for YAML frontmatter
  if (content.startsWith('---')) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (match) {
      const yamlContent = match[1];
      mdContent = match[2];

      // Simple YAML parser for key: value format
      yamlContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
          frontmatter[key.trim()] = value;
        }
      });
    }
  }

  return { frontmatter, mdContent };
}

// Extract first heading from markdown
function extractHeading(mdContent) {
  const match = mdContent.match(/^#+\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

// Generate slug from filename
function generateSlug(filename) {
  return filename.replace(/\.md$/, '').replace(/^index$/, '');
}

// Generate page.tsx for a markdown file
function generatePageTsx(title, description, mdContent) {
  const escapedContent = mdContent
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');

  return `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "${title}",
  description: "${description || 'DSO Documentation'}",
};

export default function Page() {
  return (
    <div>
      <article className="prose prose-invert max-w-none">
        {/* Content will be rendered from markdown */}
        <div dangerouslySetInnerHTML={{ __html: \`${escapedContent}\` }} />
      </article>
    </div>
  );
}
`;
}

// Better: Generate page.tsx that imports markdown as string and converts it
function generatePageTsxWithMarkdown(title, description, mdContent) {
  return `import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

const content = \`${mdContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;

export const metadata: Metadata = {
  title: "${title}",
  description: "${description || 'DSO Documentation'}",
};

export default function Page() {
  return <MarkdownRenderer content={content} />;
}
`;
}

// Generate sidebar navigation structure
function generateNavStructure(docsMap) {
  const nav = {
    gettingStarted: [],
    guides: [],
    cli: [],
    providers: [],
    other: [],
  };

  Object.entries(docsMap).forEach(([slug, doc]) => {
    const item = {
      title: doc.title,
      href: '/docs/guide/' + slug,
      description: doc.description,
      keywords: doc.keywords || [],
    };

    // Categorize based on filename or frontmatter
    if (slug.includes('getting') || slug.includes('quick') || slug.includes('introduction') || slug === 'index') {
      nav.gettingStarted.push(item);
    } else if (slug.includes('cli')) {
      nav.cli.push(item);
    } else if (slug.includes('provider') || slug.includes('aws') || slug.includes('azure') || slug.includes('vault') || slug.includes('local')) {
      nav.providers.push(item);
    } else if (slug.includes('architecture') || slug.includes('design') || slug.includes('security') || slug.includes('config') || slug.includes('troubleshoot') || slug.includes('observability') || slug.includes('production')) {
      nav.guides.push(item);
    } else {
      nav.other.push(item);
    }
  });

  return nav;
}

// Main generation function
async function generateDocs() {
  console.log('📚 Generating docs from /dso/docs/...\n');

  const dsoDocs = path.resolve(__dirname, DSO_DOCS_DIR);
  const outputDir = path.resolve(__dirname, OUTPUT_DIR);

  if (!fs.existsSync(dsoDocs)) {
    console.warn(`⚠️  Source docs directory not found: ${dsoDocs}`);
    console.warn('⚠️  Skipping doc generation — using pre-committed pages.');
    console.warn('⚠️  This is expected in CI/Vercel environments without the sibling dso/ repo.');
    process.exit(0);
  }

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const docsMap = {};
  const files = fs.readdirSync(dsoDocs).filter(f => f.endsWith('.md') && f !== 'index.md');

  console.log(`Found ${files.length} markdown files\n`);

  // Process each markdown file
  files.forEach(file => {
    const filePath = path.join(dsoDocs, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { frontmatter, mdContent } = parseMd(content);

    const slug = generateSlug(file);
    const title = frontmatter.title || extractHeading(mdContent) || slug;
    const description = frontmatter.description || `Documentation for ${title}`;

    console.log(`✓ Processing: ${file} → /docs/guide/${slug}`);

    // Create directory for this doc if slug contains path separators
    const docDir = path.join(outputDir, slug.split('/').slice(0, -1).join('/'));
    if (!fs.existsSync(docDir)) {
      fs.mkdirSync(docDir, { recursive: true });
    }

    // Generate page.tsx
    const pagePath = path.join(outputDir, `${slug}`, 'page.tsx');
    const pageContent = generatePageTsxWithMarkdown(title, description, mdContent);

    // Create directory for page.tsx
    const pageDir = path.dirname(pagePath);
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true });
    }

    fs.writeFileSync(pagePath, pageContent);

    docsMap[slug] = {
      title,
      description,
      keywords: frontmatter.keywords?.split(',').map(k => k.trim()) || [slug, title],
    };
  });

  console.log('\n✓ Generated all pages\n');

  // Generate navigation structure
  const navStructure = generateNavStructure(docsMap);

  // Update docs.ts content structure with category titles for DocsPageContent
  const categoryTitles = {
    gettingStarted: "Getting Started",
    guides: "Core Guides",
    cli: "CLI Reference",
    providers: "Providers",
    other: "Other"
  };

  const structureWithTitles = Object.entries(navStructure).reduce((acc, [key, pages]) => {
    acc[key] = {
      title: categoryTitles[key] || key,
      pages: pages
    };
    return acc;
  }, {});

  const docsContent = `export const docsStructure = ${JSON.stringify(structureWithTitles, null, 2)};

export function getAllDocPages() {
  return [
    ${Object.entries(docsMap)
      .map(([slug, doc]) => `{
      title: "${doc.title.replace(/"/g, '\\"')}",
      href: "/docs/guide/${slug}",
      description: "${doc.description.replace(/"/g, '\\"')}",
      keywords: ${JSON.stringify(doc.keywords)},
    }`)
      .join(',\n    ')}
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
}`;

  const contentDir = path.resolve(__dirname, CONTENT_DIR);
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  fs.writeFileSync(path.join(contentDir, 'docs-auto.ts'), docsContent);

  console.log('✓ Generated docs-auto.ts with navigation structure\n');
  console.log('📊 Documentation Summary:');
  console.log(`  Getting Started: ${navStructure.gettingStarted.length}`);
  console.log(`  Core Guides: ${navStructure.guides.length}`);
  console.log(`  CLI Reference: ${navStructure.cli.length}`);
  console.log(`  Providers: ${navStructure.providers.length}`);
  console.log(`  Other: ${navStructure.other.length}`);
  console.log('\n✅ Documentation generation complete!\n');
}

generateDocs().catch(err => {
  console.error('❌ Error generating docs:', err);
  process.exit(1);
});
