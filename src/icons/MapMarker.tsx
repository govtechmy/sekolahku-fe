import L from "leaflet";
import { renderToString } from "react-dom/server";
import { SekolahMarkerIcon } from "./SekolahMarkerIcon";
import { NegeriMarkerIcon } from "./NegeriMarkerIcon";
import { ParlimenMarkerIcon } from "./ParlimenMarkerIcon";

const ICON_SIZE: [number, number] = [32, 32];
const ICON_ANCHOR: [number, number] = [16, 32];
const POPUP_ANCHOR: [number, number] = [0, -32];

const sekolahMarkerHtml = renderToString(SekolahMarkerIcon());
const parlimenMarkerHtml = renderToString(ParlimenMarkerIcon("PARLIMEN"));
const negeriMarkerHtml = renderToString(NegeriMarkerIcon("NEGERI"));

const createDivIcon = (html: string, typeClass: string) =>
  new L.DivIcon({
    className: `${typeClass}`,
    html,
    iconSize: ICON_SIZE,
    iconAnchor: ICON_ANCHOR,
    popupAnchor: POPUP_ANCHOR,
  });

export const sekolahMarkerIcon = createDivIcon(
  sekolahMarkerHtml,
  "sekolah-marker-icon"
);

export const parlimenMarkerIcon = createDivIcon(
  parlimenMarkerHtml,
  "parlimen-marker-icon"
);

export const negeriMarkerIcon = createDivIcon(
  negeriMarkerHtml,
  "negeri-marker-icon"
);