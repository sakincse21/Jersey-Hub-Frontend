import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomPieChart = ({ data, title }: { data: any[]; title: string }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-center text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={360} minWidth={340}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
            nameKey="_id"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AdminCharts = ({ orderBreakdown }: { orderBreakdown: any }) => {
  return (
    // <div className="grid gap-3 lg:grid-cols-3">
    <div className="flex flex-col lg:flex-row gap-5 justify-center items-center">
      <CustomPieChart data={orderBreakdown.byStatus} title="Orders by Status" />
      <CustomPieChart data={orderBreakdown.byPaymentStatus} title="By Payment Status" />
      <CustomPieChart data={orderBreakdown.byPaymentMethod} title="By Payment Method" />
    </div>
  );
};