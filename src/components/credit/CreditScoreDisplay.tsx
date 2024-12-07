import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCredits } from "@/hooks/useCredits";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export const CreditScoreDisplay = () => {
  const { creditScore, scoreDetails, syncCreditScore } = useCredits();
  const maxScore = 850;
  const percentage = (creditScore / maxScore) * 100;

  const getScoreColor = (score: number) => {
    if (score >= 740) return "text-green-500";
    if (score >= 670) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Votre Score de Crédit</h3>
        <Button
          variant="outline"
          size="icon"
          onClick={syncCreditScore}
          title="Synchroniser le score"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className={`text-4xl font-bold ${getScoreColor(creditScore)}`}>
          {creditScore}
        </div>
        <Progress value={percentage} className="w-full" />
        <div className="text-sm text-muted-foreground">
          Score maximum : {maxScore}
        </div>
        {scoreDetails && (
          <div className="w-full space-y-2 mt-4 text-sm">
            <div className="flex justify-between">
              <span>Historique de paiement</span>
              <span className="font-medium">+{scoreDetails.bonusHistorique}</span>
            </div>
            <div className="flex justify-between">
              <span>Utilisation du crédit</span>
              <span className="font-medium">+{scoreDetails.bonusUtilisation}</span>
            </div>
            <div className="flex justify-between">
              <span>Ancienneté des comptes</span>
              <span className="font-medium">+{scoreDetails.bonusAnciennete}</span>
            </div>
            <div className="flex justify-between">
              <span>Diversité des crédits</span>
              <span className="font-medium">+{scoreDetails.bonusDiversite}</span>
            </div>
            <div className="flex justify-between">
              <span>Impact nouvelles demandes</span>
              <span className="font-medium text-red-500">-{scoreDetails.malusNouvellesDemandes}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};