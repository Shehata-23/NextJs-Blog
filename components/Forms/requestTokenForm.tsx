'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Mail } from "lucide-react"
import toast from "react-hot-toast"
import { requestTokenAction } from "@/app/actions/actions"

const requestTokenSchema = z.object({
  email: z.string().email("Invalid email address"),
})

type RequestTokenType = z.infer<typeof requestTokenSchema>

interface RequestTokenFormProps {
  onTokenRequested: (email: string) => void
}

export default function RequestTokenForm({ onTokenRequested }: RequestTokenFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestTokenType>({
    resolver: zodResolver(requestTokenSchema),
  })

  const onSubmit = async (data: RequestTokenType) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    try {
      const res = await requestTokenAction(formData);
      toast.success("Reset token sent to your email");
      onTokenRequested(data.email)

      return res;
    } catch (error) {
      toast.error("Failed to send reset token");
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
        />
      </div>
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message}</p>
      )}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-md hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
      >
        Request Reset Token
      </button>
    </form>
  )
}