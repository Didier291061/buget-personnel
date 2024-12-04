import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useTransactions } from './useTransactions';
import { useBudgetCategories } from './useBudgetCategories';

export interface Credit {
  id: number;
  montantInitial: number;
  mensualite: number;
  soldeRestant: number;
  dateDebut: string;
  dureeEnMois: number;
  nom: string;
}

export const useCredits = () => {
  const { toast } = useToast();
  const { transactions } = useTransactions();
  const { categories, addCategory } = useBudgetCategories();
  const [credits, setCredits] = useState<Credit[]>(() => {
    const saved = localStorage.getItem('credits');
    return saved ? JSON.parse(saved) : [];
  });

  // Calcul du solde restant pour chaque crédit
  const calculateRemainingBalance = (credit: Credit) => {
    const creditTransactions = transactions.filter(t => t.creditId === credit.id.toString());
    const totalTransactions = creditTransactions.reduce((acc, curr) => acc + curr.montant, 0);
    return credit.montantInitial + totalTransactions; // On ajoute car les montants des dépenses sont déjà négatifs
  };

  // Mise à jour des soldes restants
  useEffect(() => {
    const updatedCredits = credits.map(credit => ({
      ...credit,
      soldeRestant: calculateRemainingBalance(credit)
    }));
    setCredits(updatedCredits);
    console.log('Soldes des crédits mis à jour:', updatedCredits);
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('credits', JSON.stringify(credits));
    console.log('Crédits mis à jour:', credits);
  }, [credits]);

  const addCredit = (credit: Omit<Credit, 'id' | 'soldeRestant'>) => {
    const newId = credits.length > 0 ? Math.max(...credits.map(c => c.id)) + 1 : 1;
    
    // Ajout automatique d'une catégorie pour le crédit
    const categoryExists = categories.some(cat => cat.name === credit.nom);
    if (!categoryExists) {
      addCategory(credit.nom);
    }

    const newCredit = {
      ...credit,
      id: newId,
      soldeRestant: credit.montantInitial
    };

    setCredits(prev => [...prev, newCredit]);
    toast({
      title: "Crédit ajouté",
      description: `Le crédit "${credit.nom}" a été ajouté avec succès.`
    });
    return newCredit;
  };

  const removeCredit = (id: number) => {
    const creditToRemove = credits.find(c => c.id === id);
    if (creditToRemove) {
      setCredits(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Crédit supprimé",
        description: `Le crédit "${creditToRemove.nom}" a été supprimé.`
      });
    }
  };

  const updateCreditBalance = (id: number, montantTransaction: number) => {
    setCredits(prev => prev.map(credit => {
      if (credit.id === id) {
        const nouveauSolde = calculateRemainingBalance({
          ...credit,
          soldeRestant: credit.soldeRestant + montantTransaction
        });
        return {
          ...credit,
          soldeRestant: nouveauSolde >= 0 ? nouveauSolde : 0
        };
      }
      return credit;
    }));
  };

  const calculateCreditScore = () => {
    let score = 750; // Score de base
    
    credits.forEach(credit => {
      const tauxRemboursement = (credit.montantInitial - credit.soldeRestant) / credit.montantInitial;
      if (tauxRemboursement > 0.5) score += 10;
      if (credit.soldeRestant === 0) score += 20;
    });

    return Math.min(850, score); // Score maximum de 850
  };

  return {
    credits,
    addCredit,
    removeCredit,
    updateCreditBalance,
    calculateCreditScore
  };
};