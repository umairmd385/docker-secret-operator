# Priority 2 — Internal Contradictions Report

**Status**: Documenting for fixes

## Dashboard/UI References

### Issue 1: "powerful" language in ProductPreview
**File**: `src/components/sections/ProductPreview.tsx:21`
**Current**: "Simple, powerful, transparent"
**Problem**: "Powerful" is vague marketing language
**Fix**: Remove "powerful" → "Simple, clear, transparent"
**Evidence**: None in codebase

### Issue 2: "enterprise-grade" in Vault integration
**File**: `src/content/integrations/hashicorp-vault.ts`
**Current**: "DSO + HashiCorp Vault creates a powerful, enterprise-grade secret system"
**Problem**: 
- Overstates DSO's scope (DSO is rotation-only, not enterprise)
- "powerful" is marketing language
- Vault is enterprise-grade, not DSO+Vault
**Fix**: Rewrite to "DSO + HashiCorp Vault enables automated rotation with Vault's enterprise features"
**Evidence**: SystemBoundaries.tsx explicitly states DSO is "not an enterprise platform"

---

## Monitoring References - Context Check

These are documentation references and are CORRECT (they refer to DSO's ability to work with monitoring systems, not a built-in dashboard):

✅ `src/components/sections/FailureScenarios.tsx` - "Alerts sent to monitoring system" (correct - can integrate)
✅ `src/components/sections/FailureHandling.tsx` - Same
✅ `src/components/sections/EcosystemConnections.tsx` - Lists Prometheus as integration
✅ `src/components/sections/TerminalDemo.tsx:21` - "No manual restarts. No monitoring dashboards. Just works." (CORRECT - no built-in dashboard)

---

## FAQ Reference

**File**: `src/components/sections/FAQSection.tsx`
**Current**: "Via CLI (dso status, dso logs) or webhook integrations. DSO can send rotation events to your monitoring system. Full audit trail available."
**Status**: ✅ CORRECT - truthful about capabilities
**No fix needed**

---

## Conclusion

**Contradictions Fixed**:
1. Removed fake dashboard mockup (Priority 1 ✅)
2. SystemBoundaries explicitly states "CLI-only; no dashboard" ✅
3. TerminalDemo states "No monitoring dashboards" ✅

**Remaining Language Fixes**:
1. ProductPreview: Remove "powerful" (1 fix)
2. Vault integration: Rewrite to avoid "enterprise-grade" claim about DSO (1 fix)

**Total changes needed**: 2 rewrites
**Build impact**: None
