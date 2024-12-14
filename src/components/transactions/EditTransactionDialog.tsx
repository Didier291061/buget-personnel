import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Transaction } from "@/hooks/useTransactions";
import { useBudgetCategories } from "@/hooks/useBudgetCategories";

interface EditTransactionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction;
  onEditTransaction: (transaction: Transaction) => void;
  credits: any[];
}

export const EditTransactionDialog = ({
  isOpen,
  onOpenChange,
  transaction,
  onEditTransaction,
  credits,
}: EditTransactionDialogProps) => {
  const { categories } = useBudgetCategories();
  const [editedTransaction, setEditedTransaction] = useState<Transaction>(transaction);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting edited transaction:", editedTransaction);
    onEditTransaction(editedTransaction);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={editedTransaction.date}
              onChange={(e) =>
                setEditedTransaction({ ...editedTransaction, date: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              value={editedTransaction.description}
              onChange={(e) =>
                setEditedTransaction({
                  ...editedTransaction,
                  description: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Montant</label>
            <Input
              type="number"
              value={Math.abs(editedTransaction.montant)}
              onChange={(e) =>
                setEditedTransaction({
                  ...editedTransaction,
                  montant:
                    parseFloat(e.target.value) *
                    (editedTransaction.montant < 0 ? -1 : 1),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select
              value={editedTransaction.montant >= 0 ? "revenu" : "depense"}
              onValueChange={(value) =>
                setEditedTransaction({
                  ...editedTransaction,
                  montant: Math.abs(editedTransaction.montant) * (value === "depense" ? -1 : 1),
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenu">Revenu</SelectItem>
                <SelectItem value="depense">Dépense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Catégorie</label>
            <Select
              value={editedTransaction.categorie}
              onValueChange={(value) =>
                setEditedTransaction({ ...editedTransaction, categorie: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Crédit associé</label>
            <Select
              value={editedTransaction.creditId?.toString() || ""}
              onValueChange={(value) =>
                setEditedTransaction({ ...editedTransaction, creditId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Aucun crédit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucun crédit</SelectItem>
                {credits.map((credit) => (
                  <SelectItem key={credit.id} value={credit.id.toString()}>
                    {credit.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Modifier la transaction
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};