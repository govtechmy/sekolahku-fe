import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  SCHOOL_PIN_IMAGE_ID,
  ensureSchoolPinImage,
  registerSchoolPinImage,
  type PinImageEventTarget,
} from "./schoolPinImage";

/** Fake MapLibre map tracking registered images and event listeners. */
const makeFakeMap = (opts: { hasImageThrows?: boolean } = {}) => {
  const images = new Set<string>();
  const listeners = new Map<string, ((e: { id: string }) => void)[]>();

  const map = {
    images,
    hasImage: vi.fn((id: string) => {
      if (opts.hasImageThrows) throw new Error("map removed");
      return images.has(id);
    }),
    addImage: vi.fn((id: string) => {
      images.add(id);
    }),
    on: vi.fn((type: string, listener: (e: { id: string }) => void) => {
      listeners.set(type, [...(listeners.get(type) ?? []), listener]);
    }),
    off: vi.fn((type: string, listener: (e: { id: string }) => void) => {
      listeners.set(
        type,
        (listeners.get(type) ?? []).filter((l) => l !== listener),
      );
    }),
    emit: (type: string, payload: { id: string }) =>
      (listeners.get(type) ?? []).forEach((l) => l(payload)),
    listenerCount: (type: string) => (listeners.get(type) ?? []).length,
  };
  return map;
};

const fakeImage = () => ({}) as HTMLImageElement;
const loader = () => Promise.resolve(fakeImage());

describe("ensureSchoolPinImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers the pin icon with pixelRatio 2", async () => {
    const map = makeFakeMap();

    await ensureSchoolPinImage(map, loader);

    expect(map.addImage).toHaveBeenCalledWith(
      SCHOOL_PIN_IMAGE_ID,
      expect.anything(),
      { pixelRatio: 2 },
    );
    expect(map.images.has(SCHOOL_PIN_IMAGE_ID)).toBe(true);
  });

  it("does nothing when the icon is already registered", async () => {
    const map = makeFakeMap();
    map.images.add(SCHOOL_PIN_IMAGE_ID);

    await ensureSchoolPinImage(map, loader);

    expect(map.addImage).not.toHaveBeenCalled();
  });

  it("registers only once when called concurrently", async () => {
    const map = makeFakeMap();

    await Promise.all([
      ensureSchoolPinImage(map, loader),
      ensureSchoolPinImage(map, loader),
      ensureSchoolPinImage(map, loader),
    ]);

    // The post-await re-check must stop the later callers from double-adding,
    // which MapLibre would throw on.
    expect(map.addImage).toHaveBeenCalledTimes(1);
  });

  it("does not throw when the map is removed before the icon decodes", async () => {
    const images = new Set<string>();
    let removed = false;
    const map = {
      hasImage: (id: string) => {
        if (removed) throw new Error("map removed");
        return images.has(id);
      },
      addImage: vi.fn(),
    };

    const slowLoader = () =>
      new Promise<HTMLImageElement>((resolve) => {
        removed = true; // map torn down while we were decoding
        resolve(fakeImage());
      });

    await expect(
      ensureSchoolPinImage(map, slowLoader),
    ).resolves.toBeUndefined();
    expect(map.addImage).not.toHaveBeenCalled();
  });

  it("survives a failed icon decode", async () => {
    const map = makeFakeMap();
    const failing = () => Promise.reject(new Error("decode failed"));

    await expect(ensureSchoolPinImage(map, failing)).resolves.toBeUndefined();
    expect(map.addImage).not.toHaveBeenCalled();
  });

  it("swallows an addImage failure instead of breaking the map", async () => {
    const map = makeFakeMap();
    map.addImage.mockImplementation(() => {
      throw new Error("Image id school-pin already exist");
    });

    await expect(ensureSchoolPinImage(map, loader)).resolves.toBeUndefined();
  });
});

describe("registerSchoolPinImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers immediately and listens for styleimagemissing", async () => {
    const map = makeFakeMap();

    const unregister = registerSchoolPinImage(
      map as unknown as PinImageEventTarget,
      loader,
    );
    await vi.waitFor(() =>
      expect(map.images.has(SCHOOL_PIN_IMAGE_ID)).toBe(true),
    );

    expect(map.on).toHaveBeenCalledWith(
      "styleimagemissing",
      expect.any(Function),
    );
    expect(map.listenerCount("styleimagemissing")).toBe(1);

    unregister();
    expect(map.listenerCount("styleimagemissing")).toBe(0);
  });

  it("re-registers when the style drops the icon", async () => {
    const map = makeFakeMap();
    registerSchoolPinImage(map as unknown as PinImageEventTarget, loader);
    await vi.waitFor(() =>
      expect(map.images.has(SCHOOL_PIN_IMAGE_ID)).toBe(true),
    );

    // Simulate a style reload clearing user-added images, then MapLibre asking
    // for the icon again — this is the path that keeps pins from vanishing.
    map.images.clear();
    map.emit("styleimagemissing", { id: SCHOOL_PIN_IMAGE_ID });

    await vi.waitFor(() =>
      expect(map.images.has(SCHOOL_PIN_IMAGE_ID)).toBe(true),
    );
  });

  it("ignores styleimagemissing for other image ids", async () => {
    const map = makeFakeMap();
    registerSchoolPinImage(map as unknown as PinImageEventTarget, loader);
    await vi.waitFor(() =>
      expect(map.images.has(SCHOOL_PIN_IMAGE_ID)).toBe(true),
    );

    map.images.clear();
    map.addImage.mockClear();
    map.emit("styleimagemissing", { id: "some-basemap-sprite" });

    await new Promise((r) => setTimeout(r, 10));
    expect(map.addImage).not.toHaveBeenCalled();
  });
});
