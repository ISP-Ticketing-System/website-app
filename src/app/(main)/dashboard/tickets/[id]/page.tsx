"use client";

import { FormEvent, useEffect, useState } from "react";
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
import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react";
import { format } from "date-fns";
import { TicketLogTimeline } from "@/components/tickets/ticket-log-timeline";
import { Log, Sla, Ticket } from "@/db/schema/ticket_collection";
import { getDataById } from "@/action";
import SlaCountdown from "@/components/tickets/count-down-sla";
import toast from "react-hot-toast";
import { CustomError } from "@/type";
import { useProfileContext } from "@/context/profile-context";
import { ViewCustomerModal } from "@/components/customers/ViewCustomerModal";

export default function TicketDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const ticketId = params.id as string | undefined;

  const { profile } = useProfileContext();

  const [ticketData, setTicketData] = useState<Ticket>();
  const [isLoading, setIsLoading] = useState(true);

  const [newNote, setNewNote] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newAssignTo, setNewAssignTo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [lastLog, setLastLog] = useState<Log | null>(null);
  const [lastSla, setLastSla] = useState<Sla | null>(null);

  // Function to handle adding a new log entry
  const handleAddLogEntry = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (!newNote.trim()) return;

      setIsSubmitting(true);

      const response = await fetch(`/api/tickets/${ticketData?._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          note: newNote,
          assignTo: newAssignTo,
        }),
      });

      if (!response.ok) {
        throw await response.json();
      }

      const data = await response.json();

      toast.success(data.message);

      router.push("/dashboard");
    } catch (error) {
      toast.error((error as CustomError).message);
    } finally {
      setIsSubmitting(false);
    }
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
        return "blue";
    }
  };

  async function fetchData(ticketId: string) {
    let result = await getDataById(ticketId, "/tickets");

    setTicketData(result);

    setLastLog(result.logs[result.logs?.length - 1]);

    setLastSla(result.slaHistory[result.slaHistory?.length - 1]);

    let assign = result.escalationLevel === 1 ? "NOC" : "Super NOC";
    setNewAssignTo(assign);

    setIsLoading(false);
  }

  useEffect(() => {
    if (ticketId) {
      fetchData(ticketId);
    }
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ticket Details</h1>
          <p className="text-muted-foreground">
            View and manage ticket information
          </p>
        </div>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
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
                    <Badge variant="outline" className="capitalize">
                      {ticketData?.ticketCategory}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2 text-xl">
                    {ticketData?.ticketCategory}
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

                  {ticketData?.status !== "Done" ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>SLA: {lastSla?.durationMinutes} Minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <SlaCountdown
                          assignedAt={lastSla?.assignedAt ?? new Date()}
                          durationMinutes={lastSla?.durationMinutes ?? 0}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Closed:{" "}
                        {format(
                          new Date(
                            ticketData?.logs[ticketData.logs.length - 1].date ??
                              ""
                          ),
                          "PPP p"
                        )}
                      </span>
                    </div>
                  )}
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
                            <p className="text-sm font-medium">
                              ID Number (CID)
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {ticketData?.customerData.cid}
                            </p>
                          </div>
                        </div>

                        {/* HR span full */}
                        <hr className="col-span-full border-muted" />

                        {ticketData?.customerData && (
                          <div className="col-span-full space-y-2">
                            <p className="text-sm text-muted-foreground">
                              Click the button below to view customer details in
                              a modal
                            </p>
                            <ViewCustomerModal
                              customer={ticketData?.customerData}
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {ticketData?.status !== "Done" &&
                    lastSla?.handlerRole === profile?.role && (
                      <>
                        {/* Add Note */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Submit</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <form
                              className="space-y-4"
                              onSubmit={(e) => handleAddLogEntry(e)}
                            >
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
                                          | "In Progress"
                                          | "Escalated"
                                          | "Done"
                                      )
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {["In Progress", "Escalated", "Done"]
                                        .filter(
                                          (el) =>
                                            el !==
                                              ticketData?.status?.toString() &&
                                            !(
                                              profile?.role === "Super NOC" &&
                                              el === "Escalated"
                                            )
                                        )
                                        .map((el, idx) => (
                                          <SelectItem key={idx} value={el}>
                                            {el}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                {newStatus === "Escalated" && (
                                  <div className="flex-1">
                                    <label className="text-sm font-medium mb-1.5 block">
                                      Assign To
                                    </label>
                                    <Select
                                      value={newAssignTo}
                                      onValueChange={setNewAssignTo}
                                    >
                                      <SelectTrigger disabled={true}>
                                        <SelectValue placeholder="Select assignee" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="NOC">NOC</SelectItem>
                                        <SelectItem value="Super NOC">
                                          Super NOC
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}
                              </div>
                              <div className="flex justify-end">
                                <Button
                                  type="submit"
                                  disabled={!newNote.trim() || isSubmitting}
                                >
                                  {isSubmitting ? "Submitting..." : "Add Note"}
                                </Button>
                              </div>
                            </form>
                          </CardContent>
                        </Card>
                      </>
                    )}
                </TabsContent>

                <TabsContent value="timeline" className="pt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Ticket Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TicketLogTimeline logs={ticketData?.logs ?? []} />
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
                        variant={getStatusBadgeVariant(lastLog?.status ?? "")}
                        className="capitalize"
                      >
                        {lastLog?.status}
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
                        {lastSla?.handlerRole ?? "-"}
                      </span>
                    </div>
                    <Separator />

                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Current Handle by
                      </span>
                      <span className="text-sm font-medium capitalize">
                        {`${ticketData?.currentHandleUserData.username} (${ticketData?.currentHandleUserData.role})`}
                      </span>
                    </div>
                    <Separator />

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
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
