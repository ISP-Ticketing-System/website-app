"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ServiceInput, ServiceSchema } from "@/db/schema/service_collection";

type FormValues = ServiceInput;

interface ServiceFormProps {
  initialData?: Partial<FormValues>;
  onSubmit: (data: FormValues) => void;
  isEditMode?: boolean;
}

export function ServiceForm({
  initialData,
  onSubmit,
  isEditMode = false,
}: ServiceFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: {
      serviceName: initialData?.serviceName || "",
      monthlyPrice: initialData?.monthlyPrice || "0",
      // setupFee: initialData?.setupFee || "0",
      planDescription: initialData?.planDescription || "",
      status: initialData?.status || "Available",
    },
  });

  async function handleSubmit(values: FormValues) {
    setIsLoading(true);

    await onSubmit(values);

    setIsLoading(false);
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditMode ? "Edit Service" : "Create New Service"}
        </CardTitle>
        <CardDescription>
          {isEditMode
            ? "Update service plan details and pricing."
            : "Add a new service plan to the system."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
            autoComplete="off"
          >
            <FormField
              control={form.control}
              name="serviceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Fiber 100Mbps" {...field} autoFocus />
                  </FormControl>
                  <FormDescription>
                    The name of the service plan as shown to customers.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
            <FormField
              control={form.control}
              name="monthlyPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Price (Rp)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormDescription>Monthly subscription fee</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
                control={form.control}
                name="setupFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Setup Fee (Rp)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>One-time installation fee</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            {/* </div> */}

            <FormField
              control={form.control}
              name="planDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="High-speed fiber internet with 100Mbps download and 20Mbps upload speeds."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Detailed description of the service plan features
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Current availability status of this service plan
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="flex justify-between px-0">
              <Button asChild variant="outline" type="button">
                <Link href={"/dashboard/services"}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{isEditMode ? "Update Service" : "Create Service"}</>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
