import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionSummary } from "./transactions/TransactionSummary";
import { TransactionSearch } from "./transactions/TransactionSearch";
import { TransactionList } from "./transactions/TransactionList";
import { NewTransactionDialog } from "./transactions/NewTransactionDialog";
import { TransactionTimeView } from "./transactions/TransactionTimeView";
import { PrintButton } from "./ui/print-button";

const TransactionsPanel = () => {
  const { transactions, addTransaction, removeTransaction, updateTransaction } = useTransactions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.categorie.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <PrintButton title="Imprimer les transactions" />
      </div>
      
      <TransactionSummary />
      
      <TransactionTimeView />

      <Card className="p-4">
        <TransactionSearch 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenNewTransaction={() => setIsDialogOpen(true)}
        />

        <TransactionList 
          transactions={filteredTransactions}
          onDeleteTransaction={removeTransaction}
          onEditTransaction={updateTransaction}
        />

        <NewTransactionDialog 
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onAddTransaction={addTransaction}
        />
      </Card>
    </div>
  );
};

export default TransactionsPanel;