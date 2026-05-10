/**
 * Metadata Validation & Testing Utilities
 *
 * Tools for validating metadata consistency, SEO compliance,
 * and detecting issues in the metadata system.
 */

import { PAGE_METADATA, METADATA_LIMITS, SITE_CONFIG, type PageMetadataConfig } from "./metadata";
import { validatePageMetadata, getMetadataAdvisory } from "./metadata-helpers";

export interface MetadataValidationResult {
  path: string;
  config: PageMetadataConfig;
  errors: string[];
  warnings: string[];
  advisories: string[];
  isValid: boolean;
}

export interface ValidationReport {
  timestamp: string;
  totalPages: number;
  validPages: number;
  pagesWithErrors: number;
  pagesWithWarnings: number;
  results: MetadataValidationResult[];
  summary: {
    errorCount: number;
    warningCount: number;
    advisoryCount: number;
  };
}

/**
 * Validate a single page's metadata
 */
export function validatePageMetadataConfig(
  path: string,
  config: PageMetadataConfig
): MetadataValidationResult {
  const errors = validatePageMetadata(config);
  const warnings: string[] = [];
  const advisories = getMetadataAdvisory(config);

  // Check for missing optional but recommended fields
  if (!config.keywords || config.keywords.length === 0) {
    warnings.push("Missing keywords array");
  }
  if (!config.ogTitle) {
    warnings.push("Missing OpenGraph title (using fallback)");
  }
  if (!config.ogDescription) {
    warnings.push("Missing OpenGraph description (using fallback)");
  }
  if (!config.twitterCard) {
    warnings.push("Missing Twitter card type (using fallback)");
  }

  return {
    path,
    config,
    errors,
    warnings,
    advisories,
    isValid: errors.length === 0,
  };
}

/**
 * Validate all pages in PAGE_METADATA
 */
export function validateAllPageMetadata(): ValidationReport {
  const results: MetadataValidationResult[] = [];
  let errorCount = 0;
  let warningCount = 0;
  let advisoryCount = 0;

  // Validate each page
  Object.entries(PAGE_METADATA).forEach(([path, config]) => {
    const result = validatePageMetadataConfig(path, config);
    results.push(result);

    errorCount += result.errors.length;
    warningCount += result.warnings.length;
    advisoryCount += result.advisories.length;
  });

  const pagesWithErrors = results.filter((r) => r.errors.length > 0).length;
  const pagesWithWarnings = results.filter((r) => r.warnings.length > 0).length;

  return {
    timestamp: new Date().toISOString(),
    totalPages: results.length,
    validPages: results.filter((r) => r.isValid).length,
    pagesWithErrors,
    pagesWithWarnings,
    results,
    summary: {
      errorCount,
      warningCount,
      advisoryCount,
    },
  };
}

/**
 * Check for duplicate titles across pages
 */
export function checkForDuplicateTitles(): Map<string, string[]> {
  const titleMap = new Map<string, string[]>();

  Object.entries(PAGE_METADATA).forEach(([path, config]) => {
    const title = config.title;
    if (!titleMap.has(title)) {
      titleMap.set(title, []);
    }
    titleMap.get(title)!.push(path);
  });

  // Filter to only duplicates
  const duplicates = new Map<string, string[]>();
  titleMap.forEach((paths, title) => {
    if (paths.length > 1) {
      duplicates.set(title, paths);
    }
  });

  return duplicates;
}

/**
 * Check for duplicate descriptions across pages
 */
export function checkForDuplicateDescriptions(): Map<string, string[]> {
  const descMap = new Map<string, string[]>();

  Object.entries(PAGE_METADATA).forEach(([path, config]) => {
    const desc = config.description;
    if (!descMap.has(desc)) {
      descMap.set(desc, []);
    }
    descMap.get(desc)!.push(path);
  });

  // Filter to only duplicates
  const duplicates = new Map<string, string[]>();
  descMap.forEach((paths, desc) => {
    if (paths.length > 1) {
      duplicates.set(desc, paths);
    }
  });

  return duplicates;
}

/**
 * Check for pages with missing critical fields
 */
export function checkForMissingFields(): Map<string, string[]> {
  const missingMap = new Map<string, string[]>();

  Object.entries(PAGE_METADATA).forEach(([path, config]) => {
    const missing: string[] = [];

    if (!config.title) missing.push("title");
    if (!config.description) missing.push("description");
    if (!config.ogTitle) missing.push("ogTitle");
    if (!config.ogDescription) missing.push("ogDescription");
    if (!config.twitterTitle) missing.push("twitterTitle");

    if (missing.length > 0) {
      missingMap.set(path, missing);
    }
  });

  return missingMap;
}

/**
 * Generate human-readable validation report
 */
export function generateValidationReport(report: ValidationReport): string {
  let output = "=".repeat(60) + "\n";
  output += "METADATA VALIDATION REPORT\n";
  output += "=".repeat(60) + "\n\n";

  output += `Timestamp: ${report.timestamp}\n`;
  output += `Total Pages: ${report.totalPages}\n`;
  output += `Valid Pages: ${report.validPages}/${report.totalPages}\n`;
  output += `Pages with Errors: ${report.pagesWithErrors}\n`;
  output += `Pages with Warnings: ${report.pagesWithWarnings}\n\n`;

  output += `Summary:\n`;
  output += `  - Total Errors: ${report.summary.errorCount}\n`;
  output += `  - Total Warnings: ${report.summary.warningCount}\n`;
  output += `  - Total Advisories: ${report.summary.advisoryCount}\n\n`;

  // Show errors
  const errorResults = report.results.filter((r) => r.errors.length > 0);
  if (errorResults.length > 0) {
    output += `ERRORS (${errorResults.length} pages):\n`;
    output += "-".repeat(60) + "\n";
    errorResults.forEach((result) => {
      output += `${result.path}:\n`;
      result.errors.forEach((err) => {
        output += `  ❌ ${err}\n`;
      });
    });
    output += "\n";
  }

  // Show warnings
  const warningResults = report.results.filter((r) => r.warnings.length > 0);
  if (warningResults.length > 0) {
    output += `WARNINGS (${warningResults.length} pages):\n`;
    output += "-".repeat(60) + "\n";
    warningResults.forEach((result) => {
      output += `${result.path}:\n`;
      result.warnings.forEach((warn) => {
        output += `  ⚠️  ${warn}\n`;
      });
    });
    output += "\n";
  }

  // Show duplicate check
  const duplicateTitles = checkForDuplicateTitles();
  if (duplicateTitles.size > 0) {
    output += `DUPLICATE TITLES (${duplicateTitles.size}):\n`;
    output += "-".repeat(60) + "\n";
    duplicateTitles.forEach((paths, title) => {
      output += `"${title}"\n`;
      paths.forEach((path) => {
        output += `  - ${path}\n`;
      });
    });
    output += "\n";
  }

  return output;
}

/**
 * Log validation to console
 */
export function logValidationReport(report: ValidationReport): void {
  const reportText = generateValidationReport(report);
  console.log(reportText);
}
