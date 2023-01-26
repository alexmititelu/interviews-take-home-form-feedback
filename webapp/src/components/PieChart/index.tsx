import { Box, Typography } from "@mui/material";
import React from "react";
import {
  PieChart as PieChartRecharts,
  ResponsiveContainer,
  Pie,
  Cell,
  Legend,
  Label,
  Tooltip,
} from "recharts";

type DataPoint = {
  name: string;
  value: number;
};

interface Props {
  data: Array<DataPoint>;
  colorMapping: { [key: string]: string };
  label?: string;
  headline?: string;
  withLegend?: boolean;
  withTooltip?: boolean;
}

function PieChart(props: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {props.headline && <Typography variant="h6">{props.headline}</Typography>}
      <ResponsiveContainer width="100%" height={250}>
        <PieChartRecharts width={250} height={250}>
          <Pie
            data={props.data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
          >
            {props.data.map((entry: any, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={props.colorMapping[entry.name]}
              />
            ))}
            {props.label ? (
              <Label position="center">{props.label}</Label>
            ) : null}
          </Pie>
          {props.withLegend && (
            <Legend verticalAlign="bottom" iconType="circle" iconSize={19} />
          )}
          {props.withTooltip && <Tooltip />}
        </PieChartRecharts>
      </ResponsiveContainer>
    </Box>
  );
}

export default PieChart;
