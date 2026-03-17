import React, { useState, useEffect, useRef } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import CustomInput from "../customInput";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (address: string, coordinates: [number, number]) => void;
  placeholder?: string;
  readOnly?: boolean;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder,
  readOnly = false,
}) => {
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const provider = new OpenStreetMapProvider();

  useEffect(() => {
    const fetchResults = async () => {
      if (isTyping && value.length > 3) {
        try {
          const res = await provider.search({ query: value });
          setResults(res);
          setIsOpen(true);
        } catch (error) {
          console.error("Error fetching addresses:", error);
        }
      } else if (value.length <= 3) {
        setResults([]);
        setIsOpen(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [value, isTyping, provider]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsTyping(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <CustomInput
        label=""
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsTyping(true);
        }}
        placeholder={placeholder}
        readOnly={readOnly}
      />
      {isOpen && results.length > 0 && !readOnly && (
        <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto mt-[-10px] divide-y divide-gray-100">
          {results.map((result, index) => (
            <li
              key={index}
              className="px-4 py-3 bg-white z-30 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 transition-colors duration-150 flex items-start gap-2"
              onClick={() => {
                onChange(result.label);
                onSelect(result.label, [result.y, result.x]);
                setIsOpen(false);
                setIsTyping(false);
              }}
            >
              <svg
                className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="line-clamp-2">{result.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressAutocomplete;
