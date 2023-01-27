import React from "react";
import { render, screen, within } from "@testing-library/react";
import FeedbackResults from "..";
import { BrowserRouter } from "react-router-dom";
import { ReviewsAPI, Review } from "../../../store/reviews";

/**
 * window resize constructor is not defined in the testing environment and requires additional mocking
 * See https://github.com/maslianok/react-resize-detector/issues/145 for reference
 */

// TODO: Mock the window ResizeObserver at lower level so JEST is able to pick it up without additional mocking
const { ResizeObserver } = window;

beforeEach(() => {
  //@ts-ignore
  delete window.ResizeObserver;
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

afterEach(() => {
  window.ResizeObserver = ResizeObserver;
  jest.restoreAllMocks();
});

/**
 * END OF RESIZE CONSTRUCTOR MOCKING HELPER
 */

const renderScreen = (reviews: Array<Review>) => {
  const spyGet = jest.spyOn(ReviewsAPI, "getAll");
  spyGet.mockReturnValue(reviews);
  render(
    <BrowserRouter>
      <FeedbackResults />
    </BrowserRouter>
  );
};

const renderScreenWithReviews = () => {
  const review1 = {
    name: "John",
    comment: "Lorem ipsum sin dolor",
    rating: 4,
    email_address: "john@doe.com",
  };
  const review2 = {
    name: "Jane",
    comment: "Ipsum lorem dolor sin",
    rating: 5,
    email_address: "jane@doe.com",
  };
  renderScreen([review1, review2]);
};

const renderScreenNoReviews = () => {
  const reviews: Array<Review> = [];
  renderScreen(reviews);
};

describe("FeedbackResults", () => {
  describe("when no reviews are available", () => {
    test("renders heading for the page appropriately", () => {
      renderScreenNoReviews();
      const heading = screen.getByRole("heading", { name: "Feedback Results" });
      expect(heading).toBeInTheDocument();
    });

    test("doesn't render rating distribution", () => {
      renderScreenNoReviews();
      const distribution = screen.queryByText(/PieChart representation/g);
      expect(distribution).not.toBeInTheDocument();
    });

    test("renders timeline with empty state", () => {
      renderScreenNoReviews();
      const timeline = screen.getByRole("region", {
        name: "Timeline 0 reviews",
      });
      expect(timeline).toBeInTheDocument();

      const emptyState = within(timeline).getByText(
        "No reviews so far. Please come back later!"
      );
      expect(emptyState).toBeInTheDocument();
    });
  });

  describe("when reviews are available", () => {
    test("renders heading for the page appropriately", () => {
      renderScreenWithReviews();
      const heading = screen.getByRole("heading", { name: "Feedback Results" });
      expect(heading).toBeInTheDocument();
    });

    test("renders rating distribution", () => {
      renderScreenWithReviews();
      const distribution = screen.queryByRole("region", {
        name: "PieChart representation of 2 reviews",
      });
      expect(distribution).toBeInTheDocument();
    });

    test("renders timeline with reviews", () => {
      renderScreenWithReviews();
      const timeline = screen.getByRole("region", {
        name: "Timeline 2 reviews",
      });

      expect(timeline).toBeInTheDocument();
      const emptyState = within(timeline).queryByText(
        "No reviews so far. Please come back later!"
      );

      expect(emptyState).not.toBeInTheDocument();

      const reviews = within(timeline).getAllByRole("article");
      expect(reviews.length).toEqual(2);

      const johnReview = within(timeline).getByRole("article", {
        name: 'Review from John "Lorem ipsum sin dolor"',
      });
      expect(johnReview).toBeInTheDocument();

      const janeReview = within(timeline).getByRole("article", {
        name: 'Review from Jane "Ipsum lorem dolor sin"',
      });
      expect(janeReview).toBeInTheDocument();
    });
  });

  test.todo("tabbing navigation");
});
