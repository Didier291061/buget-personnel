import { useState, useEffect } from 'react';
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

export const useBudgetCategories = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<BudgetCategory[]>(() => {
    const saved = localStorage.getItem('budgetCategories');
    return saved ? JSON.parse(saved) : defaultBudgetCategories;
  });

  useEffect(() => {
    localStorage.setItem('budgetCategories', JSON.stringify(categories));
  }, [categories]);

  const addCategory = (name: string) => {
    if (name.trim()) {
      const newId = (Math.max(...categories.map(c => parseInt(c.id))) + 1).toString();
      const newCategory = { id: newId, name: name.trim() };
      setCategories([...categories, newCategory]);
      toast({
        title: "Catégorie ajoutée",
        description: `La catégorie "${name}" a été ajoutée avec succès.`
      });
      return newCategory;
    }
  };

  const removeCategory = (id: string) => {
    const categoryToRemove = categories.find(c => c.id === id);
    if (categoryToRemove) {
      setCategories(categories.filter(c => c.id !== id));
      toast({
        title: "Catégorie supprimée",
        description: `La catégorie "${categoryToRemove.name}" a été supprimée.`
      });
    }
  };

  const updateCategory = (id: string, newName: string) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, name: newName } : cat
    ));
    toast({
      title: "Catégorie mise à jour",
      description: `La catégorie a été renommée en "${newName}".`
    });
  };

  return {
    categories,
    addCategory,
    removeCategory,
    updateCategory
  };
};