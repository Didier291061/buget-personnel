import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export interface Objective {
  id: number;
  nom: string;
  montantCible: number;
  montantActuel: number;
  dateObjectif: string;
}

export const useObjectives = () => {
  const { toast } = useToast();
  const [objectives, setObjectives] = useState<Objective[]>([]);

  // Charger les objectifs depuis le localStorage au montage
  useEffect(() => {
    const savedObjectives = localStorage.getItem("objectives");
    if (savedObjectives) {
      setObjectives(JSON.parse(savedObjectives));
    }
  }, []);

  // Sauvegarder les objectifs dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem("objectives", JSON.stringify(objectives));
  }, [objectives]);

  const addObjective = (newObjective: Omit<Objective, "id">) => {
    const objective = {
      ...newObjective,
      id: Date.now(),
    };
    setObjectives((prev) => [...prev, objective]);
    toast({
      title: "Objectif ajouté",
      description: "Votre nouvel objectif a été créé avec succès.",
    });
  };

  const updateObjective = (updatedObjective: Objective) => {
    setObjectives((prev) =>
      prev.map((obj) =>
        obj.id === updatedObjective.id ? updatedObjective : obj
      )
    );
    toast({
      title: "Objectif mis à jour",
      description: "Les modifications ont été enregistrées avec succès.",
    });
  };

  const deleteObjective = (id: number) => {
    setObjectives((prev) => prev.filter((obj) => obj.id !== id));
    toast({
      title: "Objectif supprimé",
      description: "L'objectif a été supprimé avec succès.",
    });
  };

  return {
    objectives,
    addObjective,
    updateObjective,
    deleteObjective,
  };
};