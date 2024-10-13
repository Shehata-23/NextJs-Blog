'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, Lock, Key } from "lucide-react"
import toast from "react-hot-toast"
import { resetPaswordSchema, resetPaswordType } from "@/app/zodSchemas/zodSchemas"
import { resetPasswordAction } from "@/app/actions/actions"
import {useRouter} from "next/navigation"

interface PasswordResetFormProps {
    email: string
    onPasswordReset: () => void
  }


export default function PasswordResetForm({ email, onPasswordReset }: PasswordResetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<resetPaswordType>({
    resolver: zodResolver(resetPaswordSchema),
    defaultValues: { email }
  })
  const router = useRouter()
  const onSubmit = async (data: resetPaswordType) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    try {
      const res = await resetPasswordAction(formData);
      toast.success("Password reset successfully");
      onPasswordReset()
      router.push("/Login")
      return res;
    } catch (error) {
      toast.error("Failed to reset password");
      throw error;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="relative">
        <Mail className="absolute top-3 left-3 text-gray-400" size={20} />
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          className="w-full pl-10 pr-3 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          readOnly
        />
      </div>
      <div className="relative">
        <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
        <input
          {...register("newPassword")}
          type="password"
          placeholder="New Password"
          className="w-full pl-10 pr-3 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      {errors.newPassword && (
        <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
      )}
      <div className="relative">
        <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
        <input
          {...register("confirmNewPassword")}
          type="password"
          placeholder="Confirm New Password"
          className="w-full pl-10 pr-3 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      {errors.confirmNewPassword && (
        <p className="text-red-500 text-sm">{errors.confirmNewPassword.message}</p>
      )}
      <div className="relative">
        <Key className="absolute top-3 left-3 text-gray-400" size={20} />
        <input
          {...register("token")}
          type="text"
          placeholder="Reset Token"
          className="w-full pl-10 pr-3 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      {errors.token && (
        <p className="text-red-500 text-sm">{errors.token.message}</p>
      )}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-md hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
      >
        Reset Password
      </button>
    </form>
  )
}