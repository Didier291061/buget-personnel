import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useCredits } from './useCredits';
import { useTransactions } from './useTransactions';
import { useObjectives } from './useObjectives';

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
            // Handle different types of changes
            if (payload.eventType === 'INSERT') {
              addCredit(payload.new);
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
              addTransaction(payload.new);
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
              addObjective(payload.new);
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