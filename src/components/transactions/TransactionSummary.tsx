import { Card } from "@/components/ui/card";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";

export const TransactionSummary = () => {
  const { transactions } = useTransactions();

  const totalExpenses = transactions
    .filter(t => t.montant < 0)
    .reduce((acc, curr) => acc + curr.montant, 0);

  const totalIncome = transactions
    .filter(t => t.montant > 0)
    .reduce((acc, curr) => acc + curr.montant, 0);

  const balance = totalIncome + totalExpenses;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-green-100 p-3">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Revenus</p>
            <h3 className="text-2xl font-bold">
              {totalIncome.toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR"
              })}
            </h3>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-red-100 p-3">
            <TrendingDown className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Dépenses</p>
            <h3 className="text-2xl font-bold">
              {Math.abs(totalExpenses).toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR"
              })}
            </h3>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-blue-100 p-3">
            <DollarSign className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Solde</p>
            <h3 className="text-2xl font-bold">
              {balance.toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR"
              })}
            </h3>
          </div>
        </div>
      </Card>
    </div>
  );
};