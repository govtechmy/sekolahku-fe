import { beforeEach, describe, expect, it, vi } from "vitest";

const get = vi.fn();

vi.mock("./http", () => ({
  authAxios: {
    get: (...args: unknown[]) => get(...args),
  },
}));

const nearbyResponse = () => ({
  data: {
    data: {
      markerGroups: [
        {
          kodSekolah: "ABC1234",
          infoLokasi: { koordinatXX: 3, koordinatYY: 101 },
        },
      ],
    },
  },
});

/** Fresh module graph so the service-level caches reset between tests. */
const loadService = async () => {
  vi.resetModules();
  return import("./school.svc");
};

describe("school.svc request caching", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getSchoolNearby", () => {
    it("serves an identical follow-up request from cache", async () => {
      get.mockResolvedValue(nearbyResponse());
      const { getSchoolNearby } = await loadService();

      const params = {
        latitude: 3.139,
        longitude: 101.6869,
        radiusInMeter: 20000,
      };
      await getSchoolNearby(params);
      await getSchoolNearby({ ...params });

      expect(get).toHaveBeenCalledTimes(1);
    });

    it("shares one request when a prefetch is still in flight", async () => {
      let resolve: (v: unknown) => void = () => {};
      get.mockReturnValue(
        new Promise((r) => {
          resolve = r;
        }),
      );
      const { getSchoolNearby } = await loadService();

      const params = {
        latitude: 3.139,
        longitude: 101.6869,
        radiusInMeter: 20000,
      };
      const prefetch = getSchoolNearby(params);
      const onMount = getSchoolNearby({ ...params });

      resolve(nearbyResponse());
      await Promise.all([prefetch, onMount]);

      expect(get).toHaveBeenCalledTimes(1);
    });

    it("still fetches when the viewport differs", async () => {
      get.mockResolvedValue(nearbyResponse());
      const { getSchoolNearby } = await loadService();

      await getSchoolNearby({
        latitude: 3.139,
        longitude: 101.6869,
        radiusInMeter: 20000,
      });
      await getSchoolNearby({
        latitude: 5.414,
        longitude: 100.329,
        radiusInMeter: 20000,
      });

      expect(get).toHaveBeenCalledTimes(2);
    });

    it("treats a name filter as a distinct request", async () => {
      get.mockResolvedValue(nearbyResponse());
      const { getSchoolNearby } = await loadService();

      const params = {
        latitude: 3.139,
        longitude: 101.6869,
        radiusInMeter: 20000,
      };
      await getSchoolNearby(params);
      await getSchoolNearby({ ...params, name: "smk" });

      expect(get).toHaveBeenCalledTimes(2);
    });

    it("retries after a failure instead of caching the error", async () => {
      get
        .mockRejectedValueOnce(new Error("network"))
        .mockResolvedValue(nearbyResponse());
      const { getSchoolNearby } = await loadService();
      const params = {
        latitude: 3.139,
        longitude: 101.6869,
        radiusInMeter: 20000,
      };

      await expect(getSchoolNearby(params)).rejects.toThrow("network");
      await expect(getSchoolNearby(params)).resolves.toBeDefined();

      expect(get).toHaveBeenCalledTimes(2);
    });
  });

  describe("getSchoolTypes", () => {
    it("caches per peringkat", async () => {
      get.mockResolvedValue({ data: { data: ["SMK", "TIADA MAKLUMAT"] } });
      const { getSchoolTypes } = await loadService();

      const first = await getSchoolTypes("MENENGAH");
      await getSchoolTypes("MENENGAH");

      expect(get).toHaveBeenCalledTimes(1);
      // "TIADA MAKLUMAT" is filtered out before caching.
      expect(first).toEqual(["SMK"]);

      await getSchoolTypes("RENDAH");
      expect(get).toHaveBeenCalledTimes(2);
    });
  });

  describe("getAllSchoolMarkers", () => {
    const school = (kod: string) => ({
      kodSekolah: kod,
      namaSekolah: `SK ${kod}`,
      data: {
        infoLokasi: {
          location: { coordinates: [101.6869, 3.139] },
          koordinatXX: 101.6869,
          koordinatYY: 3.139,
        },
        infoPentadbiran: {},
        infoSekolah: {},
        infoKomunikasi: {},
      },
    });

    const pagedResponse = (codes: string[], totalRecords: number) => ({
      data: { data: { items: codes.map(school), totalRecords } },
    });

    it("fetches the heavy payload only once", async () => {
      get.mockResolvedValue(pagedResponse(["ABC1234"], 1));
      const { getAllSchoolMarkers } = await loadService();

      const points = await getAllSchoolMarkers();
      await getAllSchoolMarkers();

      expect(get).toHaveBeenCalledTimes(1);
      expect(points).toHaveLength(1);
    });

    it("keeps schools that only provide legacy coordinates", async () => {
      const legacySchool = school("LEGACY1");
      legacySchool.namaSekolah = "SK NILAI IMPIAN";
      legacySchool.data.infoLokasi = {
        location: { coordinates: [] },
        koordinatXX: 101.798,
        koordinatYY: 2.824,
      };
      get.mockResolvedValue({
        data: { data: { items: [legacySchool], totalRecords: 1 } },
      });
      const { getAllSchoolMarkers } = await loadService();

      const points = await getAllSchoolMarkers();

      expect(points).toEqual([
        expect.objectContaining({
          kodSekolah: "LEGACY1",
          namaSekolah: "SK NILAI IMPIAN",
          lng: 101.798,
          lat: 2.824,
        }),
      ]);
    });

    it("drops schools without any usable coordinates", async () => {
      const invalidSchool = school("INVALID1");
      invalidSchool.data.infoLokasi = {
        location: { coordinates: [] },
        koordinatXX: Number.NaN,
        koordinatYY: Number.NaN,
      };
      get.mockResolvedValue({
        data: { data: { items: [invalidSchool], totalRecords: 1 } },
      });
      const { getAllSchoolMarkers } = await loadService();

      await expect(getAllSchoolMarkers()).resolves.toEqual([]);
    });

    it("pages the dataset instead of one huge request", async () => {
      // 3 pages worth: first response advertises the total, so the remaining
      // pages can be fetched in parallel.
      get.mockImplementation((url: string) => {
        const page = Number(new URL(url, "http://x").searchParams.get("page"));
        return Promise.resolve(pagedResponse([`P${page}A`, `P${page}B`], 6251));
      });
      const { getAllSchoolMarkers } = await loadService();

      const points = await getAllSchoolMarkers();

      // ceil(6251 / 2500) = 3 pages
      expect(get).toHaveBeenCalledTimes(3);
      const pagesRequested = get.mock.calls
        .map((c) => Number(new URL(c[0], "http://x").searchParams.get("page")))
        .sort();
      expect(pagesRequested).toEqual([1, 2, 3]);
      expect(get.mock.calls[0][0]).toContain("pageSize=2500");
      expect(points).toHaveLength(6);
    });

    it("de-duplicates schools that appear on more than one page", async () => {
      get.mockImplementation((url: string) => {
        const page = Number(new URL(url, "http://x").searchParams.get("page"));
        // Page 2 repeats a record from page 1.
        const codes = page === 1 ? ["DUP1", "ONE"] : ["DUP1", "TWO"];
        return Promise.resolve(pagedResponse(codes, 5000));
      });
      const { getAllSchoolMarkers } = await loadService();

      const points = await getAllSchoolMarkers();

      expect(points.map((p) => p.kodSekolah).sort()).toEqual([
        "DUP1",
        "ONE",
        "TWO",
      ]);
    });
  });

  describe("subscribeSchoolMarkers", () => {
    const school = (kod: string) => ({
      kodSekolah: kod,
      namaSekolah: `SK ${kod}`,
      data: {
        infoLokasi: { location: { coordinates: [101.6869, 3.139] } },
        infoPentadbiran: {},
        infoSekolah: {},
        infoKomunikasi: {},
      },
    });
    const pagedResponse = (codes: string[], totalRecords: number) => ({
      data: { data: { items: codes.map(school), totalRecords } },
    });

    it("publishes the first page before the rest have loaded", async () => {
      let resolvePage2: (v: unknown) => void = () => {};
      get.mockImplementation((url: string) => {
        const page = Number(new URL(url, "http://x").searchParams.get("page"));
        if (page === 1) return Promise.resolve(pagedResponse(["FIRST"], 5000));
        return new Promise((r) => {
          resolvePage2 = r;
        });
      });
      const { subscribeSchoolMarkers } = await loadService();

      const batches: string[][] = [];
      subscribeSchoolMarkers((points) =>
        batches.push(points.map((p) => p.kodSekolah)),
      );

      // Page 1 must reach subscribers while page 2 is still in flight — this is
      // what puts pins on screen early.
      await vi.waitFor(() => expect(batches.length).toBeGreaterThan(0));
      expect(batches[0]).toEqual(["FIRST"]);

      resolvePage2(pagedResponse(["SECOND"], 5000));
      await vi.waitFor(() =>
        expect(batches[batches.length - 1]).toEqual(["FIRST", "SECOND"]),
      );
    });

    it("replays the cached dataset to a late subscriber", async () => {
      get.mockResolvedValue(pagedResponse(["ONLY"], 1));
      const { subscribeSchoolMarkers, getAllSchoolMarkers } =
        await loadService();

      await getAllSchoolMarkers();
      get.mockClear();

      const seen: string[][] = [];
      subscribeSchoolMarkers((points) =>
        seen.push(points.map((p) => p.kodSekolah)),
      );

      expect(seen).toEqual([["ONLY"]]);
      expect(get).not.toHaveBeenCalled();
    });

    it("stops notifying after unsubscribe", async () => {
      get.mockResolvedValue(pagedResponse(["ONLY"], 1));
      const { subscribeSchoolMarkers } = await loadService();

      const calls: number[] = [];
      const unsubscribe = subscribeSchoolMarkers((p) => calls.push(p.length));
      await vi.waitFor(() => expect(calls.length).toBeGreaterThan(0));
      const seenBefore = calls.length;
      unsubscribe();

      // Any further publishing must not reach this listener.
      await new Promise((r) => setTimeout(r, 20));
      expect(calls.length).toBe(seenBefore);
    });
  });
});
