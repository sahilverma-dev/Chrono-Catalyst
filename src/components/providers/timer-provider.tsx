import { createContext, useEffect, useState } from "react";
import { quotes } from "@/constans/quotes";

export type TimerMode = "target" | "focus";
export type FocusStatus = "idle" | "running" | "paused";

interface TimerContext {
  haveTarget: boolean;
  date: undefined | Date;
  color: string;
  isNumbersAnimated: boolean;
  isColorAnimated: boolean;
  showQuote: boolean;
  showMilliseconds: boolean;
  message: string;

  // Focus Mode
  mode: TimerMode;
  focusDuration: number; // in minutes
  focusRemaining: number; // in milliseconds
  focusStatus: FocusStatus;
  focusEndTime: number | null;
  focusLabel: string;
  quoteIndex: number;

  handleMessageChange: (message: string) => void;
  handleShowQuoteChange: (showQuote: boolean) => void;
  handleDateChange: (date: Date | undefined) => void;
  handleColorChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleIsNumbersAnimatedChange: (isNumbersAnimated: boolean) => void;
  handleIsColorAnimatedChange: (isColorAnimated: boolean) => void;
  handleShowMillisecondsChange: (showMilliseconds: boolean) => void;

  // Focus Mode Handlers
  handleModeChange: (mode: TimerMode) => void;
  handleFocusDurationChange: (duration: number) => void;
  handleFocusLabelChange: (label: string) => void;
  handleStartFocus: () => void;
  handlePauseFocus: () => void;
  handleResetFocus: () => void;
  handleRefeshQuote: () => void;
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
  mode: "target",
  focusDuration: 25,
  focusRemaining: 25 * 60 * 1000,
  focusStatus: "idle",
  focusEndTime: null,
  focusLabel: "Focus",
  quoteIndex: -1,

  handleIsNumbersAnimatedChange: () => {},
  handleMessageChange: () => {},
  handleShowQuoteChange: () => {},
  handleDateChange: () => {},
  handleIsColorAnimatedChange: () => {},
  handleShowMillisecondsChange: () => {},
  handleModeChange: () => {},
  handleFocusDurationChange: () => {},
  handleFocusLabelChange: () => {},
  handleStartFocus: () => {},
  handlePauseFocus: () => {},
  handleResetFocus: () => {},
  handleRefeshQuote: () => {},
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

  // Focus Mode State
  const [mode, setMode] = useState<TimerMode>(() => {
    return (localStorage.getItem("timerMode") as TimerMode) || "target";
  });
  const [focusDuration, setFocusDuration] = useState(() => {
    const saved = localStorage.getItem("focusDuration");
    return saved ? parseInt(saved) : 25;
  });
  const [focusRemaining, setFocusRemaining] = useState(() => {
    const saved = localStorage.getItem("focusRemaining");
    return saved ? parseInt(saved) : 25 * 60 * 1000;
  });
  const [focusStatus, setFocusStatus] = useState<FocusStatus>(() => {
    return (localStorage.getItem("focusStatus") as FocusStatus) || "idle";
  });
  const [focusEndTime, setFocusEndTime] = useState<number | null>(() => {
    const saved = localStorage.getItem("focusEndTime");
    return saved ? parseInt(saved) : null;
  });
  const [focusLabel, setFocusLabel] = useState(() => {
    return localStorage.getItem("focusLabel") || "Focus";
  });
  const [quoteIndex, setQuoteIndex] = useState(() => {
    const saved = localStorage.getItem("quoteIndex");
    return saved ? parseInt(saved) : -1;
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

  // Focus Mode Handlers
  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    localStorage.setItem("timerMode", newMode);
  };

  const handleFocusDurationChange = (duration: number) => {
    setFocusDuration(duration);
    localStorage.setItem("focusDuration", duration.toString());
    // Also reset the remaining time if in idle state
    if (focusStatus === "idle") {
      setFocusRemaining(duration * 60 * 1000);
      localStorage.setItem("focusRemaining", (duration * 60 * 1000).toString());
    }
  };

  const handleFocusLabelChange = (label: string) => {
    setFocusLabel(label);
    localStorage.setItem("focusLabel", label);
  };

  const handleStartFocus = () => {
    const endTime = Date.now() + focusRemaining;
    setFocusEndTime(endTime);
    localStorage.setItem("focusEndTime", endTime.toString());
    setFocusStatus("running");
    localStorage.setItem("focusStatus", "running");
  };

  const handlePauseFocus = () => {
    if (focusEndTime) {
      const remaining = Math.max(0, focusEndTime - Date.now());
      setFocusRemaining(remaining);
      localStorage.setItem("focusRemaining", remaining.toString());
    }
    setFocusEndTime(null);
    localStorage.removeItem("focusEndTime");
    setFocusStatus("paused");
    localStorage.setItem("focusStatus", "paused");
  };

  const handleResetFocus = () => {
    setFocusStatus("idle");
    localStorage.setItem("focusStatus", "idle");
    setFocusEndTime(null);
    localStorage.removeItem("focusEndTime");
    setFocusRemaining(focusDuration * 60 * 1000);
    localStorage.setItem(
      "focusRemaining",
      (focusDuration * 60 * 1000).toString()
    );
  };

  const handleRefeshQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuoteIndex(randomIndex);
    localStorage.setItem("quoteIndex", randomIndex.toString());
  };

  // Restore running timer on load if needed
  useEffect(() => {
    if (mode === "focus" && focusStatus === "running" && focusEndTime) {
      // Check if time has passed
      if (Date.now() >= focusEndTime) {
        handleResetFocus();
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        mode,
        focusDuration,
        focusRemaining,
        focusStatus,
        focusEndTime,
        focusLabel,
        quoteIndex,
        handleShowQuoteChange,
        handleIsNumbersAnimatedChange,
        handleDateChange,
        handleColorChange,
        handleIsColorAnimatedChange,
        handleMessageChange,
        handleShowMillisecondsChange,
        handleModeChange,
        handleFocusDurationChange,
        handleFocusLabelChange,
        handleStartFocus,
        handlePauseFocus,
        handleResetFocus,
        handleRefeshQuote,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export default TimerProvider;
