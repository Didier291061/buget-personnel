import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { DollarSign, Filter, Import, Plus } from "lucide-react";

interface Transaction {
  id: number;
  date: string;
  description: string;
  montant: number;
  categorie: string;
}

const TransactionsPanel = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      date: "2024-02-20",
      description: "Courses Supermarché",
      montant: -85.50,
      categorie: "Alimentation"
    },
    {
      id: 2,
      date: "2024-02-19",
      description: "Salaire",
      montant: 2500,
      categorie: "Revenu"
    }
  ]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-green-100 p-3">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Solde Total</p>
              <h3 className="text-2xl font-bold">2,414.50 €</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-1 items-center space-x-2">
            <Input
              placeholder="Rechercher des transactions..."
              className="max-w-sm"
            />
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Import className="h-4 w-4" />
            </Button>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nouvelle Transaction
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Montant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.categorie}</TableCell>
                  <TableCell className={`text-right ${
                    transaction.montant >= 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {transaction.montant.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR"
                    })}
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

export default TransactionsPanel;