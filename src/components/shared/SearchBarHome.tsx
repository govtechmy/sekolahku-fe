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
import { ChevronRightIcon, UserIcon } from "@govtechmy/myds-react/icon";
import { useState } from "react";
import { useMapViewStore } from "../../store/mapView";

export default function SearchBarHome() {
  const [hasFocus, setHasFocus] = useState(false);
  const {
    query,
    setQuery,
    handleSearch
  } = useMapViewStore();

  
  handleSearch({
    namaSekolah: query.trim().length >= 3 ? query : "",
    negeri: "ALL",
    jenis: "ALL",
  });

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
          placeholder="Carian sekolah, siaran"
          value={query}
          onValueChange={setQuery}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
        />
        {query && <SearchBarClearButton onClick={() => setQuery("")} />}
        {!hasFocus && (
          <SearchBarHint className="hidden lg:flex">
            Tekan untuk cari <Pill size="small">/</Pill>
          </SearchBarHint>
        )}
        <SearchBarSearchButton />
      </SearchBarInputContainer>
      <SearchBarResults open={hasQuery && hasFocus}>
        {hasQuery && !results.length && (
          <p className="text-txt-black-900 text-center">No results found</p>
        )}
        {hasQuery && results.length > 0 && (
          <SearchBarResultsList className="max-h-[400px] overflow-y-scroll">
            {results.map((item) => (
              <SearchBarResultsItem key={item.name} value={item.name}>
                <span className="bg-primary-50 text-txt-primary rounded-full p-px">
                  <UserIcon className="size-4" />
                </span>
                <p className="line-clamp-1 flex-1">
                  {item.name}
                  <span className="text-txt-black-500 text-xs">
                    {item.note}
                  </span>
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
