"use client";

import { getAllData, getDataById } from "@/action";
import { TicketForm } from "@/components/forms/ticket-form";
import { Category } from "@/db/schema/category_collection";
import { Customer } from "@/db/schema/customer_collection";
import { User } from "@/db/schema/user_collection";
import { CustomError } from "@/type";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EditTicketPage() {
  const params = useParams();
  const ticketId = params.id as string | undefined;

  const [ticket, setTicket] = useState({});
  const [users, setUsers] = useState<User[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const router = useRouter();

  async function fetchData(ticketId: string) {
    let result = await getDataById(ticketId, "/tickets");
    setTicket(result);

    let customersData = await getAllData("/customers");
    setCustomers(customersData);

    let usersData = await getAllData("/users");
    // filter hanya user active dan bukan admin untuk assign ticket
    const supportUsers = usersData.filter(
      (user: User) => user.status === "Active" && user.role !== "Admin"
    );

    setUsers(supportUsers);

    let categoriesData = await getAllData("/categories");
    const filterCategory = categoriesData.filter(
      (category: any) => category.isDeleted === false
    );

    setCategories(filterCategory);
  }

  const handleSubmit = async (input: any) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw await response.json();
      }

      let ticket = await response.json();

      router.push("/dashboard/tickets");

      toast.success(ticket.message);
    } catch (error) {
      toast.error((error as CustomError).message);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchData(ticketId);
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Update User</h2>
      </div>
      {Object.keys(ticket).length === 0 ? (
        <p>Loading ticket data...</p>
      ) : (
        <TicketForm
          initialData={ticket}
          customers={customers}
          categories={categories}
          onSubmit={handleSubmit}
          isEditMode
        />
      )}{" "}
    </div>
  );
}
