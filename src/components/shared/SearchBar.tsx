import {
  SearchBar,
  SearchBarInput,
  SearchBarInputContainer,
  SearchBarSearchButton,
  SearchBarResults,
  SearchBarResultsList,
  SearchBarResultsItem,
  SearchBarClearButton,
  SearchBarHint,
} from "@govtechmy/myds-react/search-bar";
import { Pill } from "@govtechmy/myds-react/pill";
import { ChevronRightIcon } from "@govtechmy/myds-react/icon";
import { useEffect, useRef, useState } from "react";

interface SearchBarHomeProps<T> {
  query?: string;
  setQuery?: (value: string) => void;
  handleValueChange?: (value: string) => void;
  handleSearchEnter?: React.KeyboardEventHandler<HTMLInputElement>;
  suggestions?: T[];
  getKey?: (item: T) => string;
  getLabel?: (item: T) => string;
  onSelect?: (item: T) => void;
}

export default function SearchBarHome<T>({
  query,
  setQuery,
  handleValueChange,
  handleSearchEnter,
  suggestions = [],
  getKey,
  getLabel,
  onSelect,
}: SearchBarHomeProps<T>) {
  const [hasFocus, setHasFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasQuery = (query?.length || 0) > 0;

  useEffect(() => {
    const handleSlashFocus = (e: KeyboardEvent) => {
      if (e.key === "/" && !hasFocus) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleSlashFocus);
    return () => window.removeEventListener("keydown", handleSlashFocus);
  }, [hasFocus]);

  return (
    <SearchBar
      size="large"
      onBlur={(e) => {
        const blurredByChild = e.currentTarget.contains(e.relatedTarget);
        if (blurredByChild) return;
        setHasFocus(false);
      }}
    >
      <SearchBarInputContainer>
        <SearchBarInput
          ref={inputRef}
          placeholder="Carian sekolah"
          value={query}
          onValueChange={handleValueChange}
          onKeyDown={handleSearchEnter}
          onFocus={() => setHasFocus(true)}
        />
        {query && <SearchBarClearButton onClick={() => setQuery?.("")} />}
        {(!query || query.trim().length === 0) && (
          <SearchBarHint className="">
            Tekan <Pill size="small">/</Pill> untuk cari
          </SearchBarHint>
        )}
        <SearchBarSearchButton />
      </SearchBarInputContainer>
      <SearchBarResults open={hasQuery && hasFocus}>
        {hasQuery && !(suggestions && suggestions.length) && (
          <p className="text-txt-black-900 text-center">No results found</p>
        )}
        {hasQuery && suggestions && suggestions.length > 0 && (
          <SearchBarResultsList className="max-h-[400px] overflow-y-scroll">
            {suggestions.map((item) => (
              <SearchBarResultsItem
                key={getKey?.(item)}
                value={getLabel?.(item)}
                onMouseDown={(e) => e.preventDefault()}
                onSelect={() => {
                  if (onSelect) {
                    onSelect(item);
                    setHasFocus(false);
                  } else {
                    setHasFocus(false);
                  }
                }}
              >
                <p className="line-clamp-1 flex-1 text-left">
                  {getLabel?.(item)}
                </p>
                <ChevronRightIcon />
              </SearchBarResultsItem>
            ))}
          </SearchBarResultsList>
        )}
      </SearchBarResults>
    </SearchBar>
  );
}
