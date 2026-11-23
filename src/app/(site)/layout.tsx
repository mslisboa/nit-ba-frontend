import { Suspense } from "react";

import { InstitutionalBrands } from "@/components/layout/InstitutionalBrands";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SkipLink } from "@/components/layout/SkipLink";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <div
        id="accessibility-status"
        className="sr-only"
        role="status"
        aria-live="polite"
      />
      <InstitutionalBrands />
      <div className="site-shell">
        <div className="brand-stripe" aria-hidden="true" />
        <Suspense fallback={<div className="site-header" aria-hidden="true" />}>
          <SiteHeader />
        </Suspense>
        <main id="app" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
