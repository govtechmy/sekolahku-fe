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
import { useState, useRef } from "react";
import { useMapViewStore } from "../../store/mapView";
import { useNavigate, useParams } from "react-router-dom";

export default function SearchBarHome() {
  const [hasFocus, setHasFocus] = useState(false);
  const debounceTimerRef = useRef<number | null>(null);
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();

  const {
    query,
    setQuery,
    handleSearch,
    localSuggestions,
    setLocalSuggestions,
  } = useMapViewStore();

  const handleValueChange = (value: string) => {
    setQuery(value);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    const trimmedValue = value.trim();
    if (trimmedValue.length >= 3) {
      debounceTimerRef.current = window.setTimeout(() => {
        handleSearch({
          namaSekolah: value,
          negeri: "ALL",
          jenis: "ALL",
        });
      }, 500);
    } else {
      setLocalSuggestions([]);
    }
  };
  const hasQuery = query.length > 0;

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
          placeholder="Carian sekolah"
          value={query}
          onValueChange={handleValueChange}
          onFocus={() => setHasFocus(true)}
        />
        {query && <SearchBarClearButton onClick={() => setQuery("")} />}
        {(!query || query.trim().length === 0) && (
          <SearchBarHint className="">
            Tekan <Pill size="small">/</Pill> untuk cari
          </SearchBarHint>
        )}
        <SearchBarSearchButton />
      </SearchBarInputContainer>
      <SearchBarResults open={hasQuery && hasFocus}>
        {hasQuery && !localSuggestions.length && (
          <p className="text-txt-black-900 text-center">No results found</p>
        )}
        {hasQuery && localSuggestions.length > 0 && (
          <SearchBarResultsList className="max-h-[400px] overflow-y-scroll">
            {localSuggestions.map((item) => (
              <SearchBarResultsItem
                key={item.kodSekolah}
                value={item.namaSekolah}
                onMouseDown={(e) => e.preventDefault()}
                onSelect={() => {
                  setQuery(item.namaSekolah);
                  setHasFocus(false);
                  navigate(`/${lang || "en"}/carian-sekolah`);
                }}
              >
                <p className="line-clamp-1 flex-1 text-left">
                  {item.namaSekolah}
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
