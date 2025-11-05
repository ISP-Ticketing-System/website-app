"use client";

import Link from "next/link";
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
import { MoreHorizontal, Eye, RotateCcw, Trash2 } from "lucide-react";
import { Ticket } from "@/db/schema/ticket_collection";

export const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/tickets/deleted/${row.original.code}`}
          className="font-medium hover:underline"
        >
          {row.original.code}
        </Link>
      );
    },
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
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/tickets/deleted/${row.original._id}`}
          className="hover:underline"
        >
          {row.getValue("subject")}
        </Link>
      );
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
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      return (
        <Badge
          variant={
            priority === "Low"
              ? "secondary"
              : priority === "Medium"
              ? "blue"
              : "destructive"
          }
          className="capitalize"
        >
          {priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "Open"
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
          {status.replace("-", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "deletedAt",
    header: "Deleted At",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const ticket = row.original;

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
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/tickets/deleted/${ticket._id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RotateCcw className="mr-2 h-4 w-4" />
              Restore Ticket
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Permanently Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
