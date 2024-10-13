import React from "react";
import { FieldValues, UseFormRegister, FieldErrors } from "react-hook-form";
import { FieldConfig } from "../lib/sharedTypes";
import "@uploadcare/react-uploader/core.css";

export interface GenericFormProps<T extends FieldValues> {
  register?: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  fields: FieldConfig<T>[];
}

export function GenericFormFields<T extends FieldValues>({
  register,
  errors,
  fields,
}: GenericFormProps<T>) {
  console.log(fields);
  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="relative">
          <input
            type={field.type}
            {...(register ? register(field.name) : {})}
            className={`
              block w-full px-4 py-3 rounded-md border-2 bg-white text-gray-900 
              placeholder-gray-500 transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
              ${
                errors && errors[field.name]
                  ? "border-red-500"
                  : "border-gray-300"
              }
              ${field.className || ""}
            `}
            placeholder={field.placeholder}
          />
          {errors && errors[field.name] && (
            <p className="  text-red-500 text-xs mt-1">
              {String(errors[field.name]?.message)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
