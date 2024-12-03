import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Target, Trophy, Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useObjectives } from "@/hooks/useObjectives";

const ObjectivesPanel = () => {
  const { objectives, addObjective, updateObjective, deleteObjective } = useObjectives();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<any>(null);
  const [formData, setFormData] = useState({
    nom: "",
    montantCible: 0,
    montantActuel: 0,
    dateObjectif: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = () => {
    if (editingObjective) {
      updateObjective({ ...formData, id: editingObjective.id });
    } else {
      addObjective(formData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (objective: any) => {
    setEditingObjective(objective);
    setFormData({
      nom: objective.nom,
      montantCible: objective.montantCible,
      montantActuel: objective.montantActuel,
      dateObjectif: objective.dateObjectif,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      montantCible: 0,
      montantActuel: 0,
      dateObjectif: new Date().toISOString().split("T")[0],
    });
    setEditingObjective(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet objectif ?")) {
      deleteObjective(id);
    }
  };

  const achievedObjectives = objectives.filter(
    (obj) => obj.montantActuel >= obj.montantCible
  );
  const ongoingObjectives = objectives.filter(
    (obj) => obj.montantActuel < obj.montantCible
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h3 className="mb-4 text-lg font-semibold">Objectifs en cours</h3>
          <div className="space-y-4">
            {ongoingObjectives.map((objective) => (
              <div
                key={objective.id}
                className="flex items-center gap-4 rounded-lg border p-4"
              >
                <Target className="h-8 w-8 text-blue-500" />
                <div className="flex-1">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-medium">{objective.nom}</h4>
                    <span className="text-sm text-muted-foreground">
                      Échéance : {new Date(objective.dateObjectif).toLocaleDateString()}
                    </span>
                  </div>
                  <Progress
                    value={(objective.montantActuel / objective.montantCible) * 100}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm">
                    <span>
                      {objective.montantActuel.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </span>
                    <span className="text-muted-foreground">
                      {objective.montantCible.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(objective)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(objective.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="mb-4 text-lg font-semibold">Objectifs atteints</h3>
          <div className="space-y-4">
            {achievedObjectives.map((objective) => (
              <div
                key={objective.id}
                className="flex items-center gap-4 rounded-lg border p-4"
              >
                <Trophy className="h-8 w-8 text-green-500" />
                <div className="flex-1">
                  <h4 className="font-medium">{objective.nom}</h4>
                  <p className="text-sm text-muted-foreground">
                    Objectif atteint le{" "}
                    {new Date(objective.dateObjectif).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-medium text-green-600">
                    {objective.montantCible.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}{" "}
                    économisés
                  </p>
                  <div className="mt-2 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(objective.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Liste des objectifs</h3>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nouvel Objectif
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingObjective ? "Modifier l'objectif" : "Nouvel objectif"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nom</label>
                  <Input
                    value={formData.nom}
                    onChange={(e) =>
                      setFormData({ ...formData, nom: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Montant cible</label>
                  <Input
                    type="number"
                    value={formData.montantCible}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        montantCible: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Montant actuel</label>
                  <Input
                    type="number"
                    value={formData.montantActuel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        montantActuel: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Date objectif</label>
                  <Input
                    type="date"
                    value={formData.dateObjectif}
                    onChange={(e) =>
                      setFormData({ ...formData, dateObjectif: e.target.value })
                    }
                  />
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  {editingObjective ? "Modifier" : "Ajouter"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Montant cible</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Date objectif</TableHead>
                <TableHead>État</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {objectives.map((objective) => (
                <TableRow key={objective.id}>
                  <TableCell className="font-medium">{objective.nom}</TableCell>
                  <TableCell>
                    {objective.montantCible.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={(objective.montantActuel / objective.montantCible) * 100}
                        className="w-full"
                      />
                      <span className="min-w-[3rem] text-sm">
                        {Math.round(
                          (objective.montantActuel / objective.montantCible) * 100
                        )}
                        %
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(objective.dateObjectif).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {objective.montantActuel >= objective.montantCible ? (
                      <span className="text-green-600">Atteint</span>
                    ) : (
                      <span className="text-blue-600">En cours</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(objective)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(objective.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default ObjectivesPanel;