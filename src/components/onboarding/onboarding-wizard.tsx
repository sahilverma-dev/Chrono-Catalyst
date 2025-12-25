import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { useTimer } from "@/hooks/use-timer";
import { DateTimePicker } from "../ui/datetime-picker";
import Countdown from "../countdown";

import { Label } from "../ui/label";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useTheme } from "../providers/theme-provider";
import {
  ArrowRightIcon,
  CheckIcon,
  MoonIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";

type Step =
  | "welcome"
  | "mode"
  | "setup"
  | "appearance"
  | "personalization"
  | "preferences"
  | "finish";

const OnboardingWizard = () => {
  const { theme, setTheme } = useTheme();
  const [step, setStep] = useState<Step>("welcome");
  const {
    handleCompleteOnboarding,
    mode,
    handleModeChange,
    date,
    handleDateChange,
    // Appearance
    color,
    handleColorChange,
    showGradient,
    handleShowGradientChange,
    // Personalization
    message,
    handleMessageChange,
    showQuote,
    handleShowQuoteChange,
    // Preferences
    showMilliseconds,
    handleShowMillisecondsChange,
    isNumbersAnimated,
    handleIsNumbersAnimatedChange,
  } = useTimer();

  const handleNext = () => {
    if (step === "welcome") setStep("mode");
    else if (step === "mode") setStep("setup");
    else if (step === "setup") setStep("appearance");
    else if (step === "appearance") setStep("personalization");
    else if (step === "personalization") setStep("preferences");
    else if (step === "preferences") setStep("finish");
    else if (step === "finish") handleCompleteOnboarding();
  };

  const handleSkip = () => {
    handleNext(); // Simply proceed to next step, effectively "using default" if nothing changed
  };

  const isNextDisabled = () => {
    if (step === "setup" && mode === "target" && !date) return true;
    return false;
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
                    {!date && (
                      <p className="text-sm text-destructive">
                        Please select a target date to continue.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-xl">Ready to flow?</p>
                    <p className="text-muted-foreground mt-2">
                      You can choose your focused duration from the main screen.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  size="lg"
                  onClick={handleNext}
                  className="w-full"
                  disabled={isNextDisabled()}
                >
                  Continue <ArrowRightIcon className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Appearance */}
          {step === "appearance" && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Make it yours</h2>
                <p className="text-muted-foreground">
                  Customize the look and feel
                </p>
              </div>

              <div className="space-y-6">
                {/* Theme */}
                <div className="flex items-center justify-between">
                  <Label>Theme</Label>
                  <ToggleGroup
                    type="single"
                    value={theme}
                    onValueChange={(val) =>
                      val && setTheme(val as "dark" | "light" | "system")
                    }
                  >
                    <ToggleGroupItem value="light" aria-label="Light">
                      <SunIcon />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="dark" aria-label="Dark">
                      <MoonIcon />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                {/* Color */}
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="color">Accent Color</Label>
                  <Input
                    id="color"
                    type="color"
                    value={color}
                    onChange={handleColorChange}
                    className="w-20 p-1 h-10"
                  />
                </div>

                {/* Gradient */}
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="wizard-gradient">Show BG gradient</Label>
                  <Switch
                    id="wizard-gradient"
                    checked={showGradient}
                    onCheckedChange={handleShowGradientChange}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <Button size="lg" onClick={handleNext} className="w-full">
                  Next <ArrowRightIcon className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="w-full text-muted-foreground"
                >
                  Skip (Use Default)
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Personalization */}
          {step === "personalization" && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Personal Touch</h2>
                <p className="text-muted-foreground">
                  Add a greeting and some inspiration
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="message">Welcome Greeting</Label>
                  <Input
                    id="message"
                    value={message}
                    onChange={(e) => handleMessageChange(e.target.value)}
                    placeholder="e.g. Hello, Focus Time!"
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="wiz-quote">Show Daily Quote</Label>
                  <Switch
                    id="wiz-quote"
                    checked={showQuote}
                    onCheckedChange={handleShowQuoteChange}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <Button size="lg" onClick={handleNext} className="w-full">
                  Next <ArrowRightIcon className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="w-full text-muted-foreground"
                >
                  Skip (Use Default)
                </Button>
              </div>
            </div>
          )}

          {/* Step 6: Preferences */}
          {step === "preferences" && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Almost there</h2>
                <p className="text-muted-foreground">
                  Fine-tune your experience
                </p>
              </div>

              <div className="flex justify-center scale-75 origin-top -mb-8">
                <Countdown
                  target={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                  showMilliseconds={showMilliseconds}
                  isNumbersAnimated={isNumbersAnimated}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="wiz-ms">Show Milliseconds</Label>
                  <Switch
                    id="wiz-ms"
                    checked={showMilliseconds}
                    onCheckedChange={handleShowMillisecondsChange}
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="wiz-anim">Animate Numbers</Label>
                  <Switch
                    id="wiz-anim"
                    checked={isNumbersAnimated}
                    onCheckedChange={handleIsNumbersAnimatedChange}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <Button size="lg" onClick={handleNext} className="w-full">
                  Finish Setup <CheckIcon className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="w-full text-muted-foreground"
                >
                  Skip (Use Default)
                </Button>
              </div>
            </div>
          )}

          {/* Step 7: Finish */}
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
