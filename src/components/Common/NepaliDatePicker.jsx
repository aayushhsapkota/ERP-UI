import React, { useState, useRef, useEffect, useMemo, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import NepaliDate from "nepali-date-converter";

const CALENDAR_WIDTH = 256; // w-64
const CALENDAR_HEIGHT_ESTIMATE = 300;
const VIEWPORT_MARGIN = 8;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const pad2 = (n) => String(n).padStart(2, "0");
const toBsString = (year, month, day) => `${year}-${pad2(month + 1)}-${pad2(day)}`;

// Days in a BS month via the classic "day 0 of next month" trick.
const daysInMonth = (year, month) => new NepaliDate(year, month + 1, 0).getDate();

const buildGrid = (year, month) => {
  const firstWeekday = new NepaliDate(year, month, 1).getDay();
  const total = daysInMonth(year, month);
  const cells = new Array(firstWeekday).fill(null);
  for (let d = 1; d <= total; d++) cells.push(d);
  return cells;
};

const parseBsOrNull = (value) => {
  if (!value) return null;
  try {
    return new NepaliDate(value);
  } catch {
    return null;
  }
};

const NepaliDatePicker = ({
  className,
  disabled,
  setData,
  name,
  value,
  data,
  date = new Date(),
  disabledBeforeDate = false,
  disabledAfterDate = false,
  id,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [position, setPosition] = useState(null);

  const today = useMemo(() => new NepaliDate(date), [date]);
  const todayStr = today.format("YYYY-MM-DD");
  const minDate = disabledBeforeDate ? null : todayStr;
  const maxDate = disabledAfterDate ? todayStr : null;

  const [viewYear, setViewYear] = useState(today.getYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  useEffect(() => {
    if (!open) return;
    const base = parseBsOrNull(value) || today;
    setViewYear(base.getYear());
    setViewMonth(base.getMonth());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    function onClickOutside(e) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // The calendar is portalled to <body> so an ancestor's overflow:hidden
  // (e.g. the report page's search bar) can't clip it. Position is computed
  // from the input's viewport rect and clamped so it never runs off-screen.
  useLayoutEffect(() => {
    if (!open) return;
    const reposition = () => {
      const rect = inputRef.current?.getBoundingClientRect();
      if (!rect) return;
      let left = rect.left;
      if (left + CALENDAR_WIDTH > window.innerWidth - VIEWPORT_MARGIN) {
        left = rect.right - CALENDAR_WIDTH;
      }
      left = Math.max(VIEWPORT_MARGIN, left);

      let top = rect.bottom + 4;
      if (top + CALENDAR_HEIGHT_ESTIMATE > window.innerHeight - VIEWPORT_MARGIN) {
        top = rect.top - CALENDAR_HEIGHT_ESTIMATE - 4;
      }
      top = Math.max(VIEWPORT_MARGIN, top);

      setPosition({ top, left });
    };
    reposition();
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [open]);

  const goPrevMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const goNextMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  const isDisabledDay = useCallback(
    (day) => {
      if (day == null) return true;
      const bs = toBsString(viewYear, viewMonth, day);
      if (minDate && bs < minDate) return true;
      if (maxDate && bs > maxDate) return true;
      return false;
    },
    [viewYear, viewMonth, minDate, maxDate]
  );

  const selectDay = useCallback(
    (day) => {
      if (isDisabledDay(day)) return;
      setData({ ...data, [name]: toBsString(viewYear, viewMonth, day) });
      setOpen(false);
    },
    [viewYear, viewMonth, isDisabledDay, setData, data, name]
  );

  const cells = useMemo(() => buildGrid(viewYear, viewMonth), [viewYear, viewMonth]);
  const years = useMemo(() => {
    const base = today.getYear();
    const arr = [];
    for (let y = base - 5; y <= base + 5; y++) arr.push(y);
    return arr;
  }, [today]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <input
        ref={inputRef}
        readOnly
        id={id}
        placeholder="yyyy-mm-dd"
        value={value || ""}
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={className + " nepali-datepicker cursor-pointer"}
        style={{ caretColor: "transparent" }}
      />
      {open && !disabled && position && createPortal(
        <div
          ref={dropdownRef}
          className="fixed z-[1001] w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-2 text-sm"
          style={{ top: position.top, left: position.left }}
        >
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={goPrevMonth}
              className="px-2 py-1 rounded hover:bg-gray-100 text-gray-600"
            >
              &#8249;
            </button>
            <div className="flex gap-1 items-center text-xs text-gray-700">
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                className="text-xs rounded border-gray-200 focus:outline-none"
              >
                {Array.from({ length: 12 }).map((_, m) => (
                  <option key={m} value={m}>
                    {new NepaliDate(viewYear, m, 1).format("MMMM")}
                  </option>
                ))}
              </select>
              <select
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                className="text-xs rounded border-gray-200 focus:outline-none"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={goNextMonth}
              className="px-2 py-1 rounded hover:bg-gray-100 text-gray-600"
            >
              &#8250;
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-gray-500 mb-1">
            {WEEKDAYS.map((w) => (
              <div key={w}>{w}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {cells.map((day, i) => {
              if (day == null) return <div key={i} />;
              const bs = toBsString(viewYear, viewMonth, day);
              const isToday = bs === todayStr;
              const isSelected = bs === value;
              const isDisabled = isDisabledDay(day);
              return (
                <button
                  type="button"
                  key={i}
                  disabled={isDisabled}
                  onClick={() => selectDay(day)}
                  className={
                    "rounded py-1 text-xs " +
                    (isDisabled
                      ? "text-gray-300 cursor-not-allowed"
                      : isSelected
                      ? "bg-[#00684a] text-white"
                      : isToday
                      ? "border border-[#00684a] text-[#00684a]"
                      : "hover:bg-gray-100 text-gray-700 cursor-pointer")
                  }
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default NepaliDatePicker;
