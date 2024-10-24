import { quotes } from "@/constans/quotes";
import { useTimer } from "@/hooks/use-timer";
import NumberFlow, { Format } from "@number-flow/react";
import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { variants } from "@/constans/variants";

interface TimeLeft {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

const Timer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  const {
    haveTarget,
    isNumbersAnimated,
    showQuote,
    message,
    showMilliseconds,
    date: target,
  } = useTimer();

  const quote = useMemo(() => {
    const today = new Date().getDate();
    return quotes[today % quotes.length];
  }, []);

  const calculateTimeLeft = (target: Date): TimeLeft => {
    const now = new Date();
    const difference = target.getTime() - now.getTime();

    if (difference <= 0) {
      return {
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      };
    }

    const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((difference / (1000 * 60 * 60 * 24 * 30)) % 12);
    const days = Math.floor((difference / (1000 * 60 * 60 * 24)) % 30);
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    const milliseconds = Math.floor(difference % 1000);

    return { years, months, days, hours, minutes, seconds, milliseconds };
  };

  useEffect(() => {
    if (!target) {
      setTimeLeft(null);
      return;
    }

    const intervalId = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(target);
      setTimeLeft(newTimeLeft);

      if (Object.values(newTimeLeft).every((value) => value === 0)) {
        clearInterval(intervalId);
      }
    }, 90);

    return () => clearInterval(intervalId);
  }, [target]);

  const timeUnits = useMemo(() => {
    if (!timeLeft) return [];
    return Object.entries(timeLeft).map(([unit, value]) => ({
      unit,
      value,
      format: {
        minimumIntegerDigits:
          unit === "milliseconds"
            ? 3
            : ["seconds", "minutes", "hours"].includes(unit)
            ? 2
            : undefined,
      } as Format,
    }));
  }, [timeLeft]);

  return (
    <div className="p-4 w-full">
      <AnimatePresence mode="sync">
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {!haveTarget ? (
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
              <p className="text-6xl font-bold">
                Welcome to the Chrono Catalyst
              </p>
              <p className="text-4xl mt-4">
                Set your target from settings to start the timer
              </p>
            </motion.div>
          ) : (
            timeLeft && (
              <>
                {showQuote && message.length === 0 && (
                  <motion.div
                    layoutId="quote"
                    key="quote"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center mb-8"
                  >
                    <h1 className="text-4xl font-bold mb-6">
                      Quote for the day!
                    </h1>
                    <p className="text-xl font-serif italic mb-4 leading-relaxed">
                      "{quote.quote}"
                    </p>
                    <p className="text-center font-semibold">
                      - {quote.author}
                    </p>
                  </motion.div>
                )}
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
                <motion.div
                  layoutId="time"
                  className="flex gap-5 justify-center flex-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {timeUnits.map(({ unit, value, format }, index) => {
                    if (unit === "milliseconds" && !showMilliseconds) {
                      return null;
                    }

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: -20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.1,
                        }}
                        layoutId={unit}
                        key={unit}
                        className="text-center w-16 sm:w-24 flex items-center flex-col justify-center"
                      >
                        <div className="text-2xl sm:text-6xl font-bold">
                          <NumberFlow
                            value={value}
                            format={format}
                            animated={isNumbersAnimated}
                          />
                        </div>
                        <div className="text-center w-full text-xs sm:text-sm capitalize text-muted-foreground mt-2">
                          {unit}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </>
            )
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Timer;
