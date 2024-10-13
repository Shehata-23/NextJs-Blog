import { type ClassValue, clsx } from "clsx";
// import { cookies } from "next/headers";
import { twMerge } from "tailwind-merge";
// import { UseFormRegister, FieldErrors, FieldValues, FieldPathValues } from 'react-hook-form';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SubmitResult {
  error: string | null;
  message?: string;
}

type SubmitAction = (
  prevState: SubmitResult,
  formData: FormData
) => Promise<SubmitResult>;

export const handleSubmitGeneric = async (
  formValues: Record<string, string>,
  submitAction: SubmitAction,
  setError: (error: string | null) => void
) => {
  console.log("worked");

  setError(null);

  const formData = new FormData();
  Object.entries(formValues).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const result = await submitAction({ error: null }, formData);
  if (result.error) {
    setError(result.error);
    console.log(result.error);
  } else {
    console.log(result.message);
  }
};

// export const cookieStore = cookies();
