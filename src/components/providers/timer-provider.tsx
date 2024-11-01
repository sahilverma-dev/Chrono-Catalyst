import { createContext, useEffect, useState } from "react";

interface TimerContext {
  haveTarget: boolean;
  date: undefined | Date;
  color: string;
  isNumbersAnimated: boolean;
  isColorAnimated: boolean;
  showQuote: boolean;
  showMilliseconds: boolean;
  message: string;

  handleMessageChange: (message: string) => void;
  handleShowQuoteChange: (showQuote: boolean) => void;
  handleDateChange: (date: Date | undefined) => void;
  handleColorChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleIsNumbersAnimatedChange: (isNumbersAnimated: boolean) => void;
  handleIsColorAnimatedChange: (isColorAnimated: boolean) => void;
  handleShowMillisecondsChange: (showMilliseconds: boolean) => void;
}

export const TimerContext = createContext<TimerContext>({
  haveTarget: false,
  color: "#ff7700",
  date: undefined,
  isNumbersAnimated: true,
  isColorAnimated: true,
  message: "",
  showQuote: true,
  showMilliseconds: true,
  handleIsNumbersAnimatedChange: () => {},
  handleMessageChange: () => {},
  handleShowQuoteChange: () => {},
  handleDateChange: () => {},
  handleIsColorAnimatedChange: () => {},
  handleShowMillisecondsChange: () => {},
});

const TimerProvider = ({ children }: React.PropsWithChildren) => {
  const [haveTarget, setHaveTarget] = useState(() => {
    const savedData = localStorage.getItem("target-date");
    return savedData ? true : false;
  });
  const [date, setDate] = useState<Date | undefined>(() => {
    const savedData = localStorage.getItem("target-date");
    return savedData ? new Date(savedData) : undefined;
  });
  const [color, setColor] = useState(
    () => localStorage.getItem("color") || "#ff7700"
  );
  const [isNumbersAnimated, setIsNumbersAnimated] = useState(() => {
    const saved = localStorage.getItem("isNumbersAnimated");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [isColorAnimated, setIsColorAnimated] = useState(() => {
    const saved = localStorage.getItem("isColorAnimated");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [message, setMessage] = useState(
    () => localStorage.getItem("message") || ""
  );
  const [showQuote, setShowQuote] = useState(() => {
    const saved = localStorage.getItem("showQuote");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showMilliseconds, setShowMilliseconds] = useState(() => {
    const saved = localStorage.getItem("showMilliseconds");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const handleDateChange = (date: Date | undefined) => {
    if (!date) {
      localStorage.removeItem("target-date");
      setDate(undefined);
      setHaveTarget(false);
      return;
    }
    if (date.toString() === "") {
      localStorage.removeItem("target-date");
      setDate(undefined);
      setHaveTarget(false);
      return;
    }

    const today = new Date().toJSON().split("T")[0];

    if (date.toString() === today) {
      setDate(undefined);
      setHaveTarget(false);
      localStorage.removeItem("target-date");
      return;
    }
    const newDate = new Date(date);
    setDate(newDate);
    setHaveTarget(true);
    localStorage.setItem("target-date", newDate.toISOString());
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setColor(newColor);
    localStorage.setItem("color", newColor);
  };

  const handleIsColorAnimatedChange = (isColorAnimated: boolean) => {
    setIsColorAnimated(isColorAnimated);
    localStorage.setItem("isColorAnimated", JSON.stringify(isColorAnimated));
  };

  const handleIsNumbersAnimatedChange = (isNumbersAnimated: boolean) => {
    setIsNumbersAnimated(isNumbersAnimated);
    localStorage.setItem(
      "isNumbersAnimated",
      JSON.stringify(isNumbersAnimated)
    );
  };

  const handleMessageChange = (message: string) => {
    setMessage(message);
    localStorage.setItem("message", message);
  };

  const handleShowQuoteChange = (showQuote: boolean) => {
    setShowQuote(showQuote);
    localStorage.setItem("showQuote", JSON.stringify(showQuote));
  };

  const handleShowMillisecondsChange = (showMilliseconds: boolean) => {
    setShowMilliseconds(showMilliseconds);
    localStorage.setItem("showMilliseconds", JSON.stringify(showMilliseconds));
  };

  useEffect(() => {
    const savedData = localStorage.getItem("target-date");
    if (savedData) {
      setHaveTarget(true);
      const date = new Date(savedData);
      setDate(date);
    } else {
      setHaveTarget(false);
      setDate(undefined);
    }
  }, []);

  return (
    <TimerContext.Provider
      value={{
        haveTarget,
        color,
        date,
        isNumbersAnimated,
        isColorAnimated,
        message,
        showQuote,
        showMilliseconds,
        handleShowQuoteChange,
        handleIsNumbersAnimatedChange,
        handleDateChange,
        handleColorChange,
        handleIsColorAnimatedChange,
        handleMessageChange,
        handleShowMillisecondsChange,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export default TimerProvider;
