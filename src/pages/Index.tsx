import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, BarChart, Target, CreditCard, TrendingUp, Settings } from "lucide-react";
import TransactionsPanel from "@/components/TransactionsPanel";
import BudgetsPanel from "@/components/BudgetsPanel";
import ObjectivesPanel from "@/components/ObjectivesPanel";
import InvestmentsPanel from "@/components/InvestmentsPanel";
import CreditPanel from "@/components/CreditPanel";
import SettingsPanel from "@/components/settings/SettingsPanel";

const Index = () => {
  const [activeTab, setActiveTab] = useState("transactions");

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Tableau de Bord</h1>
        
        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
            <TabsTrigger value="transactions" className="space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="budgets" className="space-x-2">
              <BarChart className="h-4 w-4" />
              <span>Budgets</span>
            </TabsTrigger>
            <TabsTrigger value="objectives" className="space-x-2">
              <Target className="h-4 w-4" />
              <span>Objectifs</span>
            </TabsTrigger>
            <TabsTrigger value="credit" className="space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Score Crédit</span>
            </TabsTrigger>
            <TabsTrigger value="investments" className="space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Investissements</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="space-x-2">
              <Settings className="h-4 w-4" />
              <span>Paramètres</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <TransactionsPanel />
          </TabsContent>
          
          <TabsContent value="budgets">
            <BudgetsPanel />
          </TabsContent>
          
          <TabsContent value="objectives">
            <ObjectivesPanel />
          </TabsContent>
          
          <TabsContent value="credit">
            <CreditPanel />
          </TabsContent>
          
          <TabsContent value="investments">
            <InvestmentsPanel />
          </TabsContent>
          
          <TabsContent value="settings">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;