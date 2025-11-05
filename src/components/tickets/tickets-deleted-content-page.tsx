"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DataTable } from "@/components/tickets/deleted/deleted-data-table";
import { columns } from "@/components/tickets/deleted/deleted-columns";
import { useTicketContext } from "@/context/ticket-context";
import { useEffect, useState } from "react";
import { Ticket } from "@/db/schema/ticket_collection";

export default function TicketsDeletedContentPage() {
  const { tickets, isLoading } = useTicketContext();
  const [deletedTickets, setDeletedTickets] = useState<Ticket[]>([]);

  console.log(tickets);
  console.log(deletedTickets, "???");

  useEffect(() => {
    const deleted = tickets.filter((ticket) => ticket.isDeleted === true);
    setDeletedTickets(deleted);
  }, [tickets]); // depend on tickets supaya update kalau data berubah

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Deleted Tickets</h2>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Restore Selected
        </Button>
      </div>
      <div>
        {isLoading && !deletedTickets.length ? (
          <p>Loading tickets data...</p>
        ) : (
          <DataTable columns={columns} data={deletedTickets} />
        )}
      </div>
    </div>
  );
}
