import { PublicLayout } from "@/modules/shared";
import LoginIntroSection from "./sections/LoginIntroSection";
import LoginOptionsSection from "./sections/LoginOptionsSection";
import LoginHelpSection from "./sections/LoginHelpSection";

export default function PublicLoginPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-4xl px-6 py-16 space-y-10">
        <LoginIntroSection />
        <LoginOptionsSection />
        <LoginHelpSection />
      </div>
    </PublicLayout>
  );
}
