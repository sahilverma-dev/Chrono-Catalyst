import { SettingsIcon } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import SettingSheet from "./setting-sheet";
import { useState } from "react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

const Header = () => {
  const [openSetting, setOpenSetting] = useState(false);
  return (
    <div className="fixed flex items-center gap-1 lg:gap-2 top-0 right-0 lg:top-4 lg:right-4 py-2 px-4">
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
        onClick={() => setOpenSetting(true)}
        className="aspect-square rounded-full px-2 lg:px-4 lg:h-auto"
      >
        <SettingsIcon />
      </Button>
      <SettingSheet open={openSetting} onOpenChange={setOpenSetting} />
    </div>
  );
};

export default Header;
