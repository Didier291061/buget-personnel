import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AlertSettings {
  enabled: boolean;
  threshold: number;
  pushNotifications: boolean;
  emailNotifications: boolean;
}

export const BudgetAlertSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AlertSettings>(() => {
    const saved = localStorage.getItem('budgetAlertSettings');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      threshold: 80,
      pushNotifications: true,
      emailNotifications: false
    };
  });

  const handleSave = () => {
    localStorage.setItem('budgetAlertSettings', JSON.stringify(settings));
    toast({
      title: "Paramètres sauvegardés",
      description: "Les paramètres d'alerte ont été mis à jour avec succès."
    });
  };

  return (
    <Card className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Paramètres des Alertes</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Activer les alertes</label>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(checked) => 
              setSettings({ ...settings, enabled: checked })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Seuil d'alerte (%)</label>
          <Input
            type="number"
            min="1"
            max="200"
            value={settings.threshold}
            onChange={(e) => 
              setSettings({ ...settings, threshold: Number(e.target.value) })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Notifications push</label>
          <Switch
            checked={settings.pushNotifications}
            onCheckedChange={(checked) => 
              setSettings({ ...settings, pushNotifications: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Notifications email</label>
          <Switch
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => 
              setSettings({ ...settings, emailNotifications: checked })
            }
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          <Bell className="mr-2 h-4 w-4" />
          Sauvegarder les paramètres
        </Button>
      </div>
    </Card>
  );
};