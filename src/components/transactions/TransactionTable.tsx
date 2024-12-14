import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { Transaction } from "@/hooks/useTransactions";

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: number) => void;
  onEdit: (transaction: Transaction) => void;
}

export const TransactionTable = ({ transactions, onDelete, onEdit }: TransactionTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead className="text-right">Montant</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{new Date(transaction.date).toLocaleDateString("fr-FR")}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>
                <span className={transaction.montant >= 0 ? "text-green-600" : "text-red-600"}>
                  {transaction.montant >= 0 ? "Revenu" : "Dépense"}
                </span>
              </TableCell>
              <TableCell>{transaction.categorie}</TableCell>
              <TableCell className={`text-right font-medium ${
                transaction.montant >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                {Math.abs(transaction.montant).toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR"
                })}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit(transaction)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDelete(transaction.id)}
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