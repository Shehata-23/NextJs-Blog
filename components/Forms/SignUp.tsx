"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GenericForm } from "@/app/GenericForm/GenericForm";
import { FieldConfig } from "@/app/lib/sharedTypes";
import { SignUpInput } from "@/app/zodSchemas/zodSchemas";
import { signUp } from "@/app/actions/actions";
import { signUpSchema } from "@/app/zodSchemas/zodSchemas";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const signupFields: FieldConfig<SignUpInput>[] = [
  { name: "username", type: "text", placeholder: "Username" },
  { name: "email", type: "email", placeholder: "Email address" },
  { name: "password", type: "password", placeholder: "Password" },
  {
    name: "confirmPassword",
    type: "password",
    placeholder: "Confirm Password",
  },
];

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = (field: string) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const enhancedSignupFields = signupFields.map((field) => {
    if (field.type === "password") {
      return {
        ...field,
        type:
          field.name === "password"
            ? showPassword
              ? "text"
              : "password"
            : showConfirmPassword
            ? "text"
            : "password",
        icon: (
          <button
            type="button"
            onClick={() => togglePasswordVisibility(field.name)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {(field.name === "password" && showPassword) ||
            (field.name === "confirmPassword" && showConfirmPassword) ? (
              <EyeOffIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        ),
      };
    }
    return field;
  });

  return (
    <>
      <GenericForm
        fields={enhancedSignupFields}
        formActions={signUp}
        validationSchema={signUpSchema}
      />
      <div className="text-center">
        <p className="text-sm text-gray-600">Already have an account? </p>
        <span
          onClick={() => router.push("/Login")}
          className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-300 ease-in-out cursor-pointer"
        >
          Sign in
        </span>
      </div>
    </>
  );
}
