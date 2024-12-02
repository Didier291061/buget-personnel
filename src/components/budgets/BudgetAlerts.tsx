import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface Budget {
  id: number;
  categorie: string;
  montantPrevu: number;
  montantDepense: number;
}

interface BudgetAlertsProps {
  budgets: Budget[];
}

export const BudgetAlerts = ({ budgets }: BudgetAlertsProps) => {
  return (
    <Card className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Alertes</h3>
      <div className="space-y-4">
        {budgets
          .filter((budget) => budget.montantDepense > budget.montantPrevu * 0.8)
          .map((budget) => (
            <div
              key={budget.id}
              className="flex items-center gap-2 rounded-lg border p-3"
            >
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <span>
                Le budget {budget.categorie} est utilisé à{" "}
                {Math.round((budget.montantDepense / budget.montantPrevu) * 100)}%
              </span>
            </div>
          ))}
      </div>
    </Card>
  );
};