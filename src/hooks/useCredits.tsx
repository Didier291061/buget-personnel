import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

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
  const [credits, setCredits] = useState<Credit[]>(() => {
    const saved = localStorage.getItem('credits');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('credits', JSON.stringify(credits));
    console.log('Crédits mis à jour:', credits);
  }, [credits]);

  const addCredit = (credit: Omit<Credit, 'id' | 'soldeRestant'>) => {
    const newId = credits.length > 0 ? Math.max(...credits.map(c => c.id)) + 1 : 1;
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
        const nouveauSolde = credit.soldeRestant - montantTransaction;
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