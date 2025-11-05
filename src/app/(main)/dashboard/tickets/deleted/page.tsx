import { TicketProvider } from "@/context/ticket-context";
import TicketsDeletedContentPage from "@/components/tickets/tickets-deleted-content-page";

export default function DeletedTicketsPage() {
  return (
    <TicketProvider>
      <TicketsDeletedContentPage />
    </TicketProvider>
  );
}
