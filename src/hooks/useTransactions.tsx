import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

export interface Transaction {
  id: number;
  date: string;
  description: string;
  montant: number;
  categorie: string;
  creditId?: string;  // Ajout de la propriété creditId comme optionnelle
}

export const useTransactions = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    console.log('Transactions mises à jour:', transactions);
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
    const newTransaction = { ...transaction, id: newId };
    setTransactions(prev => [...prev, newTransaction]);
    toast({
      title: "Transaction ajoutée",
      description: `La transaction "${transaction.description}" a été ajoutée avec succès.`
    });
    return newTransaction;
  };

  const removeTransaction = (id: number) => {
    const transactionToRemove = transactions.find(t => t.id === id);
    if (transactionToRemove) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast({
        title: "Transaction supprimée",
        description: `La transaction "${transactionToRemove.description}" a été supprimée.`
      });
    }
  };

  const updateTransaction = (id: number, updatedTransaction: Partial<Omit<Transaction, 'id'>>) => {
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...t, ...updatedTransaction } : t
    ));
    toast({
      title: "Transaction mise à jour",
      description: "La transaction a été mise à jour avec succès."
    });
  };

  const getTransactionsByCategory = (category: string) => {
    return transactions.filter(t => t.categorie === category);
  };

  return {
    transactions,
    addTransaction,
    removeTransaction,
    updateTransaction,
    getTransactionsByCategory
  };
};