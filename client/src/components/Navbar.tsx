import { useState } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import logo from "../../images/logo.png";

interface NavbarItemProps {
  title: string;
  classProps?: string;
}

export default function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);

  const NavbarItem = ({ title, classProps }: NavbarItemProps) => (
    <li
      className={`mx-4 cursor-pointer text-[#1F2A36] text-sm md:text-[15px] font-medium tracking-wide hover:opacity-80 transition-colors duration-150 ${classProps}`}
    >
      {title}
    </li>
  );

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <img src={logo} alt="logo" className="w-32 cursor-pointer" />
      </div>

      <ul className="md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {["Market", "Exchange", "Tutorials", "Wallets"].map((item, index) => (
          <NavbarItem key={item + index} title={item} />
        ))}
      </ul>

      <div className="flex relative">
        {toggleMenu ? (
          <AiOutlineClose
            fontSize={28}
            className="md:hidden cursor-pointer text-[#1F2A36]"
            onClick={() => setToggleMenu(false)}
          />
        ) : (
          <HiMenuAlt4
            fontSize={28}
            className="md:hidden cursor-pointer text-[#1F2A36]"
            onClick={() => setToggleMenu(true)}
          />
        )}

        {toggleMenu && (
          <ul className="z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none flex flex-col justify-start items-end rounded-md white-glassmorphism text-[#1F2A36] animate-slide-in bg-white/70">
            <li className="text-xl w-full my-2 text-[#1F2A36]">
              <AiOutlineClose onClick={() => setToggleMenu(false)} />
            </li>

            {["Market", "Exchange", "Tutorials", "Wallets"].map(
              (item, index) => (
                <NavbarItem
                  key={item + index}
                  title={item}
                  classProps="my-2 text-lg"
                />
              )
            )}
          </ul>
        )}
      </div>
    </nav>
  );
}
