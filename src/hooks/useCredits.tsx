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
    console.log("Début du calcul du score de crédit");
    let score = 750; // Score de base
    
    // Historique de paiement (35% de l'impact)
    const paiementsEnRetard = transactions.filter(t => 
      t.creditId && new Date(t.date) > new Date(t.date)
    ).length;
    const bonusHistorique = paiementsEnRetard === 0 ? 35 : Math.max(0, 35 - (paiementsEnRetard * 5));
    console.log("Bonus historique de paiement:", bonusHistorique);
    score += bonusHistorique;

    // Utilisation du crédit (30% de l'impact)
    if (credits.length > 0) {
      const tauxUtilisationMoyen = credits.reduce((acc, credit) => {
        return acc + (credit.soldeRestant / credit.montantInitial);
      }, 0) / credits.length;
      const bonusUtilisation = Math.round((1 - tauxUtilisationMoyen) * 30);
      console.log("Bonus utilisation du crédit:", bonusUtilisation);
      score += bonusUtilisation;
    }

    // Ancienneté des comptes (15% de l'impact)
    if (credits.length > 0) {
      const plusAncienCredit = credits.reduce((acc, credit) => {
        const dateCredit = new Date(credit.dateDebut);
        return acc < dateCredit ? acc : dateCredit;
      }, new Date());
      const moisAnciennete = Math.floor((new Date() - plusAncienCredit) / (1000 * 60 * 60 * 24 * 30));
      const bonusAnciennete = Math.min(15, Math.floor(moisAnciennete / 6));
      console.log("Bonus ancienneté:", bonusAnciennete);
      score += bonusAnciennete;
    }

    // Types de crédit (10% de l'impact)
    const typesUniques = new Set(credits.map(c => c.nom));
    const bonusDiversite = Math.min(10, typesUniques.size * 2);
    console.log("Bonus diversité des crédits:", bonusDiversite);
    score += bonusDiversite;

    // Nouvelles demandes (10% de l'impact)
    const creditsDerniersMois = credits.filter(credit => {
      const dateDebut = new Date(credit.dateDebut);
      const troisMoisAvant = new Date();
      troisMoisAvant.setMonth(troisMoisAvant.getMonth() - 3);
      return dateDebut > troisMoisAvant;
    }).length;
    const malusNouvellesDemandes = Math.min(10, creditsDerniersMois * 3);
    console.log("Malus nouvelles demandes:", malusNouvellesDemandes);
    score -= malusNouvellesDemandes;

    console.log("Score final calculé:", Math.min(850, score));
    return Math.min(850, score);
  };

  return {
    credits,
    addCredit,
    removeCredit,
    updateCreditBalance,
    calculateCreditScore
  };
};
