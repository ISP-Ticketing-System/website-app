"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { Ticket } from "@/db/schema/ticket_collection";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "../ui/button";

export const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: "code",
    header: "Ticket Code",
  },
  {
    accessorKey: "subject",
    header: "Subject",
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
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = parseISO(row.getValue("createdAt"));
      return <span>{format(date, "PPP")}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const ticket = row.original;

      return (
        <Button asChild variant={"outline"}>
          <Link href={`/dashboard/tickets/${ticket._id.toString()}`}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </Button>
      );
    },
  },
];
