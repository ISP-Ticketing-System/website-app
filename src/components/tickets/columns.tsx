"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Eye,
  MessageSquare,
  Trash,
  ArchiveRestore,
} from "lucide-react";
import { Ticket } from "@/db/schema/ticket_collection";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { deleteDataById } from "@/action";
import toast from "react-hot-toast";
import { useTicketContext } from "@/context/ticket-context";
import { CustomError } from "@/type";

export const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    header: "Customer",
    cell: ({ row }) => {
      const firstName = row.original.customerData?.firstName ?? "";
      const lastName = row.original.customerData?.lastName ?? "";
      return `${firstName} ${lastName}`;
    },
  },
  {
    accessorKey: "ticketCategory",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("ticketCategory") as string;
      return (
        <Badge variant="outline" className="capitalize">
          {category}
        </Badge>
      );
    },
  },
  {
    header: "Assigned To",
    cell: ({ row }) => {
      const escalationLevel = row.original.escalationLevel;
      const assignTo =
        escalationLevel === 0
          ? "-"
          : escalationLevel === 1
          ? "Helpdesk"
          : escalationLevel === 2
          ? "NOC"
          : "Super NOC";

      return <>{assignTo}</>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      // const lastLog = logs?.[logs.length - 1];
      // const status = lastLog?.status;

      return (
        <Badge
          variant={
            status === "Started"
              ? "blue"
              : status === "In Progress"
              ? "yellow"
              : status === "Done"
              ? "default"
              : status === "Escalated"
              ? "destructive"
              : "grey"
          }
          className="capitalize"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const ticket = row.original;
      const router = useRouter();

      const { fetchTickets } = useTicketContext();

      const [isLoading, setIsLoading] = useState(false);

      const handleDelete = async (id: string) => {
        try {
          setIsLoading(true);
          let response = await deleteDataById(id, "/tickets");
          toast.success(response.message);
          await fetchTickets();
        } catch (error) {
          toast.error((error as CustomError).message);
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(ticket._id.toString())
              }
            >
              Copy ticket ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* {ticket.status === "Open" && (
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/tickets/${ticket._id}/edit`)
                }
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )} */}

            <DropdownMenuItem asChild>
              <Link href={`/dashboard/tickets/${ticket._id.toString()}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>

            {/* <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDelete(ticket._id.toString())}
            >
              {ticket.isDeleted === false ? (
                <Trash className="mr-2 h-4 w-4" />
              ) : (
                <ArchiveRestore className="mr-2 h-4 w-4" />
              )}
              {ticket.isDeleted === false ? "Delete" : "Restore"}
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
