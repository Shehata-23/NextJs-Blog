import {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
// import { ZodObject } from 'zod';
// import { RegisterState } from '../actions/actions';

export interface FieldConfig<T extends FieldValues> {
  name: Path<T>;
  type: string;
  placeholder: string;
  className?: string;

  // schemas?: any;
  // action?: () => Promise<RegisterState>;
}

export interface GenericFormProps<T extends FieldValues> {
  register?: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  fields: FieldConfig<T>[];
}

export interface SignInValues {
  email: string;
  password: string;
}
