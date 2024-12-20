import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface PrintButtonProps {
  title?: string;
}

export const PrintButton = ({ title = "Imprimer" }: PrintButtonProps) => {
  const { toast } = useToast();

  const handlePrint = () => {
    toast({
      title: "Impression en cours",
      description: "La fenêtre d'impression va s'ouvrir."
    });
    window.print();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePrint}
      className="print:hidden"
    >
      <Printer className="h-4 w-4 mr-2" />
      {title}
    </Button>
  );
};