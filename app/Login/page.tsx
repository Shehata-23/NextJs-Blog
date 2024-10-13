

import LoginForm from "@/components/Forms/LoginForm"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { redirect } from 'next/navigation';
import Link from "next/link";

export default async function CoolLogin() {
  const session = await getServerSession(authOptions)

  if(session){
    redirect("Dashboard/Home")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl transform transition-all hover:scale-105">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome Back!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
        <LoginForm />
        <div className="text-center">
          <Link href="/ResetPassword" className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-300 ease-in-out">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  )
}