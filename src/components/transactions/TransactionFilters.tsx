import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransactionFiltersProps {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  sortField: "date" | "montant" | "categorie";
  setSortField: (field: "date" | "montant" | "categorie") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  monthOptions: string[];
  onExport: () => void;
}

export const TransactionFilters = ({
  selectedMonth,
  setSelectedMonth,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  monthOptions,
  onExport
}: TransactionFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between">
      <div className="flex gap-4">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner un mois" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les transactions</SelectItem>
            {monthOptions.map(month => (
              <SelectItem key={month} value={month}>
                {new Date(month + "-01").toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long"
                })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortField} onValueChange={(value: "date" | "montant" | "categorie") => setSortField(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="montant">Montant</SelectItem>
            <SelectItem value="categorie">Catégorie</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Croissant</SelectItem>
            <SelectItem value="desc">Décroissant</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" onClick={onExport}>
        <Download className="mr-2 h-4 w-4" />
        Exporter
      </Button>
    </div>
  );
};