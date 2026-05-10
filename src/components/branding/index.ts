/**
 * Brand Components Export
 *
 * Centralized export of all branding components.
 * Use these for consistent brand implementation across the application.
 */

export { DSOLogo, DSOLogoIcon, DSOLogoHorizontal, ResponsiveDSOLogo } from "./DSOLogo";
export type { DSOLogoProps } from "./DSOLogo";

export { VerificationBadge, VerificationIndicator } from "./VerificationBadge";
export type { VerificationBadgeProps } from "./VerificationBadge";

export { ProviderCard, ProviderGrid, FeaturedProviderCard } from "./ProviderCard";
export type { ProviderCardProps } from "./ProviderCard";

export {
  BrandHeader,
  SimpleHeader,
  HeroHeader,
  SectionHeader,
  NavHeader,
} from "./BrandHeader";
export type { BrandHeaderProps } from "./BrandHeader";

/**
 * Component usage guide:
 *
 * Logo Components:
 * - DSOLogo: Full-featured logo with variant/size control
 * - DSOLogoIcon: Icon-only variant
 * - DSOLogoHorizontal: Horizontal lockup
 * - ResponsiveDSOLogo: Automatically adapts to screen size
 *
 * Verification Components:
 * - VerificationBadge: Shows verification status
 * - VerificationIndicator: Minimal status indicator
 *
 * Provider Components:
 * - ProviderCard: Individual provider display
 * - ProviderGrid: Multiple providers in grid
 * - FeaturedProviderCard: Highlighted provider
 *
 * Header Components:
 * - BrandHeader: Full-featured header
 * - SimpleHeader: Text-only header
 * - HeroHeader: Large header with logo
 * - SectionHeader: Medium header for sections
 * - NavHeader: Header with breadcrumbs
 */
