export interface FormConfig {
  [key: string]: FormInput;
}

export interface FormInput {
  type: "text" | "textarea" | "rating";
  label: string;
  validateFn: (value: any) => string | undefined;
}
