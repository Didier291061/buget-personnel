import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";

interface BudgetChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const BudgetChart = ({ data }: BudgetChartProps) => {
  return (
    <Card className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Répartition des Budgets</h3>
      <div className="h-[300px]">
        <ChartContainer config={{}}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
    </Card>
  );
};