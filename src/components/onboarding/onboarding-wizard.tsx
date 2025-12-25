import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { useTimer } from "@/hooks/use-timer";
import { DateTimePicker } from "../ui/datetime-picker";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useTheme } from "../providers/theme-provider";
import { ArrowRightIcon, CheckIcon } from "@radix-ui/react-icons";

type Step = "welcome" | "mode" | "setup" | "finish";

const OnboardingWizard = () => {
  const { theme } = useTheme();
  const [step, setStep] = useState<Step>("welcome");
  const {
    handleCompleteOnboarding,
    mode,
    handleModeChange,
    date,
    handleDateChange,
    focusDuration,
    handleFocusDurationChange,
    focusLabel,
    handleFocusLabelChange,
  } = useTimer();

  const handleNext = () => {
    if (step === "welcome") setStep("mode");
    else if (step === "mode") setStep("setup");
    else if (step === "setup") setStep("finish");
    else if (step === "finish") handleCompleteOnboarding();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg p-8 mx-4 bg-card border rounded-xl shadow-2xl relative"
        >
          {/* Step 1: Welcome */}
          {step === "welcome" && (
            <div className="text-center space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">Welcome!</h1>
                <p className="text-muted-foreground text-lg">
                  to Chrono Catalyst
                </p>
              </div>
              <p className="text-lg">
                Your personal time companion for focused work and important
                deadlines.
              </p>
              <Button size="lg" onClick={handleNext} className="w-full text-lg">
                Get Started <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Step 2: Mode Selection */}
          {step === "mode" && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Choose your Style</h2>
                <p className="text-muted-foreground">
                  How do you want to track time?
                </p>
              </div>

              <ToggleGroup
                type="single"
                value={mode}
                onValueChange={(val) => {
                  if (val) handleModeChange(val as "target" | "focus");
                }}
                className="grid grid-cols-2 gap-4"
              >
                <ToggleGroupItem
                  value="target"
                  className="h-32 flex flex-col gap-2 border-2 border-muted data-[state=on]:border-primary hover:bg-muted/50"
                  aria-label="Target Date"
                >
                  <span className="text-3xl">📅</span>
                  <span className="font-semibold">Target Date</span>
                  <span className="text-xs text-muted-foreground">
                    Count down to a specific date
                  </span>
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="focus"
                  className="h-32 flex flex-col gap-2 border-2 border-muted data-[state=on]:border-primary hover:bg-muted/50"
                  aria-label="Flow Mode"
                >
                  <span className="text-3xl">🧘</span>
                  <span className="font-semibold">Flow Mode</span>
                  <span className="text-xs text-muted-foreground">
                    Focus sessions for deep work
                  </span>
                </ToggleGroupItem>
              </ToggleGroup>

              <Button size="lg" onClick={handleNext} className="w-full">
                Next <ArrowRightIcon className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Step 3: Setup */}
          {step === "setup" && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">
                  Let&apos;s set it up
                </h2>
                <p className="text-muted-foreground">
                  Configure your first timer
                </p>
              </div>

              <div className="space-y-4 py-4">
                {mode === "target" ? (
                  <div className="space-y-2">
                    <Label htmlFor="date">Select your Target Date</Label>
                    <DateTimePicker
                      id="date"
                      required
                      value={date}
                      placeholder="Pick your target date and time"
                      min={new Date()}
                      use12HourFormat
                      onChange={handleDateChange}
                      style={{
                        colorScheme: theme === "dark" ? "dark" : "light",
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="focus-duration">
                        Focus Duration (minutes)
                      </Label>
                      <Input
                        id="focus-duration"
                        type="number"
                        min={1}
                        value={focusDuration}
                        onChange={(e) =>
                          handleFocusDurationChange(Number(e.target.value))
                        }
                        className="text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="focus-label">Session Label</Label>
                      <Input
                        id="focus-label"
                        type="text"
                        value={focusLabel}
                        placeholder="e.g. Deep Work"
                        onChange={(e) => handleFocusLabelChange(e.target.value)}
                        className="text-lg"
                      />
                    </div>
                  </>
                )}
              </div>

              <Button size="lg" onClick={handleNext} className="w-full">
                Continue <ArrowRightIcon className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Step 4: Finish */}
          {step === "finish" && (
            <div className="text-center space-y-6">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <CheckIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  You&apos;re all set!
                </h2>
                <p className="text-muted-foreground">
                  You can always change these settings later by clicking the
                  settings icon.
                </p>
              </div>

              <Button size="lg" onClick={handleNext} className="w-full">
                Start Using App
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OnboardingWizard;
