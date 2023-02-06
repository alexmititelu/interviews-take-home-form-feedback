import React from "react";
import { Button, Container, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Review, ReviewsAPI } from "./../../store/reviews";
import Form, { FormContext } from "./../../components/Form";
import validator from "validator";

interface FeedbackFormData {
  name: string;
  email_address: string;
  rating: string;
  comment: string;
}

export const labels: { [index: string]: string } = {
  1: "Bad",
  2: "Poor",
  3: "Average",
  4: "Good",
  5: "Excellent",
};

const getLabelText = (value: number) => {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
};

type FormReview = Pick<Review, "name" | "comment" | "email_address" | "rating">;

function FeedbackForm() {
  const navigate = useNavigate();

  const handleSubmit = ({
    name,
    email_address,
    comment,
    rating,
  }: FeedbackFormData) => {
    const review: FormReview = {
      name,
      email_address,
      comment,
      rating: parseInt(rating) || 0,
    };
    ReviewsAPI.add(review);
    navigate("/results");
  };

  const formConfig = React.useMemo(
    (): React.ComponentProps<typeof Form>["config"] => ({
      name: {
        label: "Name",
        type: "text",
        validateFn: (value: string) => {
          // when value's length is in range, returns true
          const isValueValid = validator.isLength(value, {
            min: 3,
            max: 256,
          });
          return isValueValid ? undefined : "Please enter your name";
        },
      },
      email_address: {
        label: "Email Address",
        type: "text",
        validateFn: (value: string) => {
          const isValueValid = validator.isEmail(value);
          return isValueValid ? undefined : "Invalid email";
        },
      },
      comment: {
        label: "Comment",
        type: "textarea",
        validateFn: (value: string) => {
          // when value's length is >=10 then validator fn returns true
          const isValueValid = validator.isLength(value, { min: 10 });
          return isValueValid ? undefined : "Minimum 10 characters";
        },
      },
      rating: {
        label: "Rating",
        type: "rating",
        validateFn: (value: string) => {
          const possibleValues = ["1", "2", "3", "4", "5"];
          if (!possibleValues.includes(value)) return "Please choose a rating";
        },
      },
    }),
    []
  );

  return (
    <Container
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
      maxWidth="md"
      aria-label="User Feedback collection page"
    >
      <Form
        accessibilityLabel="Form for collecting user feedback"
        config={formConfig}
        // @ts-ignore explore generics solution
        onSubmit={handleSubmit}
        title="Feedback Form"
      >
        <FormContext.Consumer>
          {({ getFieldByName }) => (
            <>
              <Grid container item>
                <Grid item xs={5.5}>
                  <Grid container direction="column" rowGap={2}>
                    <Grid item xs={5.5}>
                      {getFieldByName("name", {
                        props: {
                          fullWidth: true,
                          size: "small",
                        },
                      })}
                    </Grid>

                    <Grid item xs={5.5}>
                      {getFieldByName("email_address", {
                        props: {
                          fullWidth: true,
                          size: "small",
                        },
                      })}
                    </Grid>

                    <Grid item xs={5.5}>
                      {getFieldByName("rating", {
                        props: {
                          getLabelText,
                          size: "large",
                        },
                      })}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={1} />

                <Grid item xs={5.5}>
                  <Grid container direction="column">
                    <Grid item>
                      {getFieldByName("comment", {
                        props: {
                          fullWidth: true,
                          rows: 7,
                        },
                      })}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid container item direction="row" justifyContent="flex-end">
                <Grid item>
                  <Button variant="contained" type="submit">
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </FormContext.Consumer>
      </Form>
    </Container>
  );
}

export default FeedbackForm;
