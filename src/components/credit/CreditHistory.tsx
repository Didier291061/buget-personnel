import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const historicalData = [
  { mois: "Jan", score: 720 },
  { mois: "Fév", score: 725 },
  { mois: "Mar", score: 730 },
  { mois: "Avr", score: 735 },
  { mois: "Mai", score: 745 },
  { mois: "Juin", score: 750 },
];

export const CreditHistory = () => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Historique du Score</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mois" />
            <YAxis domain={[650, 850]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};