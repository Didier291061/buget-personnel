import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

export interface Transaction {
  id: number;
  date: string;
  description: string;
  montant: number;
  categorie: string;
}

export const useTransactions = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
    const newTransaction = { ...transaction, id: newId };
    setTransactions([...transactions, newTransaction]);
    toast({
      title: "Transaction ajoutée",
      description: `La transaction "${transaction.description}" a été ajoutée avec succès.`
    });
    return newTransaction;
  };

  const removeTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast({
      title: "Transaction annulée",
      description: "La transaction a été supprimée avec succès."
    });
  };

  return {
    transactions,
    addTransaction,
    removeTransaction
  };
};