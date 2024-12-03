import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const CreditScoreDisplay = () => {
  const creditScore = 750; // À remplacer par une vraie source de données
  const maxScore = 850;
  const percentage = (creditScore / maxScore) * 100;

  const getScoreColor = (score: number) => {
    if (score >= 740) return "text-green-500";
    if (score >= 670) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Votre Score de Crédit</h3>
      <div className="flex flex-col items-center gap-4">
        <div className={`text-4xl font-bold ${getScoreColor(creditScore)}`}>
          {creditScore}
        </div>
        <Progress value={percentage} className="w-full" />
        <div className="text-sm text-muted-foreground">
          Score maximum : {maxScore}
        </div>
      </div>
    </Card>
  );
};