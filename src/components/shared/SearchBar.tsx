import {
  SearchBar,
  SearchBarInput,
  SearchBarInputContainer,
  SearchBarSearchButton,
  SearchBarResults,
  SearchBarResultsList,
  SearchBarResultsItem,
  SearchBarClearButton,
} from "@govtechmy/myds-react/search-bar";
// import { Pill } from "@govtechmy/myds-react/pill";
import {
  ArrowOutgoingIcon,
  ChevronRightIcon,
} from "@govtechmy/myds-react/icon";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button, ButtonIcon } from "@govtechmy/myds-react/button";

interface SearchBarHomeProps<T> {
  query?: string;
  setQuery?: (value: string) => void;
  handleValueChange?: (value: string) => void;
  handleSearchEnter?: React.KeyboardEventHandler<HTMLInputElement>;
  suggestions?: T[];
  getKey?: (item: T) => string;
  getLabel?: (item: T) => string;
  getSubLabel?: (item: T) => string | undefined;
  onSelect?: (item: T) => void;
  searchBarTitle?: string;
  singlePageTotal?: number;
  dataTotal?: number;
}

export default function SearchBarHome<T>({
  query,
  setQuery,
  handleValueChange,
  handleSearchEnter,
  suggestions = [],
  getKey,
  getLabel,
  getSubLabel,
  onSelect,
  searchBarTitle = "Carian",
  singlePageTotal,
  dataTotal,
}: SearchBarHomeProps<T>) {
  const [hasFocus, setHasFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasQuery = (query?.length || 0) > 0;
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();

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
          placeholder={searchBarTitle}
          value={query}
          onValueChange={handleValueChange}
          onKeyDown={handleSearchEnter}
          onFocus={() => setHasFocus(true)}
        />
        {query && (
          <SearchBarClearButton
            onClick={() => setQuery?.("")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setQuery?.("");
              }
            }}
          />
        )}
        {/* {(!query || query.trim().length === 0) && (
          <SearchBarHint className="">
            Tekan <Pill size="small">/</Pill> untuk cari
          </SearchBarHint>
        )} */}
        <SearchBarSearchButton
          tabIndex={0}
          {...(location.pathname === `/${lang || "ms"}/home` && {
            onClick: () => navigate(`/${lang || "ms"}/carian-sekolah`),
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                navigate(`/${lang || "ms"}/carian-sekolah`);
              }
            },
          })}
        />
      </SearchBarInputContainer>
      <SearchBarResults open={hasQuery && hasFocus} className="p-0">
        {/* open={hasQuery && hasFocus} */}
        {hasQuery && !(suggestions && suggestions.length) && (
          <p className="px-4 py-5 text-txt-black-900 text-center">
            Tiada hasil carian
          </p>
        )}
        {hasQuery && suggestions && suggestions.length > 0 && (
          <SearchBarResultsList className="max-h-[400px] overflow-y-auto focus-visible:outline-none">
            {suggestions.map((item) => (
              <SearchBarResultsItem
                tabIndex={0}
                key={getKey?.(item)}
                value={getLabel?.(item)}
                onMouseDown={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    if (onSelect) {
                      onSelect(item);
                      setHasFocus(false);
                    } else {
                      setHasFocus(false);
                    }
                  }
                }}
                onSelect={() => {
                  if (onSelect) {
                    onSelect(item);
                    setHasFocus(false);
                  } else {
                    setHasFocus(false);
                  }
                }}
                className="px-4 py-5 border-b border-otl-divider rounded-none justify-between"
              >
                <div className="line-clamp-1 flex text-left gap-2">
                  <div className="flex-1 line-clamp-2 max-sm:line-clamp-3 ">
                    {" "}
                    {getLabel?.(item)}
                    {getSubLabel && getSubLabel(item)
                      ? ` ${getSubLabel(item)}`
                      : ""}
                  </div>
                </div>
                <ChevronRightIcon />
              </SearchBarResultsItem>
            ))}

            {hasQuery && dataTotal && singlePageTotal && (
              <div className="p-4 rounded-lg text-body-sm text-txt-black-500 flex justify-between items-center">
                Memaparkan {singlePageTotal} dari {dataTotal} jumlah carian.
                <Button
                  variant={"primary-ghost"}
                  className="gap-2.5"
                  onClick={() => {
                    if (handleSearchEnter && inputRef.current) {
                      const syntheticEvent = {
                        key: "Enter",
                        currentTarget: inputRef.current,
                        target: inputRef.current,
                        preventDefault: () => {},
                        stopPropagation: () => {},
                      } as unknown as React.KeyboardEvent<HTMLInputElement>;
                      handleSearchEnter(syntheticEvent);
                    }
                  }}
                >
                  Lihat Semua
                  <ButtonIcon>
                    <ArrowOutgoingIcon className="size-4 " />
                  </ButtonIcon>
                </Button>
              </div>
            )}
          </SearchBarResultsList>
        )}
      </SearchBarResults>
    </SearchBar>
  );
}
