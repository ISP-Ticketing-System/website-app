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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Customer } from "@/db/schema/customer_collection";
import { CustomerCombobox } from "../tickets/customer-combobox";
import {
  FormCreateSchema,
  formCreateValue,
} from "@/db/schema/ticket_collection";
import { Category } from "@/db/schema/category_collection";
import { CategoryCombobox } from "../tickets/category-combobox";
import { ViewCustomerModal } from "../customers/ViewCustomerModal";

interface TicketFormProps {
  initialData?: Partial<formCreateValue>;
  onSubmit: (data: formCreateValue) => void;
  isEditMode?: boolean;
  customers?: Customer[];
  categories: Category[];
}

export function TicketForm({
  initialData,
  onSubmit,
  isEditMode = false,
  customers,
  categories,
}: TicketFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<formCreateValue>({
    resolver: zodResolver(FormCreateSchema),
    defaultValues: {
      customerId: initialData?.customerId || "",
      categoryId: initialData?.categoryId || "",
      escalationRequired: initialData?.escalationRequired || false,
      // subject: initialData?.subject || "",
      description: initialData?.description || "",
    },
  });

  let customerId: string = form.watch("customerId");

  async function handleSubmit(values: formCreateValue) {
    setIsLoading(true);

    // Simulate API call
    await onSubmit(values);

    setIsLoading(false);
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditMode ? "Edit Ticket" : "Create New Ticket"}
        </CardTitle>
        <CardDescription>
          {isEditMode
            ? "Update ticket details and status."
            : "Create a new support ticket for a customer."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomerCombobox
                isEditMode={isEditMode}
                control={form.control}
                customers={customers}
              />

              <CategoryCombobox
                isEditMode={isEditMode}
                control={form.control}
                categories={categories}
              />

              {/* <FormField
                control={form.control}
                name="ticketCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((dt) => (
                          <SelectItem key={dt} value={dt}>
                            {dt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>

            {customerId && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Customer View</CardTitle>
                  <CardDescription>
                    Click the button below to view customer details in a modal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ViewCustomerModal
                    customer={customers?.find(
                      (el) => el._id.toString() === customerId
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief description of the issue"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the issue..."
                      className="resize-none min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="escalationRequired"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Escalation Required</FormLabel>
                    <FormDescription>
                      Check this box if this ticket requires escalation to other
                      role
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* <AssignToCombobox control={form.control} users={users} /> */}

            <CardFooter className="flex justify-between px-0">
              <Button variant="outline" type="button" asChild>
                <Link href={"/dashboard/tickets"}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>Submit</>
                  // <>{isEditMode ? "Update Ticket" : "Create Ticket"}</>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
