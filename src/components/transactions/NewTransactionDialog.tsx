import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    description: "",
    montant: 0,
    categorie: "Alimentation",
    creditId: ""
  });

  const handleSubmit = () => {
    if (newTransaction.description && newTransaction.montant !== 0) {
      onAddTransaction(newTransaction);
      setNewTransaction({
        date: new Date().toISOString().split('T')[0],
        description: "",
        montant: 0,
        categorie: "Alimentation",
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
            <label className="text-sm font-medium">Montant</label>
            <Input 
              type="number"
              value={newTransaction.montant}
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
              <option value="Alimentation">Alimentation</option>
              <option value="Transport">Transport</option>
              <option value="Loisirs">Loisirs</option>
              <option value="Revenu">Revenu</option>
              <option value="Crédit">Crédit</option>
            </select>
          </div>
          {newTransaction.categorie === "Crédit" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Crédit associé</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={newTransaction.creditId}
                onChange={(e) => setNewTransaction({...newTransaction, creditId: e.target.value})}
              >
                <option value="">Sélectionner un crédit</option>
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