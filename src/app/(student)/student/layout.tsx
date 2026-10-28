import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import StudentSidebar from "@/components/student/StudentSidebar";
import UniversalFooter from "@/components/shared/UniversalFooter";

export const dynamic = "force-dynamic";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.role !== "student") {
    redirect("/student-login");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row">
      <StudentSidebar userName={session.name} userEmail={session.email} />
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <UniversalFooter />
      </div>
    </div>
  );
}
