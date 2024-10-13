import React from "react";
import UpdateUserForm from "@/components/Forms/UpdateUserForm";
// import { apiService } from "@/app/lib/api/apiService";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/authOptions";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/Login");
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Account Settings
          </h1>
          <UpdateUserForm
            id={session.user.id}
            token={session.accessToken as string}
            userData={session}
          />
        </div>
      </div>
    </div>
  );
}
