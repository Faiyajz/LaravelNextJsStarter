import { PublicLayout } from "@/modules/shared";
import HeroSection from "./sections/HeroSection";
import StorySection from "./sections/StorySection";
import ValuesSection from "./sections/ValuesSection";

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-5xl px-6 py-16 space-y-12">
        <HeroSection />
        <StorySection />
        <ValuesSection />
      </div>
    </PublicLayout>
  );
}
