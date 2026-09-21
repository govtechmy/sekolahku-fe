import type { BantuanDetailItem, BantuanList } from "../models/response";
import bantuanData from "../data/bantuan.json";

// Static content: exported once from the CMS (payload_cms_schoolaid.json) and
// checked into the repo. No DB seed/API call needed — bantuan-persekolahan
// content changes rarely enough that a code deploy is an acceptable update
// path. Re-run the CMS export and overwrite src/data/bantuan.json to refresh.
const BANTUAN_ITEMS = bantuanData as BantuanDetailItem[];

export const getBantuanList = async (search?: string): Promise<BantuanList> => {
  const query = search?.trim().toLowerCase();
  const items = query
    ? BANTUAN_ITEMS.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query),
      )
    : BANTUAN_ITEMS;

  return {
    items,
    totalRecords: items.length,
    pageNumber: 1,
    pageSize: items.length,
  };
};

export const getBantuanBySlug = async (
  slug: string,
): Promise<BantuanDetailItem> => {
  const item = BANTUAN_ITEMS.find((i) => i.slug === slug);
  if (!item) throw new Error(`Bantuan not found for slug: ${slug}`);
  return item;
};
