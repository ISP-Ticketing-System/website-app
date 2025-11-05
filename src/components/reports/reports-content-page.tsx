import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TicketDateFilter } from "@/components/reports/ticket-date-filter";

export default function ReportsContentPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Ticket Date Filter</CardTitle>
          <CardDescription>Filter tickets by date range</CardDescription>
        </CardHeader>
        <CardContent>
          <TicketDateFilter />
        </CardContent>
      </Card>
    </div>
  );
}
