import { useSummaryQuery } from "@/redux/features/Order/order.api";
import LoadingScreen from "@/components/layout/LoadingScreen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, BarChartBig } from "lucide-react";
import { AdminCharts } from "@/components/modules/Admin/AdminCharts";
import { RecentOrdersTable } from "@/components/modules/Admin/RecentOrdersTable";
import { TopProductsTable } from "@/components/modules/Admin/TopProductsTable";

const AdminOverview = () => {
  const { data: summaryData, isLoading, isError } = useSummaryQuery(undefined);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !summaryData?.data) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500">Failed to load dashboard data.</p>
      </div>
    );
  }

  const { overview, timeBasedStats, orderBreakdown, recentOrders, topProducts } =
    summaryData.data;

  return (
    <div className="mx-auto space-y-8 p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${overview.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All-time revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{overview.totalOrders}</div>
            <p className="text-xs text-muted-foreground">All-time orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${timeBasedStats.thisMonth.revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              from {timeBasedStats.thisMonth.orders} orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <BarChartBig className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${overview.averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All-time average</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <AdminCharts orderBreakdown={orderBreakdown} />

      {/* Tables */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <RecentOrdersTable recentOrders={recentOrders} />
        <TopProductsTable topProducts={topProducts} />
      </div>
    </div>
  );
};

export default AdminOverview;