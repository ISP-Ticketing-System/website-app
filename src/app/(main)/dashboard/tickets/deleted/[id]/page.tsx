"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  Tag,
  User,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { TicketLogTimeline } from "@/components/tickets/ticket-log-timeline";
import { Ticket } from "@/db/schema/ticket_collection";
import { useTicketContext } from "@/context/ticket-context";
import { getDataById } from "@/action";

// Mock data for the ticket
// const ticketData = {
//   id: "TKT-001",
//   code: "TKT-2023-001",
//   customerId: "CUST-001",
//   customerName: "John Doe",
//   ticketCategory: "complaint",
//   priority: "High",
//   assignTo: "helpdesk",
//   escalationRequired: "no",
//   subject: "Internet connection issues",
//   description:
//     "Customer is experiencing intermittent connection drops throughout the day. They have tried restarting their router multiple times but the issue persists. The problem started yesterday evening and has been ongoing since then.",
//   sla: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
//   status: "in progress",
//   log: [
//     {
//       date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
//       handleByUserId: "USR-001",
//       handleByUsername: "admin",
//       handleByRole: "admin",
//       assignToUserId: "USR-002",
//       assignToUsername: "support1",
//       assignToRole: "support",
//       note: "Ticket created and assigned to support team",
//       status: "open",
//     },
//     {
//       date: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
//       handleByUserId: "USR-002",
//       handleByUsername: "support1",
//       handleByRole: "support",
//       assignToUserId: "USR-002",
//       assignToUsername: "support1",
//       assignToRole: "support",
//       note: "Initial assessment: Possible line interference. Scheduled remote diagnostics.",
//       status: "in progress",
//     },
//   ],
//   isDeleted: false,
//   createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
//   updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
//   deletedAt: null,
// };

