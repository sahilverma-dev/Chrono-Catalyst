import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "./ui/input";
import { useTimer } from "@/hooks/use-timer";
import ThemeToggle from "./theme-toggle";
import { Label, labelVariants } from "./ui/label";
import { Switch } from "./ui/switch";
import { useTheme } from "./providers/theme-provider";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

interface SettingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingSheet: React.FC<SettingSheetProps> = ({ open, onOpenChange }) => {
  const { theme } = useTheme();

  const {
    date,
    color,
    isColorAnimated,
    isNumbersAnimated,
    message,
    showQuote,
    showMilliseconds,
    handleDateChange,
    handleColorChange,
    handleIsNumbersAnimatedChange,
    handleIsColorAnimatedChange,
    handleMessageChange,
    handleShowQuoteChange,
    handleShowMillisecondsChange,
  } = useTimer();
  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Adjust your tab&apos;s appearance.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="date">Target Date</Label>

            <Input
              id="date"
              type="date"
              required
              value={date?.toJSON().split("T")[0] || ""}
              onChange={handleDateChange}
              min={new Date().toJSON().split("T")[0]}
              className="w-auto"
              // className="flex rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                colorScheme: theme === "dark" ? "dark" : "light",
              }}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className={labelVariants()}>Theme</span>
            <ThemeToggle />
          </div>

          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="color-animated">Color Animation</Label>
            <Switch
              id="color-animated"
              checked={isColorAnimated}
              onCheckedChange={(check) => handleIsColorAnimatedChange(check)}
            />
          </div>

          {!isColorAnimated && (
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                type="color"
                value={color}
                onChange={handleColorChange}
                className="w-24"
              />
            </div>
          )}
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="number-animated">Numbers Animations</Label>
            <Switch
              id="number-animated"
              checked={isNumbersAnimated}
              onCheckedChange={(check) => handleIsNumbersAnimatedChange(check)}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="show-quote">Show Quote</Label>
            <Switch
              id="show-quote"
              checked={showQuote}
              onCheckedChange={(check) => handleShowQuoteChange(check)}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="show-milliseconds">Show Milliseconds</Label>
            <Switch
              id="show-milliseconds"
              checked={showMilliseconds}
              onCheckedChange={(check) => handleShowMillisecondsChange(check)}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="custom-message">Custom Message</Label>
            <Textarea
              id="custom-message"
              value={message}
              cols={30}
              placeholder="Write your message here in 300 characters max"
              onChange={(e) => {
                handleMessageChange(e.target.value.slice(0, 300));
              }}
            />
          </div>

          {message.length > 0 && (
            <Button
              variant={"destructive"}
              onClick={() => handleMessageChange("")}
              className="rounded-full"
            >
              Clear Custom Message
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingSheet;
