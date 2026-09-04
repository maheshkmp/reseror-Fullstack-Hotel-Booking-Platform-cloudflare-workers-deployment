"use client";

import * as Slider from "@radix-ui/react-slider";
import { useEffect, useState } from "react";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  defaultValue?: [number, number];
  onValueCommit?: (values: [number, number]) => void;
}

export function PriceRangeSlider({
  min,
  max,
  step = 10,
  defaultValue = [min, max],
  onValueCommit,
}: PriceRangeSliderProps) {
  const [values, setValues] = useState<[number, number]>(defaultValue);

  useEffect(() => {
    setValues([
      defaultValue[0] !== undefined ? defaultValue[0] : min,
      defaultValue[1] !== undefined ? defaultValue[1] : max,
    ]);
  }, [min, max]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">Price Range</span>
        <div className="text-sm text-gray-500">
          ${values[0]} - ${values[1]}
        </div>
      </div>

      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={values}
        min={min}
        max={max}
        step={step}
        onValueChange={(newValues) => setValues(newValues as [number, number])}
        onValueCommit={(newValues) => onValueCommit?.(newValues as [number, number])}
      >
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-[3px]">
          <Slider.Range className="absolute bg-[#003580] rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-white border-2 border-[#003580] rounded-full hover:bg-[#003580]/10 focus:outline-none focus:ring-2 focus:ring-[#003580] focus:ring-offset-2"
          aria-label="Min price"
        />
        <Slider.Thumb
          className="block w-5 h-5 bg-white border-2 border-[#003580] rounded-full hover:bg-[#003580]/10 focus:outline-none focus:ring-2 focus:ring-[#003580] focus:ring-offset-2"
          aria-label="Max price"
        />
      </Slider.Root>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="text-xs text-gray-500">Min: ${min}</div>
        <div className="text-xs text-gray-500 text-right">Max: ${max}</div>
      </div>
    </div>
  );
}
