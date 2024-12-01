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
import { Target, Trophy, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Objective {
  id: number;
  nom: string;
  montantCible: number;
  montantActuel: number;
  dateObjectif: string;
}

const ObjectivesPanel = () => {
  const { toast } = useToast();
  const [objectives, setObjectives] = useState<Objective[]>([
    {
      id: 1,
      nom: "Achat Maison",
      montantCible: 50000,
      montantActuel: 15000,
      dateObjectif: "2024-12-31",
    },
    {
      id: 2,
      nom: "Voyage",
      montantCible: 5000,
      montantActuel: 2500,
      dateObjectif: "2024-06-30",
    },
    {
      id: 3,
      nom: "Fonds d'urgence",
      montantCible: 10000,
      montantActuel: 8000,
      dateObjectif: "2024-09-30",
    },
  ]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h3 className="mb-4 text-lg font-semibold">Objectifs en cours</h3>
          <div className="space-y-4">
            {objectives.map((objective) => (
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
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="mb-4 text-lg font-semibold">Objectifs atteints</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <Trophy className="h-8 w-8 text-green-500" />
              <div>
                <h4 className="font-medium">Nouveau PC</h4>
                <p className="text-sm text-muted-foreground">
                  Objectif atteint le 15/01/2024
                </p>
                <p className="text-sm font-medium text-green-600">
                  2 000,00 € économisés
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Liste des objectifs</h3>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nouvel Objectif
          </Button>
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