import FooterMyds from "./FooterMyds";
import MastheadMyds from "./MastheadMyds";
import NavbarMyds from "./NavbarMyds";
import { Outlet } from "react-router-dom";

export default function LayoutMain() {
  return (
    <div className="flex flex-col min-h-screen">
      <MastheadMyds></MastheadMyds>
      <NavbarMyds></NavbarMyds>

      {/* use outlet instead of children to tell where to render child routes for the current route hierarchy. */}
      <main className="flex-grow">
        <Outlet />
      </main>

      <FooterMyds></FooterMyds>
    </div>
  );
}
