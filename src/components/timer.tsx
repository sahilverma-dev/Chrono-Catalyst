import { quotes } from "@/constans/quotes";
import { useTimer } from "@/hooks/use-timer";
import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { variants } from "@/constans/variants";
import Countdown from "./countdown";
import { Button } from "./ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

const Timer: React.FC = () => {
  const {
    haveTarget,
    isNumbersAnimated,
    showQuote,
    message,
    showMilliseconds,
    date: target,
    mode,
    focusRemaining,
    focusStatus,
    focusEndTime,
    quoteIndex,
    handleStartFocus,
    handleResetFocus,
    handleRefeshQuote,
    handleSettingsOpenChange,
    handleFocusDurationChange,
  } = useTimer();

  const quote = useMemo(() => {
    if (quoteIndex > -1) {
      return quotes[quoteIndex];
    }
    const today = new Date().getDate();
    return quotes[today % quotes.length];
  }, [quoteIndex]);

  // Calculate target for Focus Mode
  const focusTarget = useMemo(() => {
    if (focusStatus === "running" && focusEndTime) {
      return new Date(focusEndTime);
    }
    return new Date(Date.now() + focusRemaining);
  }, [focusStatus, focusEndTime, focusRemaining]);

  const isFlowMode = mode === "focus";
  const showTimer = isFlowMode || (haveTarget && target);

  return (
    <div className="p-2 lg:p-4 w-full">
      <AnimatePresence mode="sync">
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Welcome Screen for Target Mode only */}
          {!showTimer && !isFlowMode ? (
            <motion.div
              layoutId="welcome"
              variants={variants}
              key="welcome"
              initial="enter"
              animate="center"
              exit="exit"
              className="text-center"
              transition={{
                opacity: { ease: "linear" },
                layout: { duration: 0.3 },
              }}
            >
              <p className="text-2xl lg:text-6xl font-bold">
                Welcome to the Chrono Catalyst
              </p>
              <p className="text-sm lg:text-4xl mt-2 md:mt-4 mb-6">
                Set your target from settings to start the timer
              </p>
              <Button
                size={"lg"}
                variant={"secondary"}
                onClick={() => handleSettingsOpenChange(true)}
                className="md:text-2xl md:py-7 rounded-2xl"
              >
                Set Now
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Quote Section */}
              {showQuote && message.length === 0 && (
                <motion.div
                  layoutId="quote"
                  key="quote"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center mb-8 relative group"
                >
                  <h1 className="text-4xl font-bold mb-6 flex items-center justify-center gap-4">
                    Quote for the day!
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRefeshQuote}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ReloadIcon className="w-5 h-5" />
                    </Button>
                  </h1>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={quote.quote}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-xl font-serif italic mb-4 leading-relaxed">
                        "{quote.quote}"
                      </p>
                      <p className="text-center font-semibold">
                        - {quote.author}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Custom Message */}
              {message.length > 0 && (
                <motion.div
                  layoutId="message"
                  key="message"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center text-2xl mb-8 w-full max-w-2xl mx-auto"
                >
                  {message}
                </motion.div>
              )}

              {/* Countdown Timer */}
              {(isFlowMode || target) &&
                (focusStatus === "running" || mode === "target") && (
                  <div className="relative">
                    <Countdown
                      target={isFlowMode ? focusTarget : target!}
                      showMilliseconds={showMilliseconds}
                      isNumbersAnimated={isNumbersAnimated}
                    />
                    {isFlowMode && (
                      <div className="flex justify-center mt-8">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleResetFocus}
                          className="rounded-full hover:bg-destructive/10 hover:text-destructive w-12 h-12"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </Button>
                      </div>
                    )}
                  </div>
                )}

              {/* Focus Mode Presets (Idle State) */}
              {isFlowMode && focusStatus === "idle" && (
                <div className="flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    {[25, 40, 60, 120].map((mins) => (
                      <Button
                        key={mins}
                        variant="outline"
                        className="h-24 text-2xl font-light hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          handleFocusDurationChange(mins);
                          // We need to wait for state update or use a ref/effect,
                          // but simpler is to queue the start
                          setTimeout(handleStartFocus, 0);
                        }}
                      >
                        {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Timer;
