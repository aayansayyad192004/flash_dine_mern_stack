import { Link } from "react-router-dom";
import MobileNav from "./MobileNav";
import MainNav from "./MainNav";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-green-500 to-lime-500 text-white shadow-lg py-5 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
      <Link
        to="/"
        className="text-4xl font-extrabold tracking-wide hover:scale-105 transition-transform duration-300"
      >
        <span className="text-white drop-shadow-sm">Flash</span>
        <span className="text-green-900 drop-shadow-sm">Dine</span>
        <span className="text-white">.com</span>
      </Link>




        <div className="md:hidden">
          <MobileNav />
        </div>

        <div className="hidden md:block">
          <MainNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
