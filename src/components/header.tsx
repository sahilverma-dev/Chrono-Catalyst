import { SettingsIcon } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { useTimer } from "@/hooks/use-timer";

const Header = () => {
  const { handleSettingsOpenChange } = useTimer();
  return (
    <div className="fixed flex items-center gap-1 lg:gap-2 top-0 right-0 lg:top-4 lg:right-4 py-2 px-4 z-50">
      <a
        href="https://github.com/sahilverma-dev/Chrono-Catalyst"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "aspect-square rounded-full h-auto"
        )}
      >
        <GitHubLogoIcon />
      </a>
      <Button
        variant={"secondary"}
        onClick={() => handleSettingsOpenChange(true)}
        className="aspect-square rounded-full px-2 lg:px-4 lg:h-auto"
      >
        <SettingsIcon />
      </Button>
    </div>
  );
};

export default Header;
