"use client";

import { getAllData } from "@/action";
import { TicketForm } from "@/components/forms/ticket-form";
import { Category } from "@/db/schema/category_collection";
import { Customer } from "@/db/schema/customer_collection";
import { User } from "@/db/schema/user_collection";
import { CustomError } from "@/type";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function NewTicketPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // In a real application, this would be handled by a server action
  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw await response.json();
      }

      let customer = await response.json();

      router.push("/dashboard/tickets");

      toast.success(customer.message);
    } catch (error) {
      toast.error((error as CustomError).message);
    }
  };

  async function fetchData() {
    try {
      let customersData = await getAllData("/customers");

      const filterActiveCustomer = customersData.filter(
        (customer: any) => customer.status === "Active"
      );

      let categoriesData = await getAllData("/categories");
      const filterCategory = categoriesData.filter(
        (category: any) => category.isDeleted === false
      );

      setCategories(filterCategory);
      setCustomers(filterActiveCustomer);
    } catch (error) {
      console.log(error, "ini error form ticket");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Create New Ticket</h2>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <TicketForm
          customers={customers}
          categories={categories}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
