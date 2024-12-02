import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const performanceData = [
  { mois: "Jan", valeur: 10000 },
  { mois: "Fév", valeur: 11200 },
  { mois: "Mar", valeur: 10800 },
  { mois: "Avr", valeur: 12000 },
  { mois: "Mai", valeur: 12500 },
  { mois: "Juin", valeur: 13000 },
];

export const PerformanceChart = () => {
  return (
    <Card className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Performance du Portefeuille</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mois" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="valeur"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};