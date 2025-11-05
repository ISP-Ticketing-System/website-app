"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Customer } from "@/db/schema/customer_collection";
import clsx from "clsx";

interface ViewCustomerModalProps {
  customer: any;
}

export function ViewCustomerModal({ customer }: ViewCustomerModalProps) {
  const [open, setOpen] = useState(false);

  const formatDate = (date: Date | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Eye className="h-4 w-4 mr-2" />
        View Customer
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              Complete information for customer {customer?.firstName}{" "}
              {customer?.lastName}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="personal" className="w-full">
            <TabsList
              className={clsx(
                "grid mb-4",
                customer?.customerType === "Dedicated"
                  ? "grid-cols-4"
                  : "grid-cols-3"
              )}
            >
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="service">Service</TabsTrigger>
              {customer?.customerType === "Dedicated" && (
                <TabsTrigger value="business">Business</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Personal Information</span>
                    <Badge
                      variant={
                        customer?.status.toString() === "Active"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {customer?.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Customer Type
                      </p>
                      <p>{customer?.customerType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Customer ID
                      </p>
                      <p>{customer?.cid || "-"}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        First Name
                      </p>
                      <p>{customer?.firstName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Last Name
                      </p>
                      <p>{customer?.lastName || "-"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Email
                      </p>
                      <p>{customer?.email || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Phone Number
                      </p>
                      <p>{customer?.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        ID Type
                      </p>
                      <p>{customer?.idType || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        ID Number
                      </p>
                      <p>{customer?.idNumber || "-"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="address" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Address Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Street Address
                    </p>
                    <p>{customer?.streetAddress}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        City
                      </p>
                      <p>{customer?.city}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Province
                      </p>
                      <p>{customer?.province}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Postal Code
                      </p>
                      <p>{customer?.postalCode}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Country
                      </p>
                      <p>{customer?.country}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="service" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Service Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Service Name
                      </p>

                      {customer.service?.serviceName ? (
                        <p>{customer?.service.serviceName}</p>
                      ) : (
                        <p>{customer?.serviceData.name}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Service ID
                      </p>
                      <p>{customer?.serviceId}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Installation Date
                      </p>
                      <p>{formatDate(customer?.installationDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Contract Length
                      </p>
                      <p>{customer?.contractLength} months</p>
                    </div>
                  </div>

                  {customer?.customerType === "FTTH" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Site
                        </p>
                        <p>{customer?.site || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Device SN
                        </p>
                        <p>{customer?.deviceSN || "-"}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        VLAN
                      </p>
                      <p>{customer?.vlan || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Notes
                      </p>
                      <p className="whitespace-pre-wrap">
                        {customer?.note || "-"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {customer?.customerType === "Dedicated" && (
              <TabsContent value="business" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Business Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Company Name
                        </p>
                        <p>{customer?.companyName || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          NPWP
                        </p>
                        <p>{customer?.npwp || "-"}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        NIB
                      </p>
                      <p>{customer?.nib || "-"}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
