import React from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { ReviewsAPI, type Review } from "../../store/reviews";
import ReviewCard from "../../components/ReviewCard";
import LineBreak from "../../components/LineBreak";
import { labels as ratingLabels } from "../FeedbackForm";
import PieChart from "../../components/PieChart";
import { getDateRelative } from "../../utils/date-and-time";

// TODO: Explore type safety
// TODO: use theming
const COLOR_BY_LABEL = {
  [ratingLabels[1]]: "#B60303",
  [ratingLabels[2]]: "#DC6D23",
  [ratingLabels[3]]: "#FCC604",
  [ratingLabels[4]]: "#7BD65C",
  [ratingLabels[5]]: "#005F21",
};

function FeedbackResults() {
  const [reviews, setReviews] = React.useState<Array<Review>>([]);

  const getFormattedData = () => {
    const ratings = reviews.map((review) => review.rating);
    const labels = ratings.map((rating) => ratingLabels[rating]);

    const labelCount: { [key: string]: number } = {};
    labels.forEach((label) => {
      if (labelCount[label]) labelCount[label] = labelCount[label] + 1;
      else labelCount[label] = 1;
    });

    const formattedData: Array<{ name: string; value: number }> = [];
    Object.keys(labelCount).forEach((label) =>
      formattedData.push({
        name: label,
        value: labelCount[label],
      })
    );

    return formattedData;
  };

  React.useEffect(() => {
    const fetchLatestReviews = () => {
      const reviewsFromStore = ReviewsAPI.getAll();

      reviewsFromStore.sort((a, b) => {
        const aDate = new Date(a.created_at).getTime();
        const bDate = new Date(b.created_at).getTime();

        return bDate - aDate;
      });

      return reviewsFromStore;
    };

    const latestReviews = fetchLatestReviews();

    setReviews(latestReviews);
  }, []);

  return (
    <Container maxWidth="md" tabIndex={0} aria-label="Feedback results page">
      <Box
        sx={{
          marginTop: "5em",
          marginBottom: "3em",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5">Feedback Results</Typography>

        <Button variant="contained" href="/feedback">
          Go back
        </Button>
      </Box>

      <Box sx={{ height: "100vh" }}>
        <Box sx={{ display: "flex", flexDirection: "column", rowGap: 2 }}>
          {reviews.length > 0 ? (
            <Box
              role="region"
              aria-label={
                reviews.length
                  ? `PieChart representation of ${reviews.length} reviews`
                  : undefined
              }
              tabIndex={0}
            >
              {/* TODO: Reorder data for pie and for labels by rating (Poor, Bad, Average, Good, Excellent) */}
              <PieChart
                data={getFormattedData()}
                colorMapping={COLOR_BY_LABEL}
                label={`${reviews.length} reviews`}
                headline="Total Rating Distribution"
                withLegend
                withTooltip
              />
            </Box>
          ) : null}

          {/* TODO: Extract separate Timeline component  */}
          <Box
            aria-label={`Timeline ${reviews.length} reviews`}
            role="region"
            tabIndex={0}
            sx={{ display: "flex", flexDirection: "column", rowGap: 2 }}
          >
            <Box>
              <Typography variant="h5">Latest Comments</Typography>
            </Box>
            {/* TODO: Introduce pagination / load more reviews  */}
            {reviews.length > 0 ? (
              reviews.map((review, idx) => (
                <Box
                  key={`${idx}_${review.email_address}`}
                  role="article"
                  tabIndex={0}
                  aria-label={`Review from ${review.name} "${review.comment}"`}
                  sx={{ display: "flex", flexDirection: "column", rowGap: 2 }}
                >
                  <ReviewCard
                    title={review.name}
                    subtitle={getDateRelative(review.created_at)}
                    description={review.comment}
                  />
                  {idx !== reviews.length - 1 && <LineBreak size="small" />}
                </Box>
              ))
            ) : (
              <Typography variant="h6">
                No reviews so far. Please come back later!
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default FeedbackResults;
