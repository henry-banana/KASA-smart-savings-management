import * as React from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "./utils";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export function MonthPicker({
  date,
  onSelect,
  placeholder = "Pick a month",
  className,
  maxDate,
}) {
  const [currentYear, setCurrentYear] = React.useState(
    date?.getFullYear() || new Date().getFullYear()
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleMonthSelect = (monthIndex) => {
    const newDate = new Date(currentYear, monthIndex, 1);
    onSelect?.(newDate);
  };

  const formatMonthYear = (d) => {
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  // Check if a month should be disabled
  const isMonthDisabled = (monthIndex) => {
    if (!maxDate) return false;
    const today = maxDate instanceof Date ? maxDate : new Date();
    const currentMonth = today.getMonth();
    const currentYearNow = today.getFullYear();

    return (
      currentYear > currentYearNow ||
      (currentYear === currentYearNow && monthIndex >= currentMonth)
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left h-12 rounded-sm",
            // ✅ đồng bộ style giống input/select: hover nhẹ, border nhẹ
            "bg-input-background border-gray-200 text-gray-700",
            "hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700 hover:scale-100",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AEEF]/20 focus-visible:border-[#00AEEF]",
            "transition-colors duration-150",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatMonthYear(date) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 rounded-sm" align="start">
        <div className="space-y-4">
          {/* Year Navigator */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentYear((y) => y - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-semibold">{currentYear}</div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentYear((y) => y + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => {
              const isSelected =
                date &&
                date.getMonth() === index &&
                date.getFullYear() === currentYear;
              const isDisabled = isMonthDisabled(index);

              return (
                <Button
                  key={month}
                  variant={isSelected ? "default" : "outline"}
                  disabled={isDisabled}
                  className={cn(
                    "h-10 text-sm rounded-sm",
                    isSelected &&
                      "bg-gradient-to-r from-[#1A4D8F] to-[#00AEEF] text-white",
                    isDisabled && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => !isDisabled && handleMonthSelect(index)}
                >
                  {month.substring(0, 3)}
                </Button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
