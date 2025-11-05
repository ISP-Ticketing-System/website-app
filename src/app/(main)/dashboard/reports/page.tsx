import ReportsContentPage from "@/components/reports/reports-content-page";
import { TicketProvider } from "@/context/ticket-context";

export default function ReportsPage() {
  return (
    <TicketProvider>
      <ReportsContentPage />
    </TicketProvider>
  );
}
