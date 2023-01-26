import React from "react";
import {
  FormHelperText,
  FormControl,
  TextField,
  Grid,
  Typography,
  Rating,
  Button,
  Container,
} from "@mui/material";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import { ReviewsAPI } from "./../../store/reviews";

export const labels: { [index: string]: string } = {
  1: "Bad",
  2: "Poor",
  3: "Average",
  4: "Good",
  5: "Excellent",
};

interface FormData {
  name: string;
  email_address: string;
  rating: string;
  comment: string;
}

interface FormDataErrors {
  name?: string;
  email_address?: string;
  rating?: string;
  comment?: string;
}

function FeedbackForm() {
  const [formData, setFormData] = React.useState<Partial<FormData>>({});
  const [formErrors, setFormErrors] = React.useState<FormDataErrors>({});
  const [nameError, setNameError] = React.useState<string>();
  const [emailError, setEmailError] = React.useState<string>();
  const [commentError, setCommentError] = React.useState<string>();
  const [ratingError, setRatingError] = React.useState<string>();

  const navigate = useNavigate();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const nameErr = validateNameField();
    const emailErr = validateEmailField();
    const commentErr = validateCommentField();
    const ratingErr = validateRatingField();

    const hasErrors = !!(nameErr || emailErr || commentErr || ratingErr);

    if (!hasErrors) {
      // This is just for type safety -- TODO: find better alternative
      const review = {
        name: formData.name || "",
        comment: formData.comment || "",
        email_address: formData.email_address || "",
        rating: formData.rating ? parseInt(formData.rating) : 0,
      };
      ReviewsAPI.add(review);
      navigate("/results");
    }
  };

  const getLabelText = (value: number) => {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = e.target.value;
    const fieldName = e.target.name;
    setFormData({
      ...formData,
      [fieldName]: value,
    });
    setFormErrors({
      ...formErrors,
      [fieldName]: undefined,
    });
  };

  const handleFieldValidation = (
    fieldName: any,
    {
      errorMessage,
      validatorFn,
      validatorOptions,
    }: { validatorFn: any; validatorOptions?: any; errorMessage: string }
  ) => {
    // @ts-ignore
    return validatorFn(formData[fieldName] || " ", validatorOptions)
      ? undefined
      : errorMessage;
  };

  const validateNameField = () => {
    const err = handleFieldValidation("name", {
      validatorFn: validator.isLength,
      validatorOptions: { min: 3, max: 256 },
      errorMessage: "Please enter your name",
    });

    setNameError(err);
    return err;
  };

  const validateEmailField = () => {
    const err = handleFieldValidation("email_address", {
      validatorFn: validator.isEmail,
      errorMessage: "Invalid email",
    });
    setEmailError(err);
    return err;
  };

  const validateCommentField = () => {
    const err = handleFieldValidation("comment", {
      validatorFn: validator.isLength,
      validatorOptions: { min: 10 },
      errorMessage: "Minimum 10 characters",
    });
    setCommentError(err);
    return err;
  };

  const validateRatingField = () => {
    const possibleValues = ["1", "2", "3", "4", "5"];
    let err;
    if (!formData.rating || !possibleValues.includes(formData.rating))
      err = "Please choose a rating";
    setRatingError(err);
    return err;
  };

  return (
    <Container
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
      maxWidth="md"
    >
      <form
        onSubmit={handleSubmit}
        onChange={handleFieldChange}
        autoComplete="on"
      >
        <Grid container>
          <Typography variant="h5" gutterBottom>
            Feedback Form
          </Typography>

          <Grid container item>
            <Grid item xs={5.5}>
              <Grid container direction="column" rowGap={2}>
                <Grid item xs={5.5}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name || ""}
                    onBlur={() => validateNameField()}
                    size="small"
                    error={!!nameError}
                    helperText={nameError || " "}
                  />
                </Grid>

                <Grid item xs={5.5}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email_address"
                    value={formData.email_address || ""}
                    onBlur={() => validateEmailField()}
                    size="small"
                    error={!!emailError}
                    helperText={emailError || " "}
                  />
                </Grid>

                <Grid item xs={5.5}>
                  <FormControl>
                    <Rating
                      name="rating"
                      getLabelText={getLabelText}
                      value={formData.rating ? parseInt(formData.rating) : 0}
                      size="large"
                      emptyLabelText={"Select rating from 1 to 5"}
                    />
                    <FormHelperText error>{ratingError || ""}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={1} />

            <Grid item xs={5.5}>
              <Grid container direction="column">
                <Grid item>
                  <TextField
                    fullWidth
                    label="Comment"
                    multiline
                    name="comment"
                    rows={7}
                    value={formData.comment || ""}
                    onBlur={() => validateCommentField()}
                    error={!!commentError}
                    helperText={commentError || " "}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container direction="row" justifyContent="flex-end">
            <Grid item>
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default FeedbackForm;
