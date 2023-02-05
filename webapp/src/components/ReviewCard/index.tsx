import React from "react";
import { Box, Typography } from "@mui/material";

interface Props {
  title: string;
  subtitle?: string;
  description: string;
}

function ReviewCard({ title, subtitle, description }: Props) {
  return (
    <Box>
      {/* TODO: Use theming */}
      <Typography
        variant="h6"
        sx={{ color: "#757575", overflowWrap: "break-word" }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          variant="subtitle1"
          sx={{ color: "#90a4ae", overflowWrap: "break-word" }}
        >
          {subtitle}
        </Typography>
      )}

      <Typography component="pre">{description}</Typography>
    </Box>
  );
}

export default ReviewCard;
