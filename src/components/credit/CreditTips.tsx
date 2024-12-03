import { Card } from "@/components/ui/card";
import { Check, AlertTriangle } from "lucide-react";

const tips = [
  {
    type: "positive",
    message: "Excellent historique de paiement",
  },
  {
    type: "positive",
    message: "Faible utilisation du crédit disponible",
  },
  {
    type: "warning",
    message: "Comptes de crédit relativement récents",
  },
  {
    type: "warning",
    message: "Peu de diversité dans les types de crédit",
  },
];

export const CreditTips = () => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Suggestions d'Amélioration</h3>
      <div className="space-y-3">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-background"
          >
            {tip.type === "positive" ? (
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            )}
            <p className="text-sm">{tip.message}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};