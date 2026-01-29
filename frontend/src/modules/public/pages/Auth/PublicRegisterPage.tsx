import { PublicLayout } from "@/modules/shared";
import RegisterIntroSection from "./sections/RegisterIntroSection";
import RegisterOptionsSection from "./sections/RegisterOptionsSection";
import RegisterFAQSection from "./sections/RegisterFAQSection";

export default function PublicRegisterPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-4xl px-6 py-16 space-y-10">
        <RegisterIntroSection />
        <RegisterOptionsSection />
        <RegisterFAQSection />
      </div>
    </PublicLayout>
  );
}
