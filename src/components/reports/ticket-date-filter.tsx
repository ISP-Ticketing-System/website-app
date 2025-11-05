"use client";

import * as React from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/reports/filtered-tickets-table";
import { columns } from "@/components/reports/filtered-tickets-columns";
import { isWithinInterval, parseISO } from "date-fns";
import { Ticket } from "@/db/schema/ticket_collection";
import { useTicketContext } from "@/context/ticket-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { TicketStatusChart } from "./ticket-status-chart";
import { TicketCategoryChart } from "./ticket-category-chart";
import { DownloadIcon } from "lucide-react";
import { exportTicketsToExcel } from "@/helpers/generateExcel";

export function TicketDateFilter() {
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
  const [filteredTickets, setFilteredTickets] = React.useState<Ticket[]>([]);
  const [isFiltered, setIsFiltered] = React.useState(false);

  const { tickets } = useTicketContext();

  const handleFilter = () => {
    if (startDate && endDate) {
      // Ensure end date is set to the end of the day
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);

      const filtered = tickets.filter((ticket) => {
        const ticketDate = parseISO(ticket.createdAt.toString());
        return isWithinInterval(ticketDate, {
          start: startDate,
          end: endOfDay,
        });
      });

      setFilteredTickets(filtered);
      setIsFiltered(true);
    }
  };

  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setFilteredTickets([]);
    setIsFiltered(false);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DatePicker
            date={startDate}
            setDate={setStartDate}
            label="Start Date"
          />
          <DatePicker date={endDate} setDate={setEndDate} label="End Date" />
          <div className="flex items-end gap-2">
            <Button
              onClick={handleFilter}
              disabled={!startDate || !endDate}
              className="flex-1"
            >
              Apply Filter
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              disabled={!startDate && !endDate && !isFiltered}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
      {isFiltered && (
        <>
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                Filtered Tickets ({filteredTickets.length})
              </h3>
              {filteredTickets.length > 0 && (
                <button
                  onClick={() => exportTicketsToExcel(filteredTickets)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded border border-primary text-primary hover:bg-primary/90 hover:text-white"
                >
                  <DownloadIcon className="w-4 h-4" /> Export to Excel
                </button>
              )}
            </div>

            {filteredTickets.length > 0 ? (
              <DataTable columns={columns} data={filteredTickets} />
            ) : (
              <div className="border rounded-md p-8 text-center">
                <p className="text-muted-foreground">
                  No tickets found in the selected date range.
                </p>
              </div>
            )}
          </div>

          {filteredTickets.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Status Distribution</CardTitle>
                  <CardDescription>
                    Current distribution of tickets by status
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <TicketStatusChart filteredTickets={filteredTickets} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Category Distribution</CardTitle>
                  <CardDescription>
                    Distribution of tickets by category
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <TicketCategoryChart filteredTickets={filteredTickets} />
                </CardContent>
              </Card>
              {/* <Card>
          <CardHeader>
            <CardTitle>Average Resolution Time</CardTitle>
            <CardDescription>
              Average time to resolve tickets by category
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <TicketResolutionTimeChart />
          </CardContent>
        </Card> */}
            </div>
          )}
        </>
      )}
    </>
  );
}
