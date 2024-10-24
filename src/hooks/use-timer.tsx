import { TimerContext } from "@/components/providers/timer-provider";
import { useContext } from "react";

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context) {
    return context;
  } else {
    throw new Error("context not working");
  }
};
