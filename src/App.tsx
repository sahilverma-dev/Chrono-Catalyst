import Timer from "./components/timer";
import Header from "./components/header";
import { useTimer } from "./hooks/use-timer";
import { cn } from "./lib/utils";

const App = () => {
  const { color, isColorAnimated } = useTimer();
  return (
    <div className="w-full h-dvh flex items-center justify-center relative">
      <div
        className={cn(
          "absolute inset-0 -z-[10] h-full w-full items-center",
          isColorAnimated && "animate-color"
        )}
        style={{
          background: `radial-gradient(125% 125% at 50% 10%, #00000000 40%, ${color} 100%)`,
        }}
      />
      <Header />
      <Timer />
    </div>
  );
};

export default App;
