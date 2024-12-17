import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Import, Plus, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TransactionSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNewTransaction: () => void;
}

export const TransactionSearch = ({ 
  searchQuery, 
  onSearchChange,
  onOpenNewTransaction 
}: TransactionSearchProps) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'budgetpersonnel.fun',
          text: 'Découvrez cette super application de gestion de budget !',
          url: window.location.href,
        });
        console.log('Contenu partagé avec succès');
      } catch (err) {
        console.log('Erreur lors du partage:', err);
      }
    } else {
      console.log('Le partage Web nest pas supporté sur ce navigateur');
    }
  };

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Rechercher des transactions..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Button variant="outline" size="icon" title="Filtrer">
          <Filter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" title="Importer">
          <Import className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          title="Partager"
          onClick={handleShare}
          className="hover:bg-blue-100 hover:text-blue-600 transition-colors"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button onClick={onOpenNewTransaction}>
            <Plus className="mr-2 h-4 w-4" /> Nouvelle Transaction
          </Button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
};