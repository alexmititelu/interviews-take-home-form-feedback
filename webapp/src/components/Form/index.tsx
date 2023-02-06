import React from "react";
import {
  FormHelperText,
  FormControl,
  TextField,
  Grid,
  Typography,
  Rating,
} from "@mui/material";
import { FormConfig } from "./types";
import { useFormData } from "./useFormData";

// TODO: set types for context
export const FormContext = React.createContext<any>(null);

interface Props {
  accessibilityLabel?: string;
  children: React.ReactNode;
  onSubmit: <T>(formData: T) => void;
  config: FormConfig;
  title: string;
}

function Form({
  accessibilityLabel,
  onSubmit,
  children,
  config,
  title,
}: Props) {
  const {
    formData,
    formDataErrors: formErrors,
    setValue: setFormValue,
    validateForm,
    validateField,
  } = useFormData(config);

  // TODO: Define form inputs schema by name (with synthacthic and semantic validation) and generate the form
  // from there (dynamically)
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const hasErrors = validateForm();
    if (!hasErrors) onSubmit(formData);
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = e.target.value;
    const fieldName = e.target.name;
    setFormValue(fieldName, value);
  };

  const getFieldByName = (name: string, { props }: { props?: any } = {}) => {
    const { type, label } = config[name];

    switch (type) {
      case "text":
        return (
          <TextField
            label={label}
            name={name}
            value={formData[name]}
            onBlur={() => validateField(name)}
            error={!!formErrors[name]}
            helperText={formErrors[name] || " "}
            FormHelperTextProps={{
              "aria-label": formErrors[name],
            }}
            {...props}
          />
        );

      case "textarea":
        return (
          <TextField
            label={label}
            multiline
            name={name}
            rows={4}
            value={formData[name]}
            onBlur={() => validateField(name)}
            error={!!formErrors[name]}
            helperText={formErrors[name] || " "}
            FormHelperTextProps={{
              "aria-label": formErrors[name],
            }}
            {...props}
          />
        );

      case "rating":
        return (
          <FormControl>
            <Rating
              name={name}
              value={formData[name] ? parseInt(formData[name]) : 0}
              emptyLabelText={"Select rating from 1 to 5"}
              {...props}
            />
            <FormHelperText error aria-label={formErrors[name]}>
              {formErrors[name]}
            </FormHelperText>
          </FormControl>
        );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onChange={handleFieldChange}
      autoComplete="on"
      aria-label={accessibilityLabel}
      tab-index={0}
      onBlur={(e) => {
        const blurredField = e.target.name;
        if (blurredField) {
          validateField(blurredField);
        }
      }}
    >
      <FormContext.Provider value={{ getFieldByName }}>
        <Grid container>
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>

          {children}
        </Grid>
      </FormContext.Provider>
    </form>
  );
}

export default Form;
