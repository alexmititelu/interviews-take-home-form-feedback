import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import FeedbackForm from "..";
import { BrowserRouter } from "react-router-dom";
import { ReviewsAPI } from "../../../store/reviews";

const renderScreen = () => {
  render(
    <BrowserRouter>
      <FeedbackForm />
    </BrowserRouter>
  );
};

const getFormElement = () => {
  renderScreen();
  const form = screen.getByRole("form", {
    name: "Form for collecting user feedback",
  });
  return form;
};

describe("FeedbackForm", () => {
  describe("presentational", () => {
    test("renders form", () => {
      const form = getFormElement();
      expect(form).toBeInTheDocument();
    });

    test("renders title of the form", () => {
      const form = getFormElement();
      const title = within(form).getByRole("heading", {
        name: "Feedback Form",
      });
      expect(title).toBeInTheDocument();
    });

    test("renders name input inside form", () => {
      const form = getFormElement();
      const nameField = within(form).getByRole("textbox", {
        name: "Name",
      });
      expect(nameField).toBeInTheDocument();
    });

    test("renders email input inside form", () => {
      const form = getFormElement();
      const emailField = within(form).getByRole("textbox", {
        name: "Email Address",
      });
      expect(emailField).toBeInTheDocument();
    });

    test("renders comment input inside form", () => {
      const form = getFormElement();
      const commentField = within(form).getByRole("textbox", {
        name: "Comment",
      });
      expect(commentField).toBeInTheDocument();
    });

    test("renders rating radio input with appropriate name when no selection has been made", () => {
      const form = getFormElement();
      const ratingField = within(form).getByRole("radio", {
        name: "Select rating from 1 to 5",
      });
      expect(ratingField).toBeInTheDocument();
    });

    test("renders rating radio input inside form for all possible choices", () => {
      const form = getFormElement();
      const radioChoicesNames = [
        "1 Star, Bad",
        "2 Stars, Poor",
        "3 Stars, Average",
        "4 Stars, Good",
        "5 Stars, Excellent",
      ];

      radioChoicesNames.forEach((name) => {
        const ratingField = within(form).getByRole("radio", {
          name,
        });
        expect(ratingField).toBeInTheDocument();
      });
    });

    test("render submit button inside form", () => {
      const form = getFormElement();
      const submitButton = within(form).getByRole("button", { name: "Submit" });
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe("on submit", () => {
    test("trigger validation and display errors appropriately", async () => {
      const form = getFormElement();
      const submitButton = within(form).getByRole("button", { name: "Submit" });
      fireEvent.click(submitButton);

      const errorMessages = [
        "Please enter your name",
        "Invalid email",
        "Please choose a rating",
        "Minimum 10 characters",
      ];
      errorMessages.forEach((errorMsg) => {
        const errElement = within(form).getByText(errorMsg);
        expect(errElement).toBeInTheDocument();
      });
    });

    test("will construct the payload from the fields and store it", () => {
      const spyAdd = jest.spyOn(ReviewsAPI, "add");
      const form = getFormElement();
      const nameField = within(form).getByRole("textbox", {
        name: "Name",
      });
      fireEvent.change(nameField, { target: { value: "John Doe" } });

      const emailField = within(form).getByRole("textbox", {
        name: "Email Address",
      });
      fireEvent.change(emailField, { target: { value: "john@doe.com" } });
      const commentField = within(form).getByRole("textbox", {
        name: "Comment",
      });
      fireEvent.change(commentField, { target: { value: "Lorem ipsum." } });
      const ratingField = within(form).getByRole("radio", {
        name: "4 Stars, Good",
      });
      fireEvent.click(ratingField);

      const submitButton = within(form).getByRole("button", { name: "Submit" });
      fireEvent.click(submitButton);

      expect(spyAdd).toHaveBeenCalledWith({
        name: (nameField as HTMLInputElement).value,
        email_address: (emailField as HTMLInputElement).value,
        rating: parseInt((ratingField as HTMLInputElement).value),
        comment: (commentField as HTMLInputElement).value,
      });
    });

    test.todo("will redirect user to /results page");
  });

  describe("fields", () => {
    describe("email address", () => {
      test("introducing an invalid email will result in validation error", () => {
        const form = getFormElement();
        const emailField = within(form).getByRole("textbox", {
          name: "Email Address",
        });

        fireEvent.change(emailField, { target: { value: "john" } });
        fireEvent.blur(emailField);

        const errElement = within(form).getByText("Invalid email");
        expect(errElement).toBeInTheDocument();
      });

      test("when input has an invalid value, message will dissapear when changing its value", () => {
        const form = getFormElement();
        const emailField = within(form).getByRole("textbox", {
          name: "Email Address",
        });

        fireEvent.change(emailField, { target: { value: "john" } });
        fireEvent.blur(emailField);

        const errElement = within(form).getByText("Invalid email");
        expect(errElement).toBeInTheDocument();

        fireEvent.change(emailField, { target: { value: "john@" } });
        const errElementAfterChange = within(form).queryByText("Invalid email");
        expect(errElementAfterChange).not.toBeInTheDocument();
      });
    });

    // describe("name", () => {});
    // describe("rating", () => {});
    // describe("comment", () => {});
  });
});
