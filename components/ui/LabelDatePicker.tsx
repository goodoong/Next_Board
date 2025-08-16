"use client";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  label: string;
  readonly?: boolean;
}

function LabelDatePicker({ label, readonly}: Props) {
  const [date, setDate] = useState<Date>();

  return (
    <div className="flex items-center gap-[12px]">
      <span className="text-[#6d6d6d]">{label}</span>
      {/* shadcn UI - calendar */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!date}
            className={cn(
              "data-[empty=true]:text-muted-foreground w-[200px] justify-start text-left font-normal"
            )}
          >
            <CalendarIcon />
            {date ? format(date, "PPP") : <span>날짜를 선택하세요.</span>}
          </Button>
        </PopoverTrigger>
        {!readonly && (
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}

export {LabelDatePicker};
