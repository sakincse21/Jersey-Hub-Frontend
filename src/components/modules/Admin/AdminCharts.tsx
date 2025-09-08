import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingScreen from "@/components/layout/LoadingScreen";
import BarChartComponent, {
  type IBarChartData,
  type IDataForBarChart,
} from "../AllRoles/BarChartComponent";
import { PieChartComponent } from "../AllRoles/PieChartComponent";
import { useSummaryQuery } from "@/redux/features/Order/order.api";

const AgentCharts = () => {
  const { data, isLoading } = useSummaryQuery(undefined);
  if (isLoading) {
    return <LoadingScreen />;
  }
  // console.log("sumamry data", data);
  const tempUserChartData: IDataForBarChart[] = data?.data[0].filter(
    (each: { Label: string; Amount: string }) =>
      each.Label !== "Total"
        ? {
            Label: each.Label,
            Amount: each.Amount,
          }
        : null
  );
  const userChartData: IBarChartData = {
    chartData: tempUserChartData,
    footer: "Total users: ",
    title: "User Type vs Volume",
    totalCount: data?.data[0][8]?.Amount,
  };
  const tempTransactionChartData: IDataForBarChart[] = data?.data[1].map(
    (each: { Label: string; Amount: string }) => ({
      Label: each.Label,
      Amount: each.Amount,
    })
  );
  const transactionChartData: IBarChartData = {
    chartData: tempTransactionChartData,
    footer: "Total transaction amount: BDT",
    title: "Transaction Type vs Amount",
  };
  const tempVolumeChartData: IDataForBarChart[] = data?.data[1].map(
    (each: { Label: string; Volume: string }) => ({
      Label: each.Label,
      Amount: each.Volume,
    })
  );
  const volumeChartData: IBarChartData = {
    chartData: tempVolumeChartData,
    footer: "Total transactions: ",
    title: "Transaction Type vs Volume",
  };
  const tempRoleChartData: IDataForBarChart[] = data?.data[2].map(
    (each: { Label: string; Amount: string }) => ({
      Label: each.Label,
      Amount: each.Amount,
    })
  );

  const roleChartData: IBarChartData = {
    chartData: tempRoleChartData,
    footer: "Total users: ",
    title: "Transaction Type vs Volume",
  };

  return (
    // <div className="w-90 mx-auto h-full flex flex-col justify-center items-center">
      <Card className="w-full md:w-5xl">
        <CardHeader>
          <CardTitle>All Summary</CardTitle>
        </CardHeader>
        <CardContent className="text-center flex flex-col justify-around items-center gap-6">
          <div className="w-full flex flex-row justify-around items-center gap-4">
            <div className="w-full">
              <BarChartComponent {...transactionChartData} />
            </div>
            <div className="w-full">
              <BarChartComponent {...volumeChartData} />
            </div>
          </div>
          <div className="w-full flex flex-row justify-around items-center gap-4">
            <div className="w-full">
              <BarChartComponent {...userChartData} />
            </div>
            <div className="w-full py-5">
              <PieChartComponent {...roleChartData} />
            </div>
          </div>
        </CardContent>
      </Card>
    // </div>
  );
};

export default AgentCharts;
