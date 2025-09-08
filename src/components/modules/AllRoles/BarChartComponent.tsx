"use client";

// import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";


export interface IDataForBarChart {
  Label: string;
  Amount: number;
}

export interface IBarChartData {
  chartData: IDataForBarChart[];
  footer: string;
  title: string;
  totalCount?: number;
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function BarChartComponent(barChartData: IBarChartData) {
  const chartData = barChartData.chartData;
  const totalAmount = barChartData.totalCount || chartData.reduce((accumulator, currentValue) => accumulator + currentValue.Amount, 0);
  return (
    <Card className="min-w-sm">
      <CardHeader>
        <CardTitle>{barChartData.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="Label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="Amount" fill="var(--color-chart-5)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter >
        <h3 className="w-full text-center">{`${barChartData.footer} ${totalAmount}`}</h3>
      </CardFooter>
    </Card>
  );
}
