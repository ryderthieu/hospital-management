import { useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "../form/Label";
import { CalenderIcon, TimeIcon } from "../../icons";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
};

export default function TimePicker({
  id,
  onChange,
  defaultDate,
  label,
  placeholder,
}: PropsType) {
  useEffect(() => {
    const flatPickr = flatpickr(`#${id}`, {
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
      time_24hr: true,
      defaultDate,
      onChange,
    });

    return () => {
      if (!Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  }, [id, onChange, defaultDate]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs
            appearance-none bg-transparent text-gray-800 border-gray-300
            placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:border-base-300 focus:ring-base-500/20
            dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-base-800"
        />

        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
          <TimeIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}
