import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = {
  title: "Admin — Warszawski",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <LoginForm />
    </main>
  );
}
