import { quotes } from "@/constans/quotes";
import { useTimer } from "@/hooks/use-timer";
import { Format } from "@number-flow/react";
import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { variants } from "@/constans/variants";
import TimerUnit from "./timer-unit";

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

    const newTimeLeft = calculateTimeLeft(target);
    if (Object.values(newTimeLeft).every((value) => value === 0)) {
      setTimeLeft(null);
      return;
    }
    setTimeLeft(newTimeLeft);

    const intervalId = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(target);
      if (Object.values(newTimeLeft).every((value) => value === 0)) {
        setTimeLeft(null);
        clearInterval(intervalId);
        return;
      }
      setTimeLeft(newTimeLeft);

      if (Object.values(newTimeLeft).every((value) => value === 0)) {
        clearInterval(intervalId);
      }
    }, 69);

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
    <div className="p-2 lg:p-4 w-full">
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
              <p className="text-2xl lg:text-6xl font-bold">
                Welcome to the Chrono Catalyst
              </p>
              <p className="text-sm lg:text-4xl mt-2 md:mt-4">
                Set your target from settings to start the timer
              </p>
            </motion.div>
          ) : timeLeft ? (
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
                  <p className="text-center font-semibold">- {quote.author}</p>
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
                {timeUnits
                  .filter(
                    (t) =>
                      t.value > 0 ||
                      t.unit === "seconds" ||
                      t.unit === "milliseconds"
                  )
                  .map(({ unit, value, format }, index) => {
                    if (unit === "milliseconds" && !showMilliseconds) {
                      return null;
                    }

                    return (
                      <TimerUnit
                        key={unit}
                        value={value}
                        unit={unit}
                        format={format}
                        index={index}
                        animated={isNumbersAnimated}
                      />
                    );
                  })}
              </motion.div>
            </>
          ) : (
            <motion.div
              layout
              layoutId="completed"
              key="completed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <p className="text-6xl font-bold">Time Completed!</p>
              <p className="text-xl mt-4 text-muted-foreground">
                I hope you your target was met, now let&apos;s set another one.
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Timer;
