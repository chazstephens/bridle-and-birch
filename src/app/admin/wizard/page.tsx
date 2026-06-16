import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import WizardForm from "./wizard-form";

export default async function ProductWizardPage() {
  // 1. Authorize Admin
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    redirect("/account");
  }

  // 2. Fetch Categories
  const categories = await prisma.category.findMany();

  return (
    <div className="container-width" style={{ padding: "40px 24px" }}>
      <WizardForm categories={categories} />
    </div>
  );
}
