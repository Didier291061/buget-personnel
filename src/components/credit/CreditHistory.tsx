import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useCredits } from "@/hooks/useCredits";
import { useEffect, useState } from "react";

export const CreditHistory = () => {
  const { calculateCreditScore } = useCredits();
  const [historicalData, setHistoricalData] = useState(() => {
    const saved = localStorage.getItem('creditScoreHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const currentScore = calculateCreditScore();
    const newEntry = {
      mois: new Date().toLocaleDateString('fr-FR', { month: 'short' }),
      score: currentScore
    };

    const updatedHistory = [...historicalData, newEntry].slice(-6); // Garde les 6 derniers mois
    setHistoricalData(updatedHistory);
    localStorage.setItem('creditScoreHistory', JSON.stringify(updatedHistory));
  }, [calculateCreditScore]);

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