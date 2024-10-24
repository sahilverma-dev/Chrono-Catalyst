import { PropsWithChildren } from "react";
import { ThemeProvider } from "./theme-provider";
import TimerProvider from "./timer-provider";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <TimerProvider>{children}</TimerProvider>
    </ThemeProvider>
  );
};

export default Providers;
