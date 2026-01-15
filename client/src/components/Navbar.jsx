import React from "react";
import logo from "../assets/assets/logo.svg";
import { BoxIcon, GripIcon, ListIcon, Menu as MenuIcon, MessageCircleMoreIcon, X as XIcon } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {useUser,  useClerk , UserButton} from "@clerk/clerk-react"

const Navbar = () => {
  const {user} = useUser();
  const { openSignIn } = useClerk();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const scrollTo = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigate = useNavigate();
  return (
    <nav className="h-20">
      <div className="fixed left-0 top-0 right-0 z-100 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white transition">
        {/* Logo */}
        <img
          src={logo}
          alt="Logo"
          className="h-10 w-auto cursor-pointer"
          onClick={() => {
            navigate("/");
            scrollTo();
          }}
        />

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-4 md:gap-8 max-md:text-sm text-gray-800">
          <Link to="/" onClick={scrollTo} className="cursor-pointer hover:text-indigo-600 transition">
            Home
          </Link>
          <Link to="/marketplace" onClick={scrollTo} className="cursor-pointer hover:text-indigo-600 transition">
            MarketPlace
          </Link>
          <Link
            to={user ? "/messages" : "#"}
            onClick={() => user ? scrollTo() : openSignIn()}
            className="cursor-pointer hover:text-indigo-600 transition"
          >
            Messages
          </Link>
          <Link
            to={user ? "/my-listings" : "#"}
            onClick={() => user ? scrollTo() : openSignIn()}
            className="cursor-pointer hover:text-indigo-600 transition"
          >
            My Listings
          </Link>
        </div>
        
        {!user ? (
            <div>
              <button onClick={openSignIn} className="hidden sm:block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition">
                Login
              </button>
              <MenuIcon onClick={()=>setMenuOpen(true)} className = 'sm:hidden'/>
            </div>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label="MarketPlace" labelIcon={<GripIcon size={16}/>} 
              onClick={()=>navigate('/marketplace')} />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label="Messages" labelIcon={<MessageCircleMoreIcon size={16}/>} 
              onClick={()=>navigate('/messages')} />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label="My Listings" labelIcon={<ListIcon size={16}/>} 
              onClick={()=>navigate('/my-listings')} />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label="My Orders" labelIcon={<BoxIcon size={16}/>} 
              onClick={()=>navigate('/myorders')} />
            </UserButton.MenuItems>
          </UserButton>
        )}
        
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden flex flex-col space-y-1 cursor-pointer"
        >
          <span className="w-6 h-0.5 bg-gray-800"></span>
          <span className="w-6 h-0.5 bg-gray-800"></span>
          <span className="w-6 h-0.5 bg-gray-800"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden flex flex-col items-center gap-4 py-6 bg-white border-b border-gray-300 text-gray-700">
          {/* <Link to='/' onClick={scrollTo} className="cursor-pointer">
            Home
          </Link> */}
          <Link to='/marketplace' onClick={()=>setMenuOpen(false)} className="cursor-pointer">
            MarketPlace
          </Link>
          <button onClick={openSignIn}>
            Messages
          </button>
          <button onClick={openSignIn}>
            My Listings
          </button>

          <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition">
            Login
          </button>
          <XIcon onClick={()=>setMenuOpen(false)} className='absolute size-8 right-6 top-6 text-gray-500 hover:text-gray-700 cursor-pointer'/>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
