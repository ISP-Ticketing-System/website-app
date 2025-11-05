import { TicketProvider } from "@/context/ticket-context";
import TicketsContentPage from "@/components/tickets/tickets-content-page";

export default function TicketsPage() {
  return (
    <TicketProvider>
      <TicketsContentPage />
    </TicketProvider>
  );
}
