import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { FilterDropdowns } from "./FilterDropdowns";

describe("FilterDropdowns", () => {
  it("shows only filters supported by the school search API", () => {
    const html = renderToStaticMarkup(
      <FilterDropdowns
        selectedNegeri="ALL"
        selectedJenis="ALL"
        selectedPeringkat="ALL"
        negeriList={["JOHOR"]}
        jenisList={["SK"]}
        setSelectedNegeri={vi.fn()}
        setSelectedJenis={vi.fn()}
        setSelectedPeringkat={vi.fn()}
        onClearFilters={vi.fn()}
      />,
    );

    expect(html.match(/aria-haspopup="listbox"/g)).toHaveLength(3);
    expect(html).not.toContain("Semua Sesi");
  });
});