export default function TicketDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const ticketId = params.id as string | undefined;

  const [ticketData, setTicketData] = useState<Ticket>();
  const [isLoading, setIsLoading] = useState(true);

  const [newNote, setNewNote] = useState("");
  const [newStatus, setNewStatus] = useState(ticketData?.status);
  const [newAssignTo, setNewAssignTo] = useState(ticketData?.assignToId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to handle adding a new log entry
  const handleAddLogEntry = () => {
    if (!newNote.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setNewNote("");
      // In a real app, you would update the ticket data here
    }, 1000);
  };

  // Get time remaining until SLA breach
  const getSlaTimeRemaining = () => {
    if (!ticketData?.createdAt || !ticketData?.sla) return "-";

    const now = new Date();
    const createdAt = new Date(ticketData.createdAt);

    // Ambil angka jam dari string "24 hours"
    const slaHours = parseInt(ticketData.sla);

    if (isNaN(slaHours)) return "Invalid SLA";

    // Tambahkan slaHours ke createdAt
    const slaTime = new Date(createdAt.getTime() + slaHours * 60 * 60 * 1000);

    const diffMs = slaTime.getTime() - now.getTime();

    if (diffMs <= 0) return "SLA Breached";

    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHrs}h ${diffMins}m remaining`;
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Open":
        return "blue";
      case "In Progress":
        return "yellow";
      case "Done":
        return "default";
      case "Escalated":
        return "destructive";
      default:
        return "grey";
    }
  };

  // Get priority badge variant
  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "low":
        return "secondary";
      case "medium":
        return "blue";
      default:
        return "destructive";
    }
  };

  async function fetchData(ticketId: string) {
    let result = await getDataById(ticketId, "/tickets");
    setTicketData(result);

    setIsLoading(false);
  }

  useEffect(() => {
    if (ticketId) {
      fetchData(ticketId);
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        // <></>
        <div className="flex flex-col gap-6">
          {/* Header with back button */}
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Ticket Details
              </h1>
              <p className="text-muted-foreground">
                View and manage ticket information
              </p>
            </div>
          </div>

          {/* Ticket header card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={getStatusBadgeVariant(ticketData?.status ?? "")}
                      className="capitalize"
                    >
                      {ticketData?.status}
                    </Badge>
                    <Badge
                      variant={getPriorityBadgeVariant(
                        ticketData?.priority ?? ""
                      )}
                      className="capitalize"
                    >
                      {ticketData?.priority}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {ticketData?.ticketCategory}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2 text-xl">
                    {ticketData?.subject}
                  </CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />
                    {ticketData?.code}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Created:{" "}
                      {format(new Date(ticketData?.createdAt ?? ""), "PPP p")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {/* SLA: {format(new Date(ticketData?.sla), "PPP p")} */}
                      SLA: {ticketData?.sla}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={`h-4 w-4 ${
                        getSlaTimeRemaining() === "SLA Breached"
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={
                        getSlaTimeRemaining() === "SLA Breached"
                          ? "text-destructive font-medium"
                          : ""
                      }
                    >
                      {getSlaTimeRemaining()}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Ticket details */}
            <div className="md:col-span-2 space-y-6">
              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6 pt-4">
                  {/* Description */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-line">
                        {ticketData?.description}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Customer Information */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Customer Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Customer Name</p>
                            <p className="text-sm text-muted-foreground">
                              {ticketData?.customerData.firstName}{" "}
                              {ticketData?.customerData.lastName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Customer ID</p>
                            <p className="text-sm text-muted-foreground">
                              {ticketData?.customerId}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Add Note */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Add Note</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Add a note to this ticket..."
                          className="min-h-[100px]"
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                        />
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <label className="text-sm font-medium mb-1.5 block">
                              Status
                            </label>
                            <Select
                              value={newStatus}
                              onValueChange={(value) =>
                                setNewStatus(
                                  value as
                                    | "Open"
                                    | "In Progress"
                                    | "Escalated"
                                    | "Done"
                                    | "Closed"
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Open">Open</SelectItem>
                                <SelectItem value="In Progress">
                                  In Progress
                                </SelectItem>
                                <SelectItem value="Escalated">
                                  Escalated
                                </SelectItem>
                                <SelectItem value="Done">Done</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex-1">
                            <label className="text-sm font-medium mb-1.5 block">
                              Assign To
                            </label>
                            <Select
                              value={newAssignTo}
                              onValueChange={setNewAssignTo}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select assignee" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cs ftth">CS FTTH</SelectItem>
                                <SelectItem value="helpdesk">
                                  Helpdesk
                                </SelectItem>
                                <SelectItem value="noc">NOC</SelectItem>
                                <SelectItem value="super noc">
                                  Super NOC
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            onClick={handleAddLogEntry}
                            disabled={!newNote.trim() || isSubmitting}
                          >
                            {isSubmitting ? "Submitting..." : "Add Note"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="timeline" className="pt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Ticket Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TicketLogTimeline logs={ticketData?.log ?? []} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right column - Ticket metadata */}
            <div className="space-y-6">
              {/* Ticket Information */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    Ticket Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Status
                      </span>
                      <Badge
                        variant={getStatusBadgeVariant(
                          ticketData?.status ?? ""
                        )}
                        className="capitalize"
                      >
                        {ticketData?.status}
                      </Badge>
                    </div>
                    <Separator />

                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Priority
                      </span>
                      <Badge
                        variant={getPriorityBadgeVariant(
                          ticketData?.priority ?? ""
                        )}
                        className="capitalize"
                      >
                        {ticketData?.priority}
                      </Badge>
                    </div>
                    <Separator />

                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Category
                      </span>
                      <span className="text-sm font-medium capitalize">
                        {ticketData?.ticketCategory}
                      </span>
                    </div>
                    <Separator />

                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Assigned To
                      </span>
                      <span className="text-sm font-medium capitalize">
                        {
                          ticketData?.log?.[ticketData.log.length - 1]
                            ?.assignToUsername
                        }
                        {" - "}
                        {
                          ticketData?.log?.[ticketData.log.length - 1]
                            ?.assignToRole
                        }
                      </span>
                    </div>
                    <Separator />

                    {/* <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Escalation Required
                      </span>
                      <span className="text-sm font-medium capitalize">
                        {ticketData?.escalationRequired}
                      </span>
                    </div>
                    <Separator /> */}

                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Created At
                      </span>
                      <span className="text-sm font-medium">
                        {format(new Date(ticketData?.createdAt ?? ""), "PPP")}
                      </span>
                    </div>
                    <Separator />

                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Updated At
                      </span>
                      <span className="text-sm font-medium">
                        {format(new Date(ticketData?.updatedAt ?? ""), "PPP")}
                      </span>
                    </div>
                    {ticketData?.deletedAt && (
                      <>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Deleted At
                          </span>
                          <span className="text-sm font-medium">
                            {format(new Date(ticketData?.deletedAt), "PPP")}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Export as PDF
                  </Button>
                  <Button className="w-full" variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Customer
                  </Button>
                  {ticketData?.status !== "Done" && (
                    <Button className="w-full" variant="default">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark as Resolved
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
