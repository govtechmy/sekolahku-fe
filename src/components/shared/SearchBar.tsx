import {
  SearchBar,
  SearchBarInput,
  SearchBarInputContainer,
  SearchBarSearchButton,
  SearchBarResults,
  SearchBarResultsList,
  SearchBarClearButton,
  SearchBarHint,
  SearchBarResultsItem,
} from "@govtechmy/myds-react/search-bar";
import { Pill } from "@govtechmy/myds-react/pill";
import { ChevronRightIcon, UserIcon } from "@govtechmy/myds-react/icon";

export default function SearchBarMain({
  shortdesc, desc, hasFocus, setHasFocus, query, setQuery, hasQuery, inputRef, results, onClick
}: {
  shortdesc?: string;
  desc?: string;
  hasFocus: boolean;
  setHasFocus: (value: boolean) => void;
  query: string;
  setQuery: (value: string) => void;
  hasQuery: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  results: { key: string; name: string; note: string }[];
  onClick: (id: string) => void;
}) {

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
          placeholder={shortdesc ? shortdesc : `Cari kata kunci: ${desc}`}
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
        {results.length > 0 ? (
          <SearchBarResultsList className="max-h-[400px] overflow-y-scroll">
            {results.map((item) => (
              <SearchBarResultsItem key={item.key} value={item.name} onSelect={() => onClick(item.key)}
              >
                <span className="bg-primary-50 text-txt-primary rounded-full p-px">
                  <UserIcon className="size-4" />
                </span>
                <p className="line-clamp-1 flex-1 text-start">
                  {item.name}
                  <span className="ml-2 text-txt-black-500 text-xs">
                    {item.note}
                  </span>
                </p>
                <ChevronRightIcon />
              </SearchBarResultsItem>
            ))}
          </SearchBarResultsList>
        ) : (
          <p className="text-txt-black-900 text-center">No results found</p>
        )}
      </SearchBarResults>
    </SearchBar>
  );
}
