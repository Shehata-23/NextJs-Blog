import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "./lib/authOptions";
import { AlertCircle, Home } from "lucide-react";

export default async function NotFound() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Not Found</h2>
        <p className="text-gray-600 mb-6">Could not find requested resource</p>
        
        <Link 
          href={session ? "/Dashboard/Home" : "/LandingPage"}
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          <Home className="w-5 h-5 mr-2" />
          {session ? "Profile" : "Home"}
        </Link>
      </div>
    </div>
  );
}