import React from "react";
import { FormConfig } from "./types";

interface FormData {
  [key: string]: any;
}
interface FormDataErrors {
  [key: string]: any;
}

const getInitialData = (config: FormConfig) => {
  const initialData: FormData = {};
  Object.keys(config).forEach((key) => (initialData[key] = ""));
  return initialData;
};

const getInitialErrors = (config: FormConfig) => {
  const initialErrors: FormData = {};
  Object.keys(config).forEach((key) => (initialErrors[key] = ""));
  return initialErrors;
};

export const useFormData = (config: FormConfig) => {
  const [formData, setFormData] = React.useState<FormData>(
    getInitialData(config)
  );
  const [formDataErrors, setFormDataErrors] = React.useState<FormDataErrors>(
    getInitialErrors(config)
  );

  const setError = (name: keyof FormData, error: string) => {
    setFormDataErrors({ ...formDataErrors, [name]: error });
  };

  const clearError = (name: keyof FormData) => {
    setFormDataErrors({ ...formDataErrors, [name]: "" });
  };

  const setValue = (name: keyof FormData, value: string) => {
    setFormData({ ...formData, [name]: value });
    clearError(name);
  };

  const validateField = (name: string): void => {
    const { validateFn } = config[name];
    const error = validateFn(formData[name]) || "";
    setError(name, error);
  };

  // TODO: better naming to reflect what it does
  const validateForm = (): boolean => {
    const errors: FormDataErrors = {};
    let foundError = false;
    Object.keys(config).forEach((key) => {
      const { validateFn } = config[key];
      const error = validateFn(formData[key]) || "";

      if (error) foundError = true;
      errors[key] = error;

      setFormDataErrors(errors);
    });

    return foundError;
  };

  return {
    formData,
    formDataErrors,
    setValue,
    clearError,
    validateForm,
    validateField,
  };
};
