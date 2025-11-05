import { ServiceProvider } from "@/context/service-context";
import ServicesContentPage from "@/components/services/services-content-page";

export default function ServicesPage() {
  return (
    <ServiceProvider>
      <ServicesContentPage />
    </ServiceProvider>
  );
}
