import React, { useState, useRef, useEffect } from "react";
import { ChevronDown,  Check } from "lucide-react";
import { createPortal } from "react-dom";

interface Option {
  id: string;
  label: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  selectedValues: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder: string;
  isOpen: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const MultiSelectDropdownRole: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedValues,
  onSelectionChange,
  placeholder,
  isOpen,
  onToggle,
  disabled = false,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 240,
  });

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;

      // Calculate if dropdown should open upward or downward
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = Math.min(240, options.length * 40 + 16); // Estimate dropdown height

      let top = rect.bottom + scrollTop + 4;

      // If not enough space below and more space above, open upward
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        top = rect.top + scrollTop - dropdownHeight - 4;
      }

      setDropdownPosition({
        top,
        left: rect.left + scrollLeft,
        width: rect.width,
        maxHeight: Math.min(240, Math.max(spaceBelow, spaceAbove) - 20),
      });
    }
  }, [isOpen, options.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when dropdown is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onToggle]);

  const handleOptionSelect = (optionId: string) => {
    const newSelected = selectedValues.includes(optionId)
      ? selectedValues.filter((id) => id !== optionId)
      : [...selectedValues, optionId];

    onSelectionChange(newSelected);
  };

  // const removeOption = (optionId: string, e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   onSelectionChange(selectedValues.filter((id) => id !== optionId));
  // };

  const displayText =
    selectedValues.length > 0
      ? `${selectedValues.length} selected`
      : placeholder;

  const dropdownContent = isOpen && (
    <div
      ref={dropdownRef}
      className="fixed bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
        maxHeight: `${dropdownPosition.maxHeight}px`,
        zIndex: 10000,
      }}
    >
      {options.length === 0 ? (
        <div className="px-4 py-3 text-gray-500 text-sm">
          No options available
        </div>
      ) : (
        <div className="max-h-full overflow-y-auto">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.id);
            return (
              <div
                key={option.id}
                className={`px-4 py-3 cursor-pointer transition-colors duration-150 flex items-center justify-between ${
                  isSelected
                    ? "bg-blue-50 text-blue-900 border-l-4 border-blue-500"
                    : "hover:bg-gray-50 text-gray-900"
                }`}
                onClick={() => handleOptionSelect(option.id)}
              >
                <span className="text-sm font-medium">{option.label}</span>
                {isSelected && (
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`w-full px-3 py-2.5 text-left border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between transition-all duration-150 ${
          disabled
            ? "bg-gray-100 cursor-not-allowed text-gray-500"
            : "bg-white hover:bg-gray-50 text-gray-900"
        } ${
          isOpen
            ? "border-blue-500 ring-2 ring-blue-500 ring-opacity-20"
            : "border-gray-300"
        }`}
      >
        <span
          className={`text-sm ${
            selectedValues.length === 0 ? "text-gray-500" : "text-gray-900"
          }`}
        >
          {displayText}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180 text-blue-600" : "text-gray-400"
          }`}
        />
      </button>

      {/* {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selectedValues.map(value => {
            const option = options.find(opt => opt.id === value);
            return (
              <span
                key={value}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md border border-blue-200"
              >
                {option?.label || value}
                <button
                  type="button"
                  onClick={(e) => removeOption(value, e)}
                  className="hover:text-blue-600 transition-colors duration-150"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )} */}

      {typeof document !== "undefined" &&
        createPortal(dropdownContent, document.body)}
    </div>
  );
};
