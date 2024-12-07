import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useTransactions } from './useTransactions';
import { useBudgetCategories } from './useBudgetCategories';
import { supabase } from "@/integrations/supabase/client";

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
  const [creditScore, setCreditScore] = useState<number>(750);
  const [scoreDetails, setScoreDetails] = useState<any>(null);

  const calculateRemainingBalance = (credit: Credit) => {
    const creditTransactions = transactions.filter(t => t.creditId === credit.id.toString());
    const totalTransactions = creditTransactions.reduce((acc, curr) => acc + curr.montant, 0);
    return credit.montantInitial + totalTransactions;
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

  // Synchronisation avec Supabase
  const syncCreditScore = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("Utilisateur non authentifié");
        return;
      }

      const { data, error } = await supabase.functions.invoke('calculate-credit-score', {
        body: {
          credits,
          transactions,
          userId: user.id
        }
      });

      if (error) throw error;

      console.log("Réponse de la fonction de calcul:", data);
      setCreditScore(data.score);
      setScoreDetails(data.details);

      toast({
        title: "Score de crédit mis à jour",
        description: `Votre nouveau score est de ${data.score}`,
      });
    } catch (error) {
      console.error("Erreur lors de la synchronisation:", error);
      toast({
        title: "Erreur de synchronisation",
        description: "Impossible de mettre à jour le score de crédit",
        variant: "destructive",
      });
    }
  };

  // Synchronisation automatique lors des changements
  useEffect(() => {
    syncCreditScore();
  }, [credits, transactions]);

  const addCredit = (credit: Omit<Credit, 'id' | 'soldeRestant'>) => {
    const newId = credits.length > 0 ? Math.max(...credits.map(c => c.id)) + 1 : 1;
    
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

  return {
    credits,
    addCredit,
    removeCredit,
    updateCreditBalance,
    creditScore,
    scoreDetails,
    syncCreditScore
  };
};