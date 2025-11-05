import { UserProvider } from "@/context/user-context";
import UsersContentPage from "@/components/users/users-content-page";

export default function UsersPage() {
  return (
    <UserProvider>
      <UsersContentPage />
    </UserProvider>
  );
}
