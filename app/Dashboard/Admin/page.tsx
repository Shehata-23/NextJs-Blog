import { apiService } from "@/app/lib/api/apiService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import AdminsUsersList from "@/components/adminDashBoard/AdminsUsersList";
// import UpdateUserForm from "@/components/ui/UpdateUserForm"
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !(session.user?.isAdmin === "admin")) {
    
    redirect("/Login")
  }

  const users = await apiService.getUsers(session.accessToken as string);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <AdminsUsersList users={users} token={session.accessToken as string} />
    </div>
  );
}
