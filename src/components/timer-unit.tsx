import NumberFlow, { Format } from "@number-flow/react";
import { motion } from "framer-motion";
import React from "react";

interface TimerUnitProps {
  value: number;
  unit: string;
  index: number;
  animated: boolean;
}

const TimerUnit = React.memo<TimerUnitProps>(
  ({ value, unit, index, animated }) => {
    const format: Format = React.useMemo(
      () => ({
        minimumIntegerDigits:
          unit === "milliseconds"
            ? 3
            : ["seconds", "minutes", "hours"].includes(unit)
            ? 2
            : undefined,
      }),
      [unit]
    );

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
        className="text-center w-16 sm:w-24 flex items-center flex-col justify-center"
      >
        <div className="text-2xl sm:text-6xl font-bold">
          <NumberFlow value={value} format={format} animated={animated} />
        </div>
        <div className="text-center w-full text-xs sm:text-sm capitalize text-muted-foreground mt-2">
          {unit}
        </div>
      </motion.div>
    );
  }
);

TimerUnit.displayName = "TimerUnit";

export default TimerUnit;
