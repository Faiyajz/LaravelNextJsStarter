import { PublicLayout } from "@/modules/shared";
import IntroSection from "./sections/IntroSection";
import PrinciplesSection from "./sections/PrinciplesSection";
import DetailsSection from "./sections/DetailsSection";

export default function PolicyPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-5xl px-6 py-16 space-y-12">
        <IntroSection />
        <PrinciplesSection />
        <DetailsSection />
      </div>
    </PublicLayout>
  );
}
