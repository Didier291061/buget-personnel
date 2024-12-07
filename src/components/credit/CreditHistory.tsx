import { Card } from "@/components/ui/card";
import { useCredits } from "@/hooks/useCredits";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const CreditHistory = () => {
  const { credits, creditScore } = useCredits();

  const data = credits.map(credit => ({
    name: credit.nom,
    score: creditScore
  }));

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Historique du Score</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 1000]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};