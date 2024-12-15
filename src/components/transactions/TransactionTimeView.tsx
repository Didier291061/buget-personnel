import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";

type ViewType = "monthly" | "yearly";

export const TransactionTimeView = () => {
  const [viewType, setViewType] = useState<ViewType>("monthly");
  const { transactions } = useTransactions();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const getMonthlyData = () => {
    const monthlyTransactions = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      if (date.getFullYear() === selectedYear) {
        const month = date.getMonth();
        if (!acc[month]) {
          acc[month] = {
            total: 0,
            expenses: 0,
            income: 0,
            transactions: []
          };
        }
        acc[month].transactions.push(transaction);
        acc[month].total += transaction.montant;
        if (transaction.montant > 0) {
          acc[month].income += transaction.montant;
        } else {
          acc[month].expenses += Math.abs(transaction.montant);
        }
      }
      return acc;
    }, {} as Record<number, { total: number; expenses: number; income: number; transactions: any[] }>);

    return monthlyTransactions;
  };

  const getYearlyData = () => {
    return transactions.reduce((acc, transaction) => {
      const year = new Date(transaction.date).getFullYear();
      if (!acc[year]) {
        acc[year] = {
          total: 0,
          expenses: 0,
          income: 0,
          transactions: []
        };
      }
      acc[year].transactions.push(transaction);
      acc[year].total += transaction.montant;
      if (transaction.montant > 0) {
        acc[year].income += transaction.montant;
      } else {
        acc[year].expenses += Math.abs(transaction.montant);
      }
      return acc;
    }, {} as Record<number, { total: number; expenses: number; income: number; transactions: any[] }>);
  };

  const exportData = () => {
    const data = viewType === "monthly" ? getMonthlyData() : getYearlyData();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${viewType}-${selectedYear}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  return (
    <Card className="p-4">
      <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
          <Button
            variant={viewType === "monthly" ? "default" : "outline"}
            onClick={() => setViewType("monthly")}
            className="text-sm px-2 sm:px-4"
            size="sm"
          >
            <span className="sm:hidden">Mensuel</span>
            <span className="hidden sm:inline">Vue Mensuelle</span>
          </Button>
          <Button
            variant={viewType === "yearly" ? "default" : "outline"}
            onClick={() => setViewType("yearly")}
            className="text-sm px-2 sm:px-4"
            size="sm"
          >
            <span className="sm:hidden">Annuel</span>
            <span className="hidden sm:inline">Vue Annuelle</span>
          </Button>
        </div>
        <Button 
          variant="outline" 
          onClick={exportData}
          className="text-sm px-2 sm:px-4"
          size="sm"
        >
          <Download className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Exporter</span>
        </Button>
      </div>

      {viewType === "monthly" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <select
              className="rounded-md border p-2"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {Array.from(
                { length: 5 },
                (_, i) => currentYear - i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(getMonthlyData()).map(([month, data]) => (
              <Card key={month} className="p-4">
                <h3 className="mb-2 font-semibold">
                  {monthNames[Number(month)]}
                </h3>
                <div className="space-y-2">
                  <p className="text-green-600">
                    Revenus: {data.income.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </p>
                  <p className="text-red-600">
                    Dépenses: {data.expenses.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </p>
                  <p className="font-semibold">
                    Total: {data.total.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {viewType === "yearly" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(getYearlyData()).map(([year, data]) => (
            <Card key={year} className="p-4">
              <h3 className="mb-2 font-semibold">{year}</h3>
              <div className="space-y-2">
                <p className="text-green-600">
                  Revenus: {data.income.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </p>
                <p className="text-red-600">
                  Dépenses: {data.expenses.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </p>
                <p className="font-semibold">
                  Total: {data.total.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};
