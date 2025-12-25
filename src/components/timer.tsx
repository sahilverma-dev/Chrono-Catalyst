import { quotes } from "@/constans/quotes";
import { useTimer } from "@/hooks/use-timer";
import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { variants } from "@/constans/variants";
import Countdown from "./countdown";

const Timer: React.FC = () => {
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
          ) : target ? (
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
              <Countdown
                target={target}
                showMilliseconds={showMilliseconds}
                isNumbersAnimated={isNumbersAnimated}
              />
            </>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Timer;
