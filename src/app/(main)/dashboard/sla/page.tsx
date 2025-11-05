"use client";

import SLAContentPage from "@/components/sla/sla-content-page";
import { SLAProvider } from "@/context/sla-context";

export default function SLAPage() {
  return (
    <SLAProvider>
      <SLAContentPage />
    </SLAProvider>
  );
}
