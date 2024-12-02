import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export interface BudgetCategory {
  id: string;
  name: string;
}

export const defaultBudgetCategories: BudgetCategory[] = [
  { id: "1", name: "Alimentation" },
  { id: "2", name: "Transport" },
  { id: "3", name: "Loisirs" },
  { id: "4", name: "Logement" },
  { id: "5", name: "Santé" }
];

export const BudgetCategoryManager = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<BudgetCategory[]>(defaultBudgetCategories);
  const [newCategory, setNewCategory] = useState("");

  const addCategory = () => {
    if (newCategory.trim()) {
      const newId = (Math.max(...categories.map(c => parseInt(c.id))) + 1).toString();
      setCategories([...categories, { id: newId, name: newCategory.trim() }]);
      setNewCategory("");
      toast({
        title: "Catégorie ajoutée",
        description: `La catégorie "${newCategory}" a été ajoutée avec succès.`
      });
    }
  };

  const removeCategory = (id: string) => {
    const categoryToRemove = categories.find(c => c.id === id);
    setCategories(categories.filter(c => c.id !== id));
    toast({
      title: "Catégorie supprimée",
      description: `La catégorie "${categoryToRemove?.name}" a été supprimée.`
    });
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Gestion des Catégories</h3>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Nouvelle catégorie..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addCategory()}
          />
          <Button onClick={addCategory}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
            >
              <span>{category.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCategory(category.id)}
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};