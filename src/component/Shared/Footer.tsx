
import { FaInstagram } from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";
import { IoCallOutline } from "react-icons/io5";
import backgroundImages from "../../../public/background";


const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-6 sm:py-8 md:py-10 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6 sm:gap-8 md:gap-10">
        {/* Logo and Company Info Section */}
        <div className="flex-1 max-w-full md:max-w-md">
          <img
            src={backgroundImages.companyLogo}
            alt="Logo"
            className="mb-3 sm:mb-4 h-10 xs:h-12 sm:h-14 md:h-16 w-auto"
          />
          <p className="text-xs xs:text-sm md:text-base text-gray-200 pr-2">
          Address: 1234 Main Street, Anytown 
          </p>
          <div className="flex gap-4 sm:gap-5 md:gap-6 mt-4 sm:mt-5 md:mt-6 text-xl sm:text-2xl">
            <FaInstagram className="hover:text-gray-300 cursor-pointer" />
            <FaSquareFacebook className="hover:text-gray-300 cursor-pointer" />
            <IoCallOutline className="hover:text-gray-300 cursor-pointer" />
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 gap-4 xs:gap-5 sm:gap-6 text-xs xs:text-sm md:text-base mt-2 md:mt-0">
          <div>
            <h3 className="font-semibold mb-2 xs:mb-3 text-sm xs:text-base">
Quick Links
            </h3>
            <ul className="space-y-2 xs:space-y-3">
              <li className="hover:text-gray-300 cursor-pointer">Home</li>
              <li className="hover:text-gray-300 cursor-pointer">Product</li>
              <li className="hover:text-gray-300 cursor-pointer">About</li>
              <li className="hover:text-gray-300 cursor-pointer">Blog</li>
            </ul>
          </div>

          {/* <div>
            <h3 className="font-semibold mb-2 xs:mb-3 text-sm xs:text-base">
              Support
            </h3>
            <ul className="space-y-2 xs:space-y-3">
              <li className="hover:text-gray-300 cursor-pointer">FAQ</li>
              <li className="hover:text-gray-300 cursor-pointer">Community</li>
              <li className="hover:text-gray-300 cursor-pointer">
                Join the Team
              </li>
              <li className="hover:text-gray-300 cursor-pointer">
                Legal Stuff
              </li>
              <li className="hover:text-gray-300 cursor-pointer">
                Terms of Service
              </li>
            </ul>
          </div> */}
        </div>
      </div>

      {/* Copyright Section */}
      <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-gray-700 text-center md:text-left text-xs xs:text-sm text-gray-300">
        <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
