import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

interface Budget {
  id: number;
  categorie: string;
  montantPrevu: number;
  montantDepense: number;
}

interface BudgetAlertsProps {
  budgets: Budget[];
}

interface AlertSettings {
  enabled: boolean;
  threshold: number;
  pushNotifications: boolean;
  emailNotifications: boolean;
}

export const BudgetAlerts = ({ budgets }: BudgetAlertsProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AlertSettings>(() => {
    const saved = localStorage.getItem('budgetAlertSettings');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      threshold: 80,
      pushNotifications: true,
      emailNotifications: false
    };
  });

  useEffect(() => {
    if (!settings.enabled) return;

    budgets.forEach(budget => {
      const percentage = (budget.montantDepense / budget.montantPrevu) * 100;
      if (percentage >= settings.threshold) {
        // Notification toast
        toast({
          title: "Alerte Budget",
          description: `Le budget ${budget.categorie} a atteint ${Math.round(percentage)}% de son montant prévu.`,
          variant: "destructive"
        });

        // Notification push si activée et supportée par le navigateur
        if (settings.pushNotifications && "Notification" in window) {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              new Notification("Alerte Budget", {
                body: `Le budget ${budget.categorie} a atteint ${Math.round(percentage)}% de son montant prévu.`
              });
            }
          });
        }

        // Simulation d'envoi d'email (à implémenter avec un service réel)
        if (settings.emailNotifications) {
          console.log("Envoi d'email d'alerte pour", budget.categorie);
        }
      }
    });
  }, [budgets, settings]);

  const getAlertVariant = (budget: Budget) => {
    const percentage = (budget.montantDepense / budget.montantPrevu) * 100;
    if (percentage >= 100) return "destructive";
    if (percentage >= settings.threshold) return "warning";
    return "default";
  };

  return (
    <Card className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Alertes</h3>
      <div className="space-y-4">
        {budgets
          .filter((budget) => {
            const percentage = (budget.montantDepense / budget.montantPrevu) * 100;
            return percentage >= settings.threshold;
          })
          .map((budget) => {
            const percentage = (budget.montantDepense / budget.montantPrevu) * 100;
            return (
              <div
                key={budget.id}
                className={`flex items-center gap-2 rounded-lg border p-3 ${
                  percentage >= 100 ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'
                }`}
              >
                <AlertCircle className={`h-5 w-5 ${
                  percentage >= 100 ? 'text-red-500' : 'text-yellow-500'
                }`} />
                <span>
                  Le budget {budget.categorie} est utilisé à{" "}
                  <span className="font-semibold">
                    {Math.round(percentage)}%
                  </span>
                </span>
              </div>
            );
          })}
      </div>
    </Card>
  );
};