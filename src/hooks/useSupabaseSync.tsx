import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useCredits, Credit } from './useCredits';
import { useTransactions, Transaction } from './useTransactions';
import { useObjectives, Objective } from './useObjectives';

export const useSupabaseSync = () => {
  const { toast } = useToast();
  const { credits, addCredit, removeCredit } = useCredits();
  const { transactions, addTransaction, removeTransaction } = useTransactions();
  const { objectives, addObjective, deleteObjective } = useObjectives();

  useEffect(() => {
    const setupRealtimeSubscriptions = async () => {
      // Subscribe to credits changes
      const creditsSubscription = supabase
        .channel('credits_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'credits'
          },
          (payload) => {
            console.log('Credits change received:', payload);
            if (payload.eventType === 'INSERT') {
              const newCredit: Omit<Credit, 'id' | 'soldeRestant'> = {
                montantInitial: payload.new.montant_initial,
                mensualite: payload.new.mensualite,
                dateDebut: payload.new.date_debut,
                dureeEnMois: payload.new.duree_en_mois,
                nom: payload.new.nom
              };
              addCredit(newCredit);
            } else if (payload.eventType === 'DELETE') {
              removeCredit(payload.old.id);
            }
          }
        )
        .subscribe();

      // Subscribe to transactions changes
      const transactionsSubscription = supabase
        .channel('transactions_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transactions'
          },
          (payload) => {
            console.log('Transactions change received:', payload);
            if (payload.eventType === 'INSERT') {
              const newTransaction: Omit<Transaction, 'id'> = {
                date: payload.new.date,
                description: payload.new.description,
                montant: payload.new.montant,
                categorie: payload.new.categorie,
                creditId: payload.new.credit_id?.toString()
              };
              addTransaction(newTransaction);
            } else if (payload.eventType === 'DELETE') {
              removeTransaction(payload.old.id);
            }
          }
        )
        .subscribe();

      // Subscribe to objectives changes
      const objectivesSubscription = supabase
        .channel('objectives_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'objectives'
          },
          (payload) => {
            console.log('Objectives change received:', payload);
            if (payload.eventType === 'INSERT') {
              const newObjective: Omit<Objective, 'id'> = {
                nom: payload.new.nom,
                montantCible: payload.new.montant_cible,
                montantActuel: payload.new.montant_actuel,
                dateObjectif: payload.new.date_objectif
              };
              addObjective(newObjective);
            } else if (payload.eventType === 'DELETE') {
              deleteObjective(payload.old.id);
            }
          }
        )
        .subscribe();

      // Initial data load
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error('No authenticated user found');
          return;
        }

        // Load credits
        const { data: creditsData, error: creditsError } = await supabase
          .from('credits')
          .select('*')
          .eq('user_id', user.id);

        if (creditsError) throw creditsError;
        console.log('Initial credits loaded:', creditsData);

        // Load transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id);

        if (transactionsError) throw transactionsError;
        console.log('Initial transactions loaded:', transactionsData);

        // Load objectives
        const { data: objectivesData, error: objectivesError } = await supabase
          .from('objectives')
          .select('*')
          .eq('user_id', user.id);

        if (objectivesError) throw objectivesError;
        console.log('Initial objectives loaded:', objectivesData);

        toast({
          title: "Synchronisation réussie",
          description: "Toutes les données ont été synchronisées avec succès.",
        });

      } catch (error) {
        console.error('Error during initial data load:', error);
        toast({
          title: "Erreur de synchronisation",
          description: "Une erreur est survenue lors de la synchronisation des données.",
          variant: "destructive",
        });
      }

      // Cleanup function
      return () => {
        creditsSubscription.unsubscribe();
        transactionsSubscription.unsubscribe();
        objectivesSubscription.unsubscribe();
      };
    };

    setupRealtimeSubscriptions();
  }, []);
};