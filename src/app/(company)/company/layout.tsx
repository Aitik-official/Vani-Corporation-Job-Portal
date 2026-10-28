import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Company } from "@/models/Company";
import CompanySidebar from "@/components/company/CompanySidebar";
import UniversalFooter from "@/components/shared/UniversalFooter";

export const dynamic = "force-dynamic";

export default async function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.role !== "company") {
    redirect("/company-login");
  }

  await connectToDatabase();
  const company = await Company.findOne({ userId: session.userId });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row">
      <CompanySidebar
        companyName={company?.companyName || session.name}
        verificationStatus={company?.verificationStatus || "pending"}
      />
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <UniversalFooter />
      </div>
    </div>
  );
}
