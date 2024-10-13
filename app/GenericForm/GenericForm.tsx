"use client";

import { RegisterState } from "@/app/actions/actions";
import { GenericFormFields } from "./GenericFormFields";
import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldConfig } from "../lib/sharedTypes";
import { ZodSchema } from "zod";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation'

export interface GenericFormPropsTypes<T extends FieldValues> {
  
  fields: FieldConfig<T>[];
  formActions: (
    prevState: RegisterState,
    formData: FormData
  ) => Promise<RegisterState>;
  validationSchema: ZodSchema<T>;
}

export function GenericForm<T extends FieldValues>({
  fields,
  formActions,
  validationSchema,
}: GenericFormPropsTypes<T>) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    resolver: zodResolver(validationSchema),
    mode: "onBlur",
  });
  const onSubmit = async (data: T) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    try {
      const result = await formActions(
        { error: null, message: undefined },
        formData
      );
      if (result.error) {
        // Parse the error message
        let errorMessage = "An error occurred. Please try again.";
        try {
          const parsedError = JSON.parse(result.error);
          if (parsedError.message) {
            errorMessage = parsedError.message;
          }
        } catch (e) {
          // If parsing fails, use the original error message
          errorMessage = result.error;
          console.log(e)
        }

        // Check for specific error messages
        if (errorMessage.includes("user already exists")) {
          errorMessage = "This user already exists. Please try a different email.";
        }

        toast.error(errorMessage);
      } else {
        toast.success(result.message || 'Form submitted successfully');
        router.push("/Login")
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
      <GenericFormFields register={register} errors={errors} fields={fields} />
      <div className="flex flex-col items-center">
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </form>
  );
}