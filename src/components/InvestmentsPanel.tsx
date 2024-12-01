import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, AlertTriangle, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Investment {
  id: number;
  nom: string;
  montantInvesti: number;
  valeurActuelle: number;
  rendement: number;
  type: string;
}

const performanceData = [
  { mois: "Jan", valeur: 10000 },
  { mois: "Fév", valeur: 11200 },
  { mois: "Mar", valeur: 10800 },
  { mois: "Avr", valeur: 12000 },
  { mois: "Mai", valeur: 12500 },
  { mois: "Juin", valeur: 13000 },
];

const InvestmentsPanel = () => {
  const [investments, setInvestments] = useState<Investment[]>([
    {
      id: 1,
      nom: "Actions Tech",
      montantInvesti: 5000,
      valeurActuelle: 5800,
      rendement: 16,
      type: "Actions"
    },
    {
      id: 2,
      nom: "Obligations d'État",
      montantInvesti: 3000,
      valeurActuelle: 3150,
      rendement: 5,
      type: "Obligations"
    },
    {
      id: 3,
      nom: "Fonds Immobilier",
      montantInvesti: 4000,
      valeurActuelle: 4200,
      rendement: 5,
      type: "Immobilier"
    }
  ]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-green-100 p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Valeur Totale</p>
              <h3 className="text-2xl font-bold">
                {investments
                  .reduce((acc, inv) => acc + inv.valeurActuelle, 0)
                  .toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-blue-100 p-3">
              <PieChart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Rendement Moyen</p>
              <h3 className="text-2xl font-bold">
                {(
                  investments.reduce((acc, inv) => acc + inv.rendement, 0) /
                  investments.length
                ).toFixed(1)}
                %
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-yellow-100 p-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Plus-value Latente</p>
              <h3 className="text-2xl font-bold">
                {(
                  investments.reduce(
                    (acc, inv) => acc + (inv.valeurActuelle - inv.montantInvesti),
                    0
                  )
                ).toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                })}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h3 className="mb-4 text-lg font-semibold">Performance du Portefeuille</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="valeur"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="mb-4 text-lg font-semibold">Alertes et Opportunités</h3>
          <div className="space-y-4">
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">
                  Rééquilibrage recommandé
                </span>
              </div>
              <p className="mt-1 text-sm text-yellow-700">
                Votre allocation en actions est supérieure à votre objectif de 60%
              </p>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">
                  Opportunité d'investissement
                </span>
              </div>
              <p className="mt-1 text-sm text-green-700">
                Les marchés émergents présentent des valorisations attractives
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Détail des Investissements</h3>
          <Button>
            <TrendingUp className="mr-2 h-4 w-4" /> Nouvel Investissement
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Montant Investi</TableHead>
                <TableHead>Valeur Actuelle</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.map((investment) => (
                <TableRow key={investment.id}>
                  <TableCell className="font-medium">{investment.nom}</TableCell>
                  <TableCell>{investment.type}</TableCell>
                  <TableCell>
                    {investment.montantInvesti.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </TableCell>
                  <TableCell>
                    {investment.valeurActuelle.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={investment.rendement}
                        className="w-full"
                      />
                      <span
                        className={`min-w-[3rem] text-sm ${
                          investment.rendement >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {investment.rendement}%
                      </span>
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

export default InvestmentsPanel;