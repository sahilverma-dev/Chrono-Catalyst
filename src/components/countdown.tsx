import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import TimerUnit from "./timer-unit";

interface CountdownProps {
  target: Date;
  showMilliseconds: boolean;
  isNumbersAnimated: boolean;
}

interface TimeLeft {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

const Countdown: React.FC<CountdownProps> = ({
  target,
  showMilliseconds,
  isNumbersAnimated,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

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
    }));
  }, [timeLeft]);

  if (!timeLeft) {
    return (
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
    );
  }

  return (
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
            t.value > 0 || t.unit === "seconds" || t.unit === "milliseconds"
        )
        .map(({ unit, value }, index) => {
          if (unit === "milliseconds" && !showMilliseconds) {
            return null;
          }

          return (
            <TimerUnit
              key={unit}
              value={value}
              unit={unit}
              index={index}
              animated={isNumbersAnimated}
            />
          );
        })}
    </motion.div>
  );
};

export default Countdown;
