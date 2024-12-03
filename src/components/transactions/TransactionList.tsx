import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Transaction } from "@/hooks/useTransactions";

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: number) => void;
}

export const TransactionList = ({ transactions, onDeleteTransaction }: TransactionListProps) => {
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
              <TableCell>{transaction.date}</TableCell>
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
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDeleteTransaction(transaction.id)}
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