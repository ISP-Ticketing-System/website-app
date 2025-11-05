"use client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DataTable } from "@/components/tickets/data-table";
import { columns } from "@/components/tickets/columns";
import { useTicketContext } from "@/context/ticket-context";
import Link from "next/link";
import { useProfileContext } from "@/context/profile-context";

export default function TicketsContentPage() {
  const { tickets, isLoading } = useTicketContext();
  const { profile } = useProfileContext();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tickets</h2>
        {(profile?.role === "Admin" ||
          profile?.role === "CS FTTH" ||
          profile?.role === "Helpdesk") && (
          <Button asChild>
            <Link href={"/dashboard/tickets/new"}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Ticket
            </Link>
          </Button>
        )}
      </div>
      <div>
        {isLoading ? (
          <p>Loading tickets data...</p>
        ) : (
          <DataTable columns={columns} data={tickets} />
        )}
      </div>
    </div>
  );
}
