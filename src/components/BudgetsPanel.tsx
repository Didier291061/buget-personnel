import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { BudgetCategoryManager } from "./budgets/BudgetCategoryManager";
import { BudgetChart } from "./budgets/BudgetChart";
import { BudgetAlerts } from "./budgets/BudgetAlerts";
import { BudgetAlertSettings } from "./budgets/BudgetAlertSettings";
import { BudgetTable } from "./budgets/BudgetTable";
import { useBudgetCategories } from "@/hooks/useBudgetCategories";
import { useTransactions } from "@/hooks/useTransactions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Budget {
  id: number;
  categorie: string;
  montantPrevu: number;
  montantDepense: number;
}

const BudgetsPanel = () => {
  const { toast } = useToast();
  const { categories } = useBudgetCategories();
  const { transactions, getTransactionsByCategory } = useTransactions();
  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('budgets');
    return saved ? JSON.parse(saved) : [];
  });

  const [newBudget, setNewBudget] = useState({
    categorie: categories[0]?.name || "",
    montantPrevu: 0
  });

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    // Mettre à jour les montants dépensés en fonction des transactions
    const updatedBudgets = budgets.map(budget => {
      const categoryTransactions = getTransactionsByCategory(budget.categorie);
      const totalSpent = categoryTransactions.reduce((sum, t) => sum + t.montant, 0);
      return { ...budget, montantDepense: totalSpent };
    });
    setBudgets(updatedBudgets);
  }, [transactions]);

  const addBudget = () => {
    if (newBudget.montantPrevu > 0) {
      const newId = budgets.length > 0 ? Math.max(...budgets.map(b => b.id)) + 1 : 1;
      setBudgets([...budgets, {
        id: newId,
        categorie: newBudget.categorie,
        montantPrevu: newBudget.montantPrevu,
        montantDepense: 0
      }]);
      toast({
        title: "Budget ajouté",
        description: `Un nouveau budget de ${newBudget.montantPrevu}€ a été créé pour la catégorie ${newBudget.categorie}.`
      });
    }
  };

  const deleteBudget = (id: number) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
    toast({
      title: "Budget supprimé",
      description: "Le budget a été supprimé avec succès."
    });
  };

  const editBudget = (budget: Budget) => {
    setBudgets(budgets.map(b => b.id === budget.id ? budget : b));
    toast({
      title: "Budget modifié",
      description: "Le budget a été modifié avec succès."
    });
  };

  const pieData = budgets.map((budget) => ({
    name: budget.categorie,
    value: budget.montantPrevu,
  }));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <BudgetChart data={pieData} />
        <div className="space-y-4">
          <BudgetAlerts budgets={budgets} />
          <BudgetAlertSettings />
        </div>
      </div>

      <BudgetCategoryManager />

      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Suivi des Budgets</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nouveau Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau budget</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Catégorie</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={newBudget.categorie}
                    onChange={(e) => setNewBudget({...newBudget, categorie: e.target.value})}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Montant prévu</label>
                  <Input 
                    type="number"
                    value={newBudget.montantPrevu}
                    onChange={(e) => setNewBudget({...newBudget, montantPrevu: parseFloat(e.target.value)})}
                  />
                </div>
                <Button onClick={addBudget} className="w-full">
                  Ajouter le budget
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <BudgetTable 
          budgets={budgets} 
          onDeleteBudget={deleteBudget}
          onEditBudget={editBudget}
        />
      </Card>
    </div>
  );
};

export default BudgetsPanel;