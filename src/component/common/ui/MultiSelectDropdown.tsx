

import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { MultiSelectDropdownProps } from "../../../types";

interface ExtendedMultiSelectDropdownProps extends MultiSelectDropdownProps {
  onClose?: () => void;
  maxHeight?: number;
  preSelectedOptions?: string[];
}

const MultiSelectDropdown: React.FC<ExtendedMultiSelectDropdownProps> = ({
  title,
  options,
  selectedOptions,
  preSelectedOptions = [],
  onApply,
  // onReset,
  onClose,
  maxHeight = 300,
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelected, setTempSelected] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize temp selected with the current selections
  useEffect(() => {
    setTempSelected([...selectedOptions]);
  }, [selectedOptions]);
  // Auto-focus search input when dropdown opens
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);


  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    };


    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };


    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
   
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);


  // Toggle selection of an option
  const toggleOption = (optionId: string) => {
    // Prevent removal of pre-selected (already assigned) modules
    if (preSelectedOptions.includes(optionId)) {
      return;
    }
   
    setTempSelected((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };


  const handleApply = () => {
    onApply(tempSelected);
  };


  // const handleReset = () => {
  //   // Only reset new selections, keep pre-selected ones
  //   setTempSelected([...preSelectedOptions]);
  //   onReset();
  // };


  // SIMPLE COMPACT DESIGN - LIKE YOUR USERDETAIL SELECT
  const headerHeight = 40;
  const searchHeight = 40;
  const footerHeight = 50;
  const contentHeight = maxHeight - headerHeight - searchHeight - footerHeight;


  return (
    <div
      ref={dropdownRef}
      className={`bg-white rounded-lg border border-gray-300 shadow-xl overflow-hidden ${className}`}
      style={{
        height: `${maxHeight}px`,
        width: '100%'
      }}
    >
      {/* SIMPLE HEADER */}
      <div
        className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200"
        style={{ height: `${headerHeight}px` }}
      >
        <span className="text-sm font-medium text-gray-900 truncate">
          {title} {tempSelected.length > 0 && `(${tempSelected.length})`}
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <X size={14} className="text-gray-500" />
          </button>
        )}
      </div>


      {/* SIMPLE SEARCH */}
      <div
        className="px-3 py-2 border-b border-gray-200"
        style={{ height: `${searchHeight}px` }}
      >
        <div className="relative">
          <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            className="w-full pl-7 pr-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>


      {/* SIMPLE OPTIONS LIST */}
      <div
        ref={contentRef}
        className="overflow-y-auto"
        style={{ height: `${contentHeight}px` }}
      >
        {filteredOptions.length > 0 ? (
          <div className="py-1">
            {filteredOptions.map((option) => {
              const isPreSelected = preSelectedOptions.includes(option.id);
              const isSelected = tempSelected.includes(option.id);
             
              return (
                <label
                  key={option.id}
                  className={`flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                    isPreSelected ? "bg-blue-50" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={isSelected}
                    disabled={isPreSelected}
                    onChange={() => toggleOption(option.id)}
                  />
                  <span className={`ml-2 ${
                    isPreSelected ? "text-blue-700 font-medium" : "text-gray-700"
                  }`}>
                    {option.label}
                    {isPreSelected && (
                      <span className="ml-1 text-xs text-blue-600">(Assigned)</span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            No modules found
          </div>
        )}
      </div>


      {/* SIMPLE SUBMIT BUTTON */}
      <div
        className="px-3 py-2 border-t border-gray-200 bg-gray-50"
        style={{ height: `${footerHeight}px` }}
      >
        <button
          className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleApply}
        >
          Submit{tempSelected.length > 0 && ` (${tempSelected.length})`}
        </button>
      </div>
    </div>
  );
};


export default MultiSelectDropdown;

