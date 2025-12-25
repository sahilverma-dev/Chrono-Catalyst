import Timer from "./components/timer";
import Header from "./components/header";
import { useTimer } from "./hooks/use-timer";
import { cn } from "./lib/utils";
import OnboardingWizard from "./components/onboarding/onboarding-wizard";
import SettingSheet from "./components/setting-sheet";

const App = () => {
  const {
    color,
    isColorAnimated,
    isOnboardingCompleted,
    isSettingsOpen,
    handleSettingsOpenChange,
  } = useTimer();
  return (
    <div className="w-full h-dvh flex items-center justify-center relative">
      <div
        className={cn(
          "absolute inset-0 -z-[10] h-full w-full items-center",
          isColorAnimated && "animate-color"
        )}
        style={{
          background: `radial-gradient(125% 125% at 50% 10%, #00000000 40%, ${color} 100%)`,
        }}
      />
      {!isOnboardingCompleted && <OnboardingWizard />}
      <SettingSheet
        open={isSettingsOpen}
        onOpenChange={handleSettingsOpenChange}
      />
      <Header />
      <Timer />
    </div>
  );
};

export default App;
