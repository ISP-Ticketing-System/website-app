import { CustomerProvider } from "@/context/customer-context";
import CustomersContentPage from "@/components/customers/customers-content-page";

export default function CustomersPage() {
  return (
    <CustomerProvider>
      <CustomersContentPage />
    </CustomerProvider>
  );
}
