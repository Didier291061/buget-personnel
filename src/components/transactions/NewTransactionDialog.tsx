import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useBudgetCategories } from "@/hooks/useBudgetCategories";

interface NewTransactionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTransaction: (transaction: any) => void;
  credits: any[];
}

export const NewTransactionDialog = ({
  isOpen,
  onOpenChange,
  onAddTransaction,
  credits
}: NewTransactionDialogProps) => {
  const { categories } = useBudgetCategories();
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    description: "",
    montant: 0,
    type: "depense", // nouveau champ pour le type
    categorie: categories[0]?.name || "Alimentation",
    creditId: ""
  });

  const handleSubmit = () => {
    if (newTransaction.description && newTransaction.montant !== 0) {
      // Ajuster le montant en fonction du type
      const montantFinal = newTransaction.type === "revenu" 
        ? Math.abs(newTransaction.montant) 
        : -Math.abs(newTransaction.montant);

      onAddTransaction({
        ...newTransaction,
        montant: montantFinal
      });
      
      setNewTransaction({
        date: new Date().toISOString().split('T')[0],
        description: "",
        montant: 0,
        type: "depense",
        categorie: categories[0]?.name || "Alimentation",
        creditId: ""
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input 
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input 
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Type de transaction</label>
            <select 
              className="w-full p-2 border rounded-md"
              value={newTransaction.type}
              onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
            >
              <option value="depense">Dépense</option>
              <option value="revenu">Revenu</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Montant</label>
            <Input 
              type="number"
              value={Math.abs(newTransaction.montant)}
              onChange={(e) => setNewTransaction({...newTransaction, montant: parseFloat(e.target.value)})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Catégorie</label>
            <select 
              className="w-full p-2 border rounded-md"
              value={newTransaction.categorie}
              onChange={(e) => setNewTransaction({...newTransaction, categorie: e.target.value})}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          {newTransaction.type === "depense" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Crédit associé (optionnel)</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={newTransaction.creditId}
                onChange={(e) => setNewTransaction({...newTransaction, creditId: e.target.value})}
              >
                <option value="">Aucun crédit</option>
                {credits.map((credit) => (
                  <option key={credit.id} value={credit.id}>
                    {credit.nom}
                  </option>
                ))}
              </select>
            </div>
          )}
          <Button onClick={handleSubmit} className="w-full">
            Ajouter la transaction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};