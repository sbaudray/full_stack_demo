import React from "react";

export function useDebounce(value: any, time: number) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  const tid = React.useRef(0);

  React.useEffect(() => {
    clearTimeout(tid.current);
    tid.current = window.setTimeout(() => setDebouncedValue(value), time);
  }, [value, time]);

  return debouncedValue;
}
