import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock } from "lucide-react";
import ProfileSettings from "./ProfileSettings";
import PasswordSettings from "./PasswordSettings";
import { useToast } from "@/components/ui/use-toast";

const SettingsPanel = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Paramètres</h2>
      
      <Tabs defaultValue="profile" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile" className="space-x-2">
            <User className="h-4 w-4" />
            <span>Profil</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="space-x-2">
            <Lock className="h-4 w-4" />
            <span>Mot de passe</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>
        
        <TabsContent value="password">
          <PasswordSettings />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default SettingsPanel;