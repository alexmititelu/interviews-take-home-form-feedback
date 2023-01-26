import { Box } from "@mui/material";

interface Props {
  size?: "small" | "medium" | "large";
}

function LineBreak({ size }: Props) {
  const getWidthPercentage = () => {
    switch (size) {
      case "small":
        return "30%";
      case "medium":
        return "50%";
      case "large":
        return "70%";
      default:
        return "100%";
    }
  };

  return (
    <Box
      style={{
        // TODO: Use theming
        borderBottom: "2px solid #37474f",
        width: getWidthPercentage(),
        margin: "auto",
      }}
    />
  );
}

export default LineBreak;
