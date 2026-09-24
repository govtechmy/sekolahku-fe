import MastheadMyds from "./MastheadMyds";
import NavbarMyds from "./NavbarMyds";
import { Outlet } from "react-router-dom";

export default function LayoutMap() {
  // dvh, not vh: 100vh on mobile Safari/Chrome runs under the browser
  // toolbar and hides the map controls at the bottom.
  return (
    <div className="flex h-dvh flex-col">
      <MastheadMyds></MastheadMyds>
      <NavbarMyds></NavbarMyds>
      {/* use outlet instead of children to tell where to render child routes for the current route hierarchy. */}
      <Outlet></Outlet>
    </div>
  );
}
