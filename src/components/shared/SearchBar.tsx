import {
    SearchBar,
    SearchBarInput,
    SearchBarInputContainer,
    SearchBarSearchButton,
    SearchBarResults,
    SearchBarResultsList,
    SearchBarClearButton,
    SearchBarHint,
  } from "@govtechmy/myds-react/search-bar";
  import { Pill } from "@govtechmy/myds-react/pill";
  import { useState } from "react";
  
  export default function SearchBarMain({
    desc,
  }: {
    desc?: string;
  }) {
    const [hasFocus, setHasFocus] = useState(false);
    const [query, setQuery] = useState("");
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
            placeholder={`Cari kata kunci: ${desc}`}
            value={query}
            onValueChange={setQuery}
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
            className="truncate"
          />
          {query && <SearchBarClearButton onClick={() => setQuery("")} />}
          {!hasFocus && (
            <SearchBarHint className="hidden lg:flex">
              Tekan <Pill size="small">/</Pill> untuk cari
            </SearchBarHint>
          )}
          <SearchBarSearchButton />
        </SearchBarInputContainer>
        <SearchBarResults open={hasQuery && hasFocus}>
          {hasQuery && (
            <p className="text-txt-black-900 text-center">No results found</p>
          )}
          {hasQuery && (
            <SearchBarResultsList className="max-h-[400px] overflow-y-scroll">
              {/* {results.map((item) => (
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
              ))} */}
            </SearchBarResultsList>
          )}
        </SearchBarResults>
      </SearchBar>
    );
  }
  