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
import { DateTimePicker } from "./ui/datetime-picker";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
    mode,
    focusDuration,
    focusLabel,
    handleDateChange,
    handleColorChange,
    handleIsNumbersAnimatedChange,
    handleIsColorAnimatedChange,
    handleMessageChange,
    handleShowQuoteChange,
    handleShowMillisecondsChange,
    handleModeChange,
    handleFocusDurationChange,
    handleFocusLabelChange,
  } = useTimer();
  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Adjust your tab&apos;s appearance.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-2">
            <Label>Timer Mode</Label>
            <ToggleGroup
              type="single"
              value={mode}
              onValueChange={(val) => {
                if (val) handleModeChange(val as "target" | "focus");
              }}
              className="justify-start"
            >
              <ToggleGroupItem value="target" aria-label="Target Date">
                Target Date
              </ToggleGroupItem>
              <ToggleGroupItem value="focus" aria-label="Flow Mode">
                Flow Mode
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {mode === "target" ? (
            <div className="flex items-center justify-between gap-4">
              <DateTimePicker
                id="date"
                required
                value={date}
                placeholder="Pick your target date and time"
                min={new Date()}
                use12HourFormat
                onChange={handleDateChange}
                style={{
                  colorScheme: theme === "dark" ? "dark" : "light",
                }}
              />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="focus-duration">Duration (minutes)</Label>
                <Input
                  id="focus-duration"
                  type="number"
                  min={1}
                  value={focusDuration}
                  onChange={(e) =>
                    handleFocusDurationChange(Number(e.target.value))
                  }
                  className="w-24 text-right"
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="focus-label">Label</Label>
                <Input
                  id="focus-label"
                  type="text"
                  value={focusLabel}
                  placeholder="Focus"
                  onChange={(e) => handleFocusLabelChange(e.target.value)}
                  className="w-1/2"
                />
              </div>
            </>
          )}

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
