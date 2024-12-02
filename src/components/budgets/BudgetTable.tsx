import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

interface Budget {
  id: number;
  categorie: string;
  montantPrevu: number;
  montantDepense: number;
}

interface BudgetTableProps {
  budgets: Budget[];
}

export const BudgetTable = ({ budgets }: BudgetTableProps) => {
  return (
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
  );
};