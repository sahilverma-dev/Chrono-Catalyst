import { quotes } from "@/constans/quotes";
import { useTimer } from "@/hooks/use-timer";
import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { variants } from "@/constans/variants";
import Countdown from "./countdown";
import { Button } from "./ui/button";
import {
  PauseIcon,
  PlayIcon,
  ReloadIcon,
  ResetIcon,
} from "@radix-ui/react-icons";

const Timer: React.FC = () => {
  const {
    haveTarget,
    isNumbersAnimated,
    showQuote,
    message,
    showMilliseconds,
    date: target,
    mode,
    focusLabel,
    focusRemaining,
    focusStatus,
    focusEndTime,
    quoteIndex,
    handleStartFocus,
    handlePauseFocus,
    handleResetFocus,
    handleRefeshQuote,
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
              <p className="text-sm lg:text-4xl mt-2 md:mt-4">
                Set your target from settings to start the timer
              </p>
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

              {/* Focus Mode Header */}
              {isFlowMode && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-4"
                >
                  <h2 className="text-3xl font-bold text-primary">
                    {focusLabel}
                  </h2>
                </motion.div>
              )}

              {/* Countdown Timer */}
              {(isFlowMode || target) && (
                <Countdown
                  target={isFlowMode ? focusTarget : target!}
                  showMilliseconds={showMilliseconds}
                  isNumbersAnimated={isNumbersAnimated}
                />
              )}

              {/* Focus Mode Controls */}
              {isFlowMode && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center gap-4 mt-8"
                >
                  {focusStatus === "running" ? (
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handlePauseFocus}
                      className="gap-2"
                    >
                      <PauseIcon className="w-5 h-5" /> Pause
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={handleStartFocus}
                      className="gap-2"
                    >
                      <PlayIcon className="w-5 h-5" />{" "}
                      {focusStatus === "paused" ? "Resume" : "Start"}
                    </Button>
                  )}
                  <Button
                    size="lg"
                    variant="ghost"
                    onClick={handleResetFocus}
                    disabled={focusStatus === "idle"}
                    className="gap-2"
                  >
                    <ResetIcon className="w-5 h-5" /> Reset
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Timer;
