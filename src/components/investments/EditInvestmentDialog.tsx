import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface Investment {
  id: number;
  nom: string;
  montantInvesti: number;
  valeurActuelle: number;
  rendement: number;
  type: string;
}

interface EditInvestmentDialogProps {
  investment: Investment | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedInvestment: Investment) => void;
}

export const EditInvestmentDialog = ({
  investment,
  isOpen,
  onClose,
  onUpdate,
}: EditInvestmentDialogProps) => {
  const [editedInvestment, setEditedInvestment] = useState<Investment | null>(null);

  useEffect(() => {
    if (investment) {
      setEditedInvestment({ ...investment });
    }
  }, [investment]);

  if (!editedInvestment) return null;

  const handleUpdate = () => {
    onUpdate(editedInvestment);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'investissement</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom</label>
            <Input
              value={editedInvestment.nom}
              onChange={(e) =>
                setEditedInvestment({ ...editedInvestment, nom: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Montant investi</label>
            <Input
              type="number"
              value={editedInvestment.montantInvesti}
              onChange={(e) =>
                setEditedInvestment({
                  ...editedInvestment,
                  montantInvesti: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Valeur actuelle</label>
            <Input
              type="number"
              value={editedInvestment.valeurActuelle}
              onChange={(e) =>
                setEditedInvestment({
                  ...editedInvestment,
                  valeurActuelle: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <select
              className="w-full p-2 border rounded-md"
              value={editedInvestment.type}
              onChange={(e) =>
                setEditedInvestment({ ...editedInvestment, type: e.target.value })
              }
            >
              <option value="Actions">Actions</option>
              <option value="Obligations">Obligations</option>
              <option value="Immobilier">Immobilier</option>
              <option value="Crypto-monnaies">Crypto-monnaies</option>
              <option value="Matières premières">Matières premières</option>
            </select>
          </div>
          <Button onClick={handleUpdate} className="w-full">
            Mettre à jour l'investissement
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};