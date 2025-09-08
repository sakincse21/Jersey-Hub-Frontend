"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { IBarChartData } from "./BarChartComponent";

export const description = "A pie chart with a label";

export function PieChartComponent(pieChartData: IBarChartData) {
  const chartData = [
    {
      browser: "Agents",
      visitors: pieChartData.chartData[0].Amount,
      fill: "var(--color-Agents)",
    },
    {
      browser: "Users",
      visitors: pieChartData.chartData[1].Amount,
      fill: "var(--color-Users)",
    },
  ];
  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    Agents: {
      label: "Agents",
      color: "var(--chart-3)",
    },
    Users: {
      label: "Users",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  // console.log(chartData, "chartdata");

  const totalUsers = chartData.reduce((acc, curr) => acc + curr.visitors, 0);

  return (
    <Card className="flex flex-col min-w-sm">
      <CardHeader className="items-center pb-0">
        <CardTitle>Users vs Agents</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="visitors" label nameKey="browser" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
            Total Users: {totalUsers}
        </div>
      </CardFooter>
    </Card>
  );
}
