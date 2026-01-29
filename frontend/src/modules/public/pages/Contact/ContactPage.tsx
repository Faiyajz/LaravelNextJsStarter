import { PublicLayout } from "@/modules/shared";
import InfoSection from "./sections/InfoSection";
import FormSection from "./sections/FormSection";
import LocationsSection from "./sections/LocationsSection";

export default function ContactPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-5xl px-6 py-16 space-y-12">
        <InfoSection />
        <FormSection />
        <LocationsSection />
      </div>
    </PublicLayout>
  );
}
