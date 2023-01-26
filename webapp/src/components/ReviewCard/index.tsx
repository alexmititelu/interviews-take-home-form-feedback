import React from "react";
import { Box, Typography } from "@mui/material";

interface Props {
  header: string;
  description: string;
}

function ReviewCard({ header, description }: Props) {
  return (
    <Box>
      {/* TODO: Use theming */}

      <Typography
        variant="h6"
        sx={{ color: "#37474f", overflowWrap: "break-word" }}
      >
        {header}
      </Typography>

      <Typography paragraph sx={{ overflowWrap: "break-word" }}>
        {description}
      </Typography>
    </Box>
  );
}

export default ReviewCard;
