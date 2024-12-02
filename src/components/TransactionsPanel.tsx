import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { DollarSign, Filter, Import, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTransactions } from "@/hooks/useTransactions";

const TransactionsPanel = () => {
  const { transactions, addTransaction, removeTransaction } = useTransactions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    description: "",
    montant: 0,
    categorie: "Alimentation"
  });

  const handleAddTransaction = () => {
    if (newTransaction.description && newTransaction.montant !== 0) {
      addTransaction(newTransaction);
      setIsDialogOpen(false);
      setNewTransaction({
        date: new Date().toISOString().split('T')[0],
        description: "",
        montant: 0,
        categorie: "Alimentation"
      });
    }
  };

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
              <h3 className="text-2xl font-bold">
                {transactions.reduce((acc, curr) => acc + curr.montant, 0).toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR"
                })}
              </h3>
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nouvelle Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle transaction</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input 
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input 
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Montant</label>
                  <Input 
                    type="number"
                    value={newTransaction.montant}
                    onChange={(e) => setNewTransaction({...newTransaction, montant: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Catégorie</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={newTransaction.categorie}
                    onChange={(e) => setNewTransaction({...newTransaction, categorie: e.target.value})}
                  >
                    <option value="Alimentation">Alimentation</option>
                    <option value="Transport">Transport</option>
                    <option value="Loisirs">Loisirs</option>
                    <option value="Revenu">Revenu</option>
                  </select>
                </div>
                <Button onClick={handleAddTransaction} className="w-full">
                  Ajouter la transaction
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead>Actions</TableHead>
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
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeTransaction(transaction.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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