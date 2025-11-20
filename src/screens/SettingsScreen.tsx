import { useState } from "react";
import {
  User,
  Bell,
  DollarSign,
  Globe,
  HelpCircle,
  Mail,
  LogOut,
  ChevronRight
} from "lucide-react";
import { TopBar } from "../components/TopBar";
import { NavigationDrawer } from "../components/NavigationDrawer";

interface SettingsScreenProps {
  onThemeToggle: () => void;
  onNavigate: (screen: "home" | "cuentas" | "categorias" | "settings") => void;
  isDark: boolean;
}

interface SettingOption {
  id: string;
  label: string;
  icon: typeof User;
  value?: string;
  onClick: () => void;
}

export function SettingsScreen({
  onThemeToggle,
  onNavigate,
  isDark
}: SettingsScreenProps) {
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);

  const handleOptionClick = (optionId: string) => {
    // TODO: Implementar navegación a cada opción
    console.log("Option clicked:", optionId);
  };

  const handleSignOut = () => {
    // TODO: Implementar lógica de sign out
    console.log("Sign out clicked");
  };

  const settingOptions: SettingOption[] = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
      value: "John Doe",
      onClick: () => handleOptionClick("profile"),
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      onClick: () => handleOptionClick("notifications"),
    },
    {
      id: "currency",
      label: "Currency",
      icon: DollarSign,
      value: "USD ($)",
      onClick: () => handleOptionClick("currency"),
    },
    {
      id: "language",
      label: "Language",
      icon: Globe,
      value: "Español",
      onClick: () => handleOptionClick("language"),
    },
    {
      id: "help",
      label: "Help",
      icon: HelpCircle,
      onClick: () => handleOptionClick("help"),
    },
    {
      id: "contact",
      label: "Contact",
      icon: Mail,
      onClick: () => handleOptionClick("contact"),
    },
  ];

  return (
    <div className="min-h-screen bg-bg flex flex-col max-w-[390px] mx-auto relative">
      <TopBar
        variant="simple"
        onThemeToggle={onThemeToggle}
        onMenuClick={() => setIsNavDrawerOpen(true)}
        isDark={isDark}
      />

      {/* Navigation Drawer */}
      <NavigationDrawer
        isOpen={isNavDrawerOpen}
        onClose={() => setIsNavDrawerOpen(false)}
        onNavigate={onNavigate}
        activeScreen="settings"
      />

      <div
        className="flex-1 overflow-y-auto pb-[100px] px-4"
        style={{ scrollbarGutter: 'stable' }}
      >
        <div className="space-y-4">
          {/* Page Title */}
          <div className="pb-2">
            <h1 className="text-[24px] leading-[32px] text-text-primary">
              Ajustes
            </h1>
            <p className="text-[14px] leading-[20px] text-text-secondary mt-1">
              Configura tu cuenta y preferencias
            </p>
          </div>

          {/* Settings List */}
          <div className="pb-4">
            <div className="bg-card-custom rounded-2xl border border-divider overflow-hidden shadow-sm">
              <div className="divide-y divide-divider">
                {settingOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={option.onClick}
                      className="w-full flex items-center gap-3 p-4 hover:bg-surface/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-brand" />
                      </div>

                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-[16px] leading-[24px] text-text-primary">
                          {option.label}
                        </p>
                        {option.value && (
                          <p className="text-[12px] leading-[16px] text-text-secondary mt-0.5">
                            {option.value}
                          </p>
                        )}
                      </div>

                      <ChevronRight className="w-5 h-5 text-text-secondary flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="pb-4">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 bg-destructive text-white rounded-2xl p-4 hover:bg-destructive/90 transition-colors shadow-sm"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-[16px] leading-[24px] font-medium">
                Sign Out
              </span>
            </button>
          </div>

          {/* App Version */}
          <div className="pb-4">
            <p className="text-[12px] leading-[16px] text-text-secondary text-center">
              PAIFinance v1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}