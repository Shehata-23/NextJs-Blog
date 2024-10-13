'use client'

import { useState } from "react"
import { ToggleLeft, ToggleRight } from "lucide-react"
import  PasswordResetForm  from '@/components/Forms/ResetPasswordForm';
import RequestTokenForm from "@/components/Forms/requestTokenForm";

export default function PasswordResetPage() {
  const [showResetForm, setShowResetForm] = useState(false)
  const [email, setEmail] = useState("")

  const handleTokenRequested = (email: string) => {
    setEmail(email)
    setShowResetForm(true)
  }

  const handlePasswordReset = () => {
    setShowResetForm(false)
    setEmail("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Password Reset</h1>
        {showResetForm ? (
          <PasswordResetForm email={email} onPasswordReset={handlePasswordReset} />
        ) : (
          <RequestTokenForm onTokenRequested={handleTokenRequested} />
        )}
        <p className="mt-4 text-sm text-gray-600 text-center">
          {showResetForm ? (
            <button
              onClick={() => setShowResetForm(false)}
              className="text-purple-500 hover:text-purple-600 focus:outline-none"
            >
              <ToggleLeft className="inline mr-1" size={16} />
              Back to request token
            </button>
          ) : (
            <button
              onClick={() => setShowResetForm(true)}
              className="text-purple-500 hover:text-purple-600 focus:outline-none"
            >
              <ToggleRight className="inline mr-1" size={16} />
              Already have a token? Reset password
            </button>
          )}
        </p>
      </div>
    </div>
  )
}