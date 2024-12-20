import { CreditScoreDisplay } from "./credit/CreditScoreDisplay";
import { CreditHistory } from "./credit/CreditHistory";
import { CreditFactors } from "./credit/CreditFactors";
import { CreditTips } from "./credit/CreditTips";
import { CreditManager } from "./credit/CreditManager";
import { PrintButton } from "./ui/print-button";

const CreditPanel = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Crédit</h2>
        <PrintButton title="Imprimer le rapport de crédit" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CreditScoreDisplay />
        <CreditHistory />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <CreditFactors />
        <CreditTips />
      </div>
      <CreditManager />
    </div>
  );
};

export default CreditPanel;