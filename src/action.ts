"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getAllData = async (path: string) => {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${process.env.BASE_URL}/${path}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    if (!response.ok) {
      throw `Fetch failed: ${response.status} ${response.statusText}`;
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

export const getDataById = async (id: string, path: string) => {
  try {
    const cookieStore = await cookies();

    const response = await fetch(`${process.env.BASE_URL}/${path}/${id}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    if (!response.ok) {
      throw `Fetch failed: ${response.status} ${response.statusText}`;
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

export const deleteDataById = async (id: string, path: string) => {
  try {
    const response = await fetch(`${process.env.BASE_URL}/${path}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw `Fetch failed: ${response.status} ${response.statusText}`;
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

export const updateDataById = async (input: any, path: string) => {
  try {
    const response = await fetch(`${process.env.BASE_URL}/${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw `Fetch failed: ${response.status} ${response.statusText}`;
    }

    let data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateStatusTicket = async (input: any, path: string) => {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${process.env.BASE_URL}/${path}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(input),
    });

    let data = await response.json();
    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const setCookies = async (data: any) => {
  (await cookies()).set("access_token", data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });
};

export const logout = async () => {
  const cookieStore = await cookies();

  // Hapus semua cookie yang ada
  for (const cookie of cookieStore.getAll()) {
    cookieStore.delete(cookie.name);
  }

  redirect("/login");
};
