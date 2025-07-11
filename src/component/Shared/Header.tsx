import { useState } from "react";
// import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { Link, NavLink } from "react-router-dom";
// import backgroundImages from "../../../public/background";

// const openCalendly = () => {
//   window.Calendly?.initPopupWidget({
//     url: "https://calendly.com/maitriai-sales/business-meet",
//     prefill: {},
//     utm: {},
//     parentElement: undefined,
//     text: {
//       submitText: "Schedule Meeting",
//       headerText: "Book Your Demo Session",
//     },
//     color: {
//       primary: "#2C3E50",
//       secondary: "#3498DB",
//       background: "#F8F9FA",
//     },
//     pageSettings: {
//       height: 5500,
//     },
//   });
//   return false;
// };

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="w-full">
      {/* Logo and Social Links */}
      {/* <div className="bg-white p-2 flex items-center justify-between px-2 sm:px-4 lg:px-5">
        <a href="/" rel="logo" className="flex-shrink-0">
          <img
            src={backgroundImages.companyLogo}
            alt="Logo"
            className="h-12 xs:h-14 sm:h-14 md:h-18 lg:h-15 xl:h-17 pl-2 sm:pl-4 md:pl-10 lg:pl-20"
          />
        </a>
        <div className="flex gap-2 xs:gap-3 sm:gap-4 lg:gap-5 text-gray-500 pr-2 sm:pr-4 md:pr-10 lg:pr-20">
          <FaFacebook className="text-base xs:text-lg sm:text-xl" />
          <FaInstagram className="text-base xs:text-lg sm:text-xl" />
          <FaTwitter className="text-base xs:text-lg sm:text-xl" />
        </div>
      </div> */}

      {/* Navigation */}
      <nav className="bg-[#0049AC] shadow-md relative">
        <div className="flex justify-between items-center p-2 xs:p-3 sm:p-4 px-2 xs:px-4 sm:px-6 lg:px-12">
          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-3 lg:space-x-6 text-white pl-2 sm:pl-4 md:pl-10 lg:pl-20 text-sm lg:text-base">
            <Link to="/" className="cursor-pointer hover:text-gray-300">
              Home
            </Link>
            <Link
              to="https://worldoffinrep.com/about/"
              className="cursor-pointer hover:text-gray-300"
            >
              About Us
            </Link>
            {/* <li className="cursor-pointer hover:text-gray-300">Services</li>
            <li className="cursor-pointer hover:text-gray-300">Resources</li>
            <li className="cursor-pointer hover:text-gray-300">Testimonials</li> */}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white pl-1 xs:pl-2"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <RiCloseLine size={24} /> : <RiMenu3Line size={24} />}
          </button>

          {/* Buttons */}
          <div className="space-x-1 xs:space-x-2 sm:space-x-3 lg:space-x-4 pr-1 xs:pr-2 sm:pr-4 md:pr-6 lg:pr-10 flex items-center">
            <Link to={"/login"}>
              <button className="text-white px-1 xs:px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded text-xs xs:text-sm lg:text-base whitespace-nowrap">
                {/* Sign In */}
                Login 
              </button>
            </Link>
            {/* <NavLink to="/book-demo">
              <button
                className="bg-[#008F98] text-white px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded cursor-pointer text-xs xs:text-sm lg:text-base whitespace-nowrap"
                onClick={openCalendly}
              >
                Book a Demo
              </button>
            </NavLink> */}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
  <div className="md:hidden flex flex-col items-center space-y-2 xs:space-y-3 sm:space-y-4 py-2 xs:py-3 sm:py-4 bg-[#0049AC] text-white absolute w-full z-50">
    <ul className="space-y-2 sm:space-y-4 w-full text-sm sm:text-base">
      <li className="w-full">
        <Link
          to="/"
          onClick={() => setIsMenuOpen(false)}
          className="block cursor-pointer hover:bg-[#003d90] px-4 sm:px-6 py-1.5 sm:py-2 text-center"
        >
          Home
        </Link>
      </li>
      <li className="w-full">
        <Link
          to="https://worldoffinrep.com/about/"
          onClick={() => setIsMenuOpen(false)}
          className="block cursor-pointer hover:bg-[#003d90] px-4 sm:px-6 py-1.5 sm:py-2 text-center"
        >
          About Us
        </Link>
      </li>
      {/* <li
        className="cursor-pointer hover:bg-[#003d90] px-4 sm:px-6 py-1.5 sm:py-2 text-center"
        onClick={() => setIsMenuOpen(false)}
      >
        Services
      </li>
      <li
        className="cursor-pointer hover:bg-[#003d90] px-4 sm:px-6 py-1.5 sm:py-2 text-center"
        onClick={() => setIsMenuOpen(false)}
      >
        Resources
      </li>
      <li
        className="cursor-pointer hover:bg-[#003d90] px-4 sm:px-6 py-1.5 sm:py-2 text-center"
        onClick={() => setIsMenuOpen(false)}
      >
        Testimonials
      </li> */}
    </ul>
  </div>
)}

      </nav>
    </div>
  );
};

export default Header;
