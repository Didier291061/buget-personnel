import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface PrintButtonProps {
  title?: string;
}

export const PrintButton = ({ title = "Imprimer" }: PrintButtonProps) => {
  const handlePrint = () => {
    try {
      window.print();
      toast({
        title: "Impression lancée",
        description: "La fenêtre d'impression va s'ouvrir."
      });
    } catch (error) {
      toast({
        title: "Erreur d'impression",
        description: "Une erreur est survenue lors de l'impression.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handlePrint}
      className="hover:bg-blue-100 hover:text-blue-600 transition-colors print:hidden"
      title={title}
    >
      <Printer className="h-4 w-4" />
    </Button>
  );
};