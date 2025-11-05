import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/dashboard/overview";
import { RecentTickets } from "@/components/dashboard/recent-tickets";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import NocDashboardPage from "@/components/dashboard/noc-dashboard-page";
import { TicketProvider } from "@/context/ticket-context";
import { ProfileProvider } from "@/context/profile-context";

export default function DashboardPage() {
  return (
    <TicketProvider>
      <ProfileProvider>
        {/* <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <DashboardStats />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Ticket Overview</CardTitle>
                  <CardDescription>
                    Ticket creation and resolution over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Tickets</CardTitle>
                  <CardDescription>
                    Latest tickets created in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentTickets />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>
                  Detailed analysis of ticket metrics and performance
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">
                    Advanced analytics will be available soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div className="mt-5"> */}
        <NocDashboardPage />
        {/* </div> */}
      </ProfileProvider>
    </TicketProvider>
  );
}
