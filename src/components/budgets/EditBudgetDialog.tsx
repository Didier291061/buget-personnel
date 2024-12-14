import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBudgetCategories } from "@/hooks/useBudgetCategories";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Budget {
  id: number;
  categorie: string;
  montantPrevu: number;
  montantDepense: number;
}

interface EditBudgetDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  budget: Budget;
  onEditBudget: (budget: Budget) => void;
}

export const EditBudgetDialog = ({
  isOpen,
  onOpenChange,
  budget,
  onEditBudget,
}: EditBudgetDialogProps) => {
  const { categories } = useBudgetCategories();
  const [editedBudget, setEditedBudget] = useState(budget);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditBudget(editedBudget);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le budget</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Catégorie</label>
            <Select
              value={editedBudget.categorie}
              onValueChange={(value) =>
                setEditedBudget({ ...editedBudget, categorie: value })
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
            <label className="text-sm font-medium">Montant prévu</label>
            <Input
              type="number"
              value={editedBudget.montantPrevu}
              onChange={(e) =>
                setEditedBudget({
                  ...editedBudget,
                  montantPrevu: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <Button type="submit" className="w-full">
            Modifier le budget
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};