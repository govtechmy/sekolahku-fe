import L from "leaflet";
import { renderToString } from "react-dom/server";
import { SekolahMarkerIcon } from "./SekolahMarkerIcon";
import { NegeriMarkerIcon } from "./NegeriMarkerIcon";
import { ParlimenMarkerIcon } from "./ParlimenMarkerIcon";
import { UserMarkerIcon } from "./UserMarkerIcon";

const ICON_SIZE: [number, number] = [32, 32];
const ICON_ANCHOR: [number, number] = [16, 32];
const POPUP_ANCHOR: [number, number] = [0, -32];

const sekolahMarkerHtml = renderToString(SekolahMarkerIcon());
const userMarkerHtml = renderToString(UserMarkerIcon());
const parlimenMarkerHtml = (total?: number | string) =>
  renderToString(ParlimenMarkerIcon(String(total ?? "")));
const negeriMarkerHtml = (total?: number | string) =>
  renderToString(NegeriMarkerIcon(String(total ?? "")));

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
  "sekolah-marker-icon",
);

export const userMarkerIcon = createDivIcon(userMarkerHtml, "user-marker-icon");

export const parlimenMarkerIcon = (total?: number | string) =>
  createDivIcon(parlimenMarkerHtml(total), "parlimen-marker-icon");

export const negeriMarkerIcon = (total?: number | string) =>
  createDivIcon(negeriMarkerHtml(total), "negeri-marker-icon");
