import { Card } from "@/components/ui/card";
import { TrendingUp, AlertTriangle, PieChart } from "lucide-react";

interface Investment {
  id: number;
  nom: string;
  montantInvesti: number;
  valeurActuelle: number;
  rendement: number;
  type: string;
}

interface InvestmentStatsProps {
  investments: Investment[];
}

export const InvestmentStats = ({ investments }: InvestmentStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-green-100 p-3">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Valeur Totale</p>
            <h3 className="text-2xl font-bold">
              {investments
                .reduce((acc, inv) => acc + inv.valeurActuelle, 0)
                .toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                })}
            </h3>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-blue-100 p-3">
            <PieChart className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Rendement Moyen</p>
            <h3 className="text-2xl font-bold">
              {(
                investments.reduce((acc, inv) => acc + inv.rendement, 0) /
                investments.length
              ).toFixed(1)}
              %
            </h3>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-yellow-100 p-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Plus-value Latente</p>
            <h3 className="text-2xl font-bold">
              {(
                investments.reduce(
                  (acc, inv) => acc + (inv.valeurActuelle - inv.montantInvesti),
                  0
                )
              ).toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
              })}
            </h3>
          </div>
        </div>
      </Card>
    </div>
  );
};