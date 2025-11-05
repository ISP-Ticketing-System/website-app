"use client";

import { UserForm } from "@/components/forms/user-form";
import { CustomError } from "@/type";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function NewUserPage() {
  const router = useRouter();

  // In a real application, this would be handled by a server action
  const handleSubmit = async (input: any) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw await response.json();
      }

      let user = await response.json();

      router.push("/dashboard/users");

      toast.success(user.message);
    } catch (error) {
      toast.error((error as CustomError).message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Create New User</h2>
      </div>
      <UserForm onSubmit={handleSubmit} />
    </div>
  );
}
