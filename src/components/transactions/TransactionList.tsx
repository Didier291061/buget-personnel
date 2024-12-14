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
import { TransactionFilters } from "./TransactionFilters";
import { TransactionTable } from "./TransactionTable";

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: number) => void;
  onEditTransaction: (transaction: Transaction) => void;
}

export const TransactionList = ({ 
  transactions, 
  onDeleteTransaction, 
  onEditTransaction 
}: TransactionListProps) => {
  const [sortField, setSortField] = useState<"date" | "montant" | "categorie">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
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

  const handleEditClick = (transaction: Transaction) => {
    console.log("Editing transaction:", transaction);
    setEditingTransaction(transaction);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    console.log("Saving edited transaction:", transaction);
    onEditTransaction(transaction);
    setEditingTransaction(null);
  };

  return (
    <div className="space-y-4">
      <TransactionFilters 
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        monthOptions={getMonthOptions()}
      />

      <TransactionTable 
        transactions={sortedAndFilteredTransactions}
        onDelete={onDeleteTransaction}
        onEdit={handleEditClick}
      />

      {editingTransaction && (
        <EditTransactionDialog
          isOpen={!!editingTransaction}
          onOpenChange={(open) => !open && setEditingTransaction(null)}
          transaction={editingTransaction}
          onEditTransaction={handleEditTransaction}
          credits={credits}
        />
      )}
    </div>
  );
};