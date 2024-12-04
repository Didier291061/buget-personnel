import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface Investment {
  id: number;
  nom: string;
  montantInvesti: number;
  valeurActuelle: number;
  rendement: number;
  type: string;
}

interface InvestmentListProps {
  investments: Investment[];
  onDeleteInvestment: (id: number) => void;
  onEditInvestment: (investment: Investment) => void;
}

export const InvestmentList = ({ investments, onDeleteInvestment, onEditInvestment }: InvestmentListProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Montant Investi</TableHead>
            <TableHead>Valeur Actuelle</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investments.map((investment) => (
            <TableRow key={investment.id}>
              <TableCell className="font-medium">{investment.nom}</TableCell>
              <TableCell>{investment.type}</TableCell>
              <TableCell>
                {investment.montantInvesti.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                })}
              </TableCell>
              <TableCell>
                {investment.valeurActuelle.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                })}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress
                    value={investment.rendement}
                    className="w-full"
                  />
                  <span
                    className={`min-w-[3rem] text-sm ${
                      investment.rendement >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {investment.rendement}%
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditInvestment(investment)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteInvestment(investment.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};