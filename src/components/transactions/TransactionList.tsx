import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Download, Pencil } from "lucide-react";
import { Transaction } from "@/hooks/useTransactions";
import { useState } from "react";
import { EditTransactionDialog } from "./EditTransactionDialog";
import { useCredits } from "@/hooks/useCredits";

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: number) => void;
  onEditTransaction: (transaction: Transaction) => void;
}

type SortField = "date" | "montant" | "categorie";
type SortOrder = "asc" | "desc";

export const TransactionList = ({ transactions, onDeleteTransaction, onEditTransaction }: TransactionListProps) => {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { credits } = useCredits();

  const sortedAndFilteredTransactions = transactions
    .filter(transaction => {
      if (selectedMonth === "all") return true;
      const transactionDate = new Date(transaction.date);
      const [year, month] = selectedMonth.split("-");
      return transactionDate.getFullYear() === parseInt(year) && 
             transactionDate.getMonth() === parseInt(month) - 1;
    })
    .sort((a, b) => {
      if (sortField === "date") {
        return sortOrder === "asc" 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortField === "montant") {
        return sortOrder === "asc" 
          ? a.montant - b.montant
          : b.montant - a.montant;
      }
      // categorie
      return sortOrder === "asc"
        ? a.categorie.localeCompare(b.categorie)
        : b.categorie.localeCompare(a.categorie);
    });

  const getMonthOptions = () => {
    const months = new Set<string>();
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthStr);
    });
    return Array.from(months).sort().reverse();
  };

  const exportTransactions = () => {
    const data = sortedAndFilteredTransactions.map(t => ({
      date: t.date,
      description: t.description,
      montant: t.montant,
      categorie: t.categorie,
      type: t.montant >= 0 ? "Revenu" : "Dépense"
    }));
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Date,Description,Type,Catégorie,Montant\n" +
      data.map(row => 
        `${row.date},${row.description},${row.type},${row.categorie},${row.montant}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transactions${selectedMonth !== "all" ? `-${selectedMonth}` : ""}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner un mois" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les transactions</SelectItem>
              {getMonthOptions().map(month => (
                <SelectItem key={month} value={month}>
                  {new Date(month + "-01").toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long"
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortField} onValueChange={(value) => setSortField(value as SortField)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="montant">Montant</SelectItem>
              <SelectItem value="categorie">Catégorie</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Croissant</SelectItem>
              <SelectItem value="desc">Décroissant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" onClick={exportTransactions}>
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </div>

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
            {sortedAndFilteredTransactions.map((transaction) => (
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
                      onClick={() => setEditingTransaction(transaction)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDeleteTransaction(transaction.id)}
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

      {editingTransaction && (
        <EditTransactionDialog
          isOpen={!!editingTransaction}
          onOpenChange={(open) => !open && setEditingTransaction(null)}
          transaction={editingTransaction}
          onEditTransaction={onEditTransaction}
          credits={credits}
        />
      )}
    </div>
  );
};
