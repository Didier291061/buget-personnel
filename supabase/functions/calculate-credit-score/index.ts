import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Credit {
  id: number;
  montantInitial: number;
  mensualite: number;
  soldeRestant: number;
  dateDebut: string;
  dureeEnMois: number;
  nom: string;
}

interface Transaction {
  id: number;
  date: string;
  description: string;
  montant: number;
  categorie: string;
  creditId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { credits, transactions, userId } = await req.json()

    console.log("Calcul du score pour l'utilisateur:", userId)
    console.log("Crédits reçus:", credits)
    console.log("Transactions reçues:", transactions)

    // Calcul du score
    let score = 750 // Score de base

    // Historique de paiement (35% de l'impact)
    const paiementsEnRetard = transactions.filter((t: Transaction) => 
      t.creditId && new Date(t.date) > new Date(t.date)
    ).length
    const bonusHistorique = paiementsEnRetard === 0 ? 35 : Math.max(0, 35 - (paiementsEnRetard * 5))
    console.log("Bonus historique:", bonusHistorique)

    // Utilisation du crédit (30% de l'impact)
    let bonusUtilisation = 0
    if (credits.length > 0) {
      const tauxUtilisationMoyen = credits.reduce((acc: number, credit: Credit) => {
        return acc + (credit.soldeRestant / credit.montantInitial)
      }, 0) / credits.length
      bonusUtilisation = Math.round((1 - tauxUtilisationMoyen) * 30)
    }
    console.log("Bonus utilisation:", bonusUtilisation)

    // Ancienneté des comptes (15% de l'impact)
    let bonusAnciennete = 0
    if (credits.length > 0) {
      const plusAncienCredit = new Date(Math.min(...credits.map((credit: Credit) => new Date(credit.dateDebut).getTime())))
      const maintenant = new Date()
      const moisAnciennete = Math.floor((maintenant.getTime() - plusAncienCredit.getTime()) / (1000 * 60 * 60 * 24 * 30))
      bonusAnciennete = Math.min(15, Math.floor(moisAnciennete / 6))
    }
    console.log("Bonus ancienneté:", bonusAnciennete)

    // Types de crédit (10% de l'impact)
    const typesUniques = new Set(credits.map((c: Credit) => c.nom))
    const bonusDiversite = Math.min(10, typesUniques.size * 2)
    console.log("Bonus diversité:", bonusDiversite)

    // Nouvelles demandes (10% de l'impact)
    const creditsDerniersMois = credits.filter((credit: Credit) => {
      const dateDebut = new Date(credit.dateDebut)
      const troisMoisAvant = new Date()
      troisMoisAvant.setMonth(troisMoisAvant.getMonth() - 3)
      return dateDebut > troisMoisAvant
    }).length
    const malusNouvellesDemandes = Math.min(10, creditsDerniersMois * 3)
    console.log("Malus nouvelles demandes:", malusNouvellesDemandes)

    score += bonusHistorique + bonusUtilisation + bonusAnciennete + bonusDiversite - malusNouvellesDemandes
    score = Math.min(850, score)

    console.log("Score final calculé:", score)

    // Sauvegarde du score dans la base de données
    const { error } = await supabase
      .from('credit_scores')
      .upsert({
        user_id: userId,
        score,
        historique_bonus: bonusHistorique,
        utilisation_bonus: bonusUtilisation,
        anciennete_bonus: bonusAnciennete,
        diversite_bonus: bonusDiversite,
        nouvelles_demandes_malus: malusNouvellesDemandes
      })

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        score,
        details: {
          bonusHistorique,
          bonusUtilisation,
          bonusAnciennete,
          bonusDiversite,
          malusNouvellesDemandes
        }
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Erreur:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})