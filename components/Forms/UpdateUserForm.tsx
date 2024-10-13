"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ImgUploader from "@/components/Forms/ImgUploader";
import { updateUser, updataUserData } from "@/app/zodSchemas/zodSchemas";
import { updateUserAction } from "@/app/actions/actions";
import { Session } from "next-auth";

interface updateUserProps {
  id: string;
  token: string;
  userData: Session;
}

export default function UpdateUserForm({
  id,
  token,
  userData,
}: updateUserProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<updataUserData>({
    resolver: zodResolver(updateUser),
    defaultValues: {
      username: `${userData.user.name}`,
      email: `${userData.user.email}`,
      password: "",
      coverPhoto: "",
    },
  });

  const onSubmit = async (data: updataUserData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    try {
      const res = await updateUserAction(id, formData, token);
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            {...register("username")}
            type="text"
            id="username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.username && (
            <p className="text-sm text-red-600">{errors.username.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            {...register("password")}
            type="password"
            id="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            {...register("confirmPassword")}
            type="password"
            id="confirmPassword"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Profile Picture
          </label>
          <Controller
            name="coverPhoto"
            control={control}
            render={({ field }) => (
              <ImgUploader
                formData={{ coverPhoto: field.value as string }}
                setFormData={(data) => field.onChange(data.coverPhoto)}
              />
            )}
          />
          {errors.coverPhoto && (
            <p className="text-sm text-red-600">{errors.coverPhoto.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold py-2 px-4 rounded-full hover:from-blue-600 hover:to-purple-500 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
