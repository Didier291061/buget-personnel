import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { AlertCircle, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Budget {
  id: number;
  categorie: string;
  montantPrevu: number;
  montantDepense: number;
}

const BudgetsPanel = () => {
  const { toast } = useToast();
  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: 1,
      categorie: "Alimentation",
      montantPrevu: 500,
      montantDepense: 350,
    },
    {
      id: 2,
      categorie: "Transport",
      montantPrevu: 200,
      montantDepense: 180,
    },
    {
      id: 3,
      categorie: "Loisirs",
      montantPrevu: 300,
      montantDepense: 250,
    },
  ]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const pieData = budgets.map((budget) => ({
    name: budget.categorie,
    value: budget.montantPrevu,
  }));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h3 className="mb-4 text-lg font-semibold">Répartition des Budgets</h3>
          <div className="h-[300px]">
            <ChartContainer config={{}}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
        </Card>

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
      </div>

      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Suivi des Budgets</h3>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nouveau Budget
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Catégorie</TableHead>
                <TableHead>Budget Prévu</TableHead>
                <TableHead>Dépensé</TableHead>
                <TableHead>Progression</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgets.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell>{budget.categorie}</TableCell>
                  <TableCell>
                    {budget.montantPrevu.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </TableCell>
                  <TableCell>
                    {budget.montantDepense.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={(budget.montantDepense / budget.montantPrevu) * 100}
                        className="w-full"
                      />
                      <span className="min-w-[3rem] text-sm">
                        {Math.round(
                          (budget.montantDepense / budget.montantPrevu) * 100
                        )}
                        %
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default BudgetsPanel;