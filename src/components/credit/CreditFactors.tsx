import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const factors = [
  {
    name: "Historique de paiement",
    impact: 35,
    score: 90,
  },
  {
    name: "Utilisation du crédit",
    impact: 30,
    score: 85,
  },
  {
    name: "Ancienneté des comptes",
    impact: 15,
    score: 70,
  },
  {
    name: "Types de crédit",
    impact: 10,
    score: 95,
  },
  {
    name: "Nouvelles demandes",
    impact: 10,
    score: 100,
  },
];

export const CreditFactors = () => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Facteurs de Score</h3>
      <div className="space-y-4">
        {factors.map((factor) => (
          <div key={factor.name}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">{factor.name}</span>
              <span className="text-sm text-muted-foreground">
                Impact : {factor.impact}%
              </span>
            </div>
            <Progress value={factor.score} className="h-2" />
          </div>
        ))}
      </div>
    </Card>
  );
};