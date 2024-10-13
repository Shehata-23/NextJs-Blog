import { SignupForm } from "@/components/Forms/SignUp";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const session = await getServerSession(authOptions);

  if (session?.accessToken) {
    redirect("Dashboard/Home");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join us and start your journey
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
