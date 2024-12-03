import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Budget {
  id: number;
  categorie: string;
  montantPrevu: number;
  montantDepense: number;
}

interface BudgetTableProps {
  budgets: Budget[];
  onDeleteBudget: (id: number) => void;
}

export const BudgetTable = ({ budgets, onDeleteBudget }: BudgetTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Catégorie</TableHead>
            <TableHead>Budget Prévu</TableHead>
            <TableHead>Dépensé</TableHead>
            <TableHead>Progression</TableHead>
            <TableHead>Actions</TableHead>
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
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteBudget(budget.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};