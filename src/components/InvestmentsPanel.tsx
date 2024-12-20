import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvestmentStats } from "./investments/InvestmentStats";
import { PerformanceChart } from "./investments/PerformanceChart";
import { CategoryManager } from "./investments/CategoryManager";
import { InvestmentList } from "./investments/InvestmentList";
import { EditInvestmentDialog } from "./investments/EditInvestmentDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { PrintButton } from "./ui/print-button";

interface Investment {
  id: number;
  nom: string;
  montantInvesti: number;
  valeurActuelle: number;
  rendement: number;
  type: string;
}

const InvestmentsPanel = () => {
  const { toast } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([
    {
      id: 1,
      nom: "Actions Tech",
      montantInvesti: 5000,
      valeurActuelle: 5800,
      rendement: 16,
      type: "Actions"
    },
    {
      id: 2,
      nom: "Obligations d'État",
      montantInvesti: 3000,
      valeurActuelle: 3150,
      rendement: 5,
      type: "Obligations"
    },
    {
      id: 3,
      nom: "Fonds Immobilier",
      montantInvesti: 4000,
      valeurActuelle: 4200,
      rendement: 5,
      type: "Immobilier"
    }
  ]);

  const [newInvestment, setNewInvestment] = useState({
    nom: "",
    montantInvesti: 0,
    type: "Actions"
  });

  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const addInvestment = () => {
    if (newInvestment.nom && newInvestment.montantInvesti > 0) {
      const newId = Math.max(...investments.map(i => i.id)) + 1;
      setInvestments([...investments, {
        id: newId,
        ...newInvestment,
        valeurActuelle: newInvestment.montantInvesti,
        rendement: 0
      }]);
      toast({
        title: "Investissement ajouté",
        description: `L'investissement "${newInvestment.nom}" a été ajouté avec succès.`
      });
    }
  };

  const deleteInvestment = (id: number) => {
    const investmentToDelete = investments.find(inv => inv.id === id);
    if (investmentToDelete) {
      setInvestments(investments.filter(inv => inv.id !== id));
      toast({
        title: "Investissement supprimé",
        description: `L'investissement "${investmentToDelete.nom}" a été supprimé avec succès.`
      });
    }
  };

  const handleEditInvestment = (investment: Investment) => {
    setSelectedInvestment(investment);
    setIsEditDialogOpen(true);
  };

  const updateInvestment = (updatedInvestment: Investment) => {
    setInvestments(investments.map(inv => 
      inv.id === updatedInvestment.id ? updatedInvestment : inv
    ));
    toast({
      title: "Investissement mis à jour",
      description: `L'investissement "${updatedInvestment.nom}" a été mis à jour avec succès.`
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Investissements</h2>
        <PrintButton title="Imprimer le rapport d'investissements" />
      </div>

      <InvestmentStats investments={investments} />

      <div className="grid gap-4 md:grid-cols-2">
        <PerformanceChart />
        <Card className="p-4">
          <h3 className="mb-4 text-lg font-semibold">Alertes et Opportunités</h3>
          <div className="space-y-4">
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">
                  Rééquilibrage recommandé
                </span>
              </div>
              <p className="mt-1 text-sm text-yellow-700">
                Votre allocation en actions est supérieure à votre objectif de 60%
              </p>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">
                  Opportunité d'investissement
                </span>
              </div>
              <p className="mt-1 text-sm text-green-700">
                Les marchés émergents présentent des valorisations attractives
              </p>
            </div>
          </div>
        </Card>
      </div>

      <CategoryManager />

      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Détail des Investissements</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <TrendingUp className="mr-2 h-4 w-4" /> Nouvel Investissement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un nouvel investissement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom</label>
                  <Input 
                    value={newInvestment.nom}
                    onChange={(e) => setNewInvestment({...newInvestment, nom: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Montant investi</label>
                  <Input 
                    type="number"
                    value={newInvestment.montantInvesti}
                    onChange={(e) => setNewInvestment({...newInvestment, montantInvesti: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={newInvestment.type}
                    onChange={(e) => setNewInvestment({...newInvestment, type: e.target.value})}
                  >
                    <option value="Actions">Actions</option>
                    <option value="Obligations">Obligations</option>
                    <option value="Immobilier">Immobilier</option>
                    <option value="Crypto-monnaies">Crypto-monnaies</option>
                    <option value="Matières premières">Matières premières</option>
                  </select>
                </div>
                <Button onClick={addInvestment} className="w-full">
                  Ajouter l'investissement
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <InvestmentList 
          investments={investments}
          onDeleteInvestment={deleteInvestment}
          onEditInvestment={handleEditInvestment}
        />
      </Card>

      <EditInvestmentDialog
        investment={selectedInvestment}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedInvestment(null);
        }}
        onUpdate={updateInvestment}
      />
    </div>
  );
};

export default InvestmentsPanel;
