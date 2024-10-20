"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A mixed bar chart for star ratings";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  "5 Stars": {
    label: "5 Stars",
    color: "#FFD700",
  },
  "4 Stars": {
    label: "4 Stars",
    color: "#C0C0C0",
  },
  "3 Stars": {
    label: "3 Stars",
    color: "#CD7F32",
  },
  "2 Stars": {
    label: "2 Stars",
    color: "#B22222",
  },
  "1 Star": {
    label: "1 Star",
    color: "#8B0000",
  },
};

export default function OverallRatingChart({
  oneStar,
  twoStar,
  threeStar,
  fourStar,
  fiveStar,
  generateStars,
}) {
  const chartData = [
    { rating: "5 Stars", visitors: fiveStar, fill: "#FFD700" }, // Gold
    { rating: "4 Stars", visitors: fourStar, fill: "#C0C0C0" }, // Silver
    { rating: "3 Stars", visitors: threeStar, fill: "#CD7F32" }, // Bronze
    { rating: "2 Stars", visitors: twoStar, fill: "#B22222" }, // Firebrick
    { rating: "1 Star", visitors: oneStar, fill: "#8B0000" }, // Dark Red
  ];

  const total = oneStar + twoStar + threeStar + fourStar + fiveStar;
  const averageRating =
    (oneStar * 1 + twoStar * 2 + threeStar * 3 + fourStar * 4 + fiveStar * 5) /
    total;

  return (
    <Card className="w-full h-56">
      <CardHeader></CardHeader>
      <CardContent className="flex justify-center items-center">
        <div className="flex-col justify-center items-center gap-1">
          <p className="font-bold">Overall Rating</p>
          <p>{averageRating} Rating</p>
          <div key="1"className="flex"> {generateStars(averageRating)}</div>
          <p>Total Reviews: {total}</p>
        </div>
        <ChartContainer config={chartConfig} className="w-[500px] h-40">
          <BarChart data={chartData} layout="vertical" margin={{ left: 50 }}>
            <YAxis
              dataKey="rating"
              type="category"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              tickFormatter={(value) => chartConfig[value]?.label || value}
              fontSize={12} // Adjust font size for smaller chart
            />
            <XAxis type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="visitors" layout="vertical" radius={5} barSize={20}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>
  );
}
