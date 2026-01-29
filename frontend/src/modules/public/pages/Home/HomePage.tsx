import { PublicLayout } from "@/modules/shared";
import HeroSection from "./sections/HeroSection";
import RolesSection from "./sections/RolesSection";

export default function PublicHomePage() {
  return (
    <PublicLayout>
      <div className="bg-gradient-to-br from-slate-50 via-white to-amber-50">
        <div className="mx-auto max-w-5xl px-6 py-16 space-y-12">
          <HeroSection />
          <RolesSection />
        </div>
      </div>
    </PublicLayout>
  );
}
