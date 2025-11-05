"use client";

import { getDataById } from "@/action";
import { UserForm } from "@/components/forms/user-form";
import { CustomError } from "@/type";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EditUserPage() {
  const params = useParams();
  const userId = params.id as string | undefined;

  const [user, setUser] = useState({});
  const router = useRouter();

  async function fetchData(userId: string) {
    let result = await getDataById(userId, "/users");
    setUser(result);
  }

  const handleSubmit = async (input: any) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
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

  useEffect(() => {
    if (userId) {
      fetchData(userId);
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Update User</h2>
      </div>
      {Object.keys(user).length === 0 ? (
        <p>Loading user data...</p>
      ) : (
        <UserForm initialData={user} onSubmit={handleSubmit} isEditMode />
      )}{" "}
    </div>
  );
}
