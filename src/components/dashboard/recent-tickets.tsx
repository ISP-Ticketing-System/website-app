import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Ticket {
  id: string
  customer: string
  customerInitials: string
  subject: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "critical"
  createdAt: string
}

const tickets: Ticket[] = [
  {
    id: "TKT-001",
    customer: "John Doe",
    customerInitials: "JD",
    subject: "Internet connection issues",
    status: "open",
    priority: "high",
    createdAt: "2 hours ago",
  },
  {
    id: "TKT-002",
    customer: "Jane Smith",
    customerInitials: "JS",
    subject: "Billing inquiry",
    status: "in-progress",
    priority: "medium",
    createdAt: "5 hours ago",
  },
  {
    id: "TKT-003",
    customer: "Robert Johnson",
    customerInitials: "RJ",
    subject: "Service upgrade request",
    status: "open",
    priority: "low",
    createdAt: "1 day ago",
  },
  {
    id: "TKT-004",
    customer: "Emily Davis",
    customerInitials: "ED",
    subject: "Router configuration",
    status: "resolved",
    priority: "medium",
    createdAt: "2 days ago",
  },
  {
    id: "TKT-005",
    customer: "Michael Wilson",
    customerInitials: "MW",
    subject: "Network outage report",
    status: "closed",
    priority: "critical",
    createdAt: "3 days ago",
  },
]

export function RecentTickets() {
  return (
    <div className="space-y-8">
      {tickets.map((ticket) => (
        <div key={ticket.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={ticket.customer} />
            <AvatarFallback>{ticket.customerInitials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{ticket.customer}</p>
            <p className="text-sm text-muted-foreground">{ticket.subject}</p>
            <div className="flex items-center pt-1 gap-2">
              <Badge
                variant={
                  ticket.status === "open"
                    ? "default"
                    : ticket.status === "in-progress"
                      ? "secondary"
                      : ticket.status === "resolved"
                        ? "outline"
                        : "destructive"
                }
                className="text-xs"
              >
                {ticket.status}
              </Badge>
              <Badge
                variant={
                  ticket.priority === "low"
                    ? "outline"
                    : ticket.priority === "medium"
                      ? "secondary"
                      : ticket.priority === "high"
                        ? "default"
                        : "destructive"
                }
                className="text-xs"
              >
                {ticket.priority}
              </Badge>
            </div>
          </div>
          <div className="ml-auto text-xs text-muted-foreground">{ticket.createdAt}</div>
        </div>
      ))}
    </div>
  )
}
