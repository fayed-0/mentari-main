import React, { useState } from "react";
import { useRouter } from "next/router";
import Logo from "./source/Logo.png";
import SearchIcon from "../PageCover/source/search.svg";
import Link from "next/link";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === "/") return router.pathname === "/";
    return router.pathname.startsWith(path);
  };

  const linkBase = "font-reguler transition-colors";
  const activeStyle = "underline underline-offset-4 text-orange-500";
  const inactiveStyle = "hover:text-orange-500";

  return (
  <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 md:px-10 py-4 bg-white/70 backdrop-blur-md shadow-sm z-50">
      <div className="flex items-center gap-3">
        <img
          src={typeof Logo === 'string' ? Logo : (Logo as any).src}
          alt="logo"
          className="h-9 w-auto"
        />
      </div>

      {/* Menu desktop */}
  <div className="hidden md:flex gap-10 text-black-100 text-lg font-reguler font-be-vietnam">
        <Link href="/" className={`${linkBase} ${isActive("/") ? activeStyle : inactiveStyle}`}>Beranda</Link>
  <Link href="/menu/Dokter" className={`${linkBase} ${isActive("/menu/Dokter") ? activeStyle : inactiveStyle}`}>Dokter</Link>
        <Link href="/menu/Fasilitas" className={`${linkBase} ${isActive("/menu/Fasilitas") ? activeStyle : inactiveStyle}`}>Fasilitas</Link>
    <Link href="/menu/layanan" className={`${linkBase} ${isActive("/menu/layanan") ? activeStyle : inactiveStyle}`}>Layanan</Link>
          <Link href="/menu/Paket" className={`${linkBase} ${isActive("/menu/Paket") ? activeStyle : inactiveStyle}`}>Paket</Link>
        <Link href="#" className={`${linkBase} ${inactiveStyle}`}>Artikel</Link>
        <Link href="#" className={`${linkBase} ${inactiveStyle}`}>Karir</Link>
      </div>

      <Link href="/menu/Dokter" className="hidden md:inline-flex bg-orange-500 text-white font-reguler px-5 py-2 rounded-md hover:bg-orange-600 transition">
        Buat Janji
      </Link>

      <button
        className="md:hidden text-black"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Mobile menu */}
      {isOpen && (
  <div className="absolute top-16 left-0 w-full bg-white flex flex-col gap-4 p-6 shadow-md md:hidden z-50 font-be-vietnam">
          <div className="flex items-center w-full mb-2">
            <input
              type="text"
              placeholder="Cari..."
              className="w-full h-8 px-2 bg-transparent text-stone-400 text-xs font-normal border border-stone-400 rounded-l-[5px] focus:outline-none"
            />
            <button className="w-10 h-8 bg-orange-500 rounded-r-[5px] flex items-center justify-center">
              <img src={typeof SearchIcon === 'string' ? SearchIcon : (SearchIcon as any).src} alt="search" className="w-5 h-5" />
            </button>
          </div>
          <Link href="/" className={`${linkBase} ${isActive("/") ? activeStyle : inactiveStyle}`}>Beranda</Link>
          <Link href="/menu/Dokter" className={`${linkBase} ${isActive("/menu/Dokter") ? activeStyle : inactiveStyle}`}>Dokter</Link>
          <Link href="/menu/Fasilitas" className={`${linkBase} ${isActive("/menu/Fasilitas") ? activeStyle : inactiveStyle}`}>Fasilitas</Link>
          <Link href="/menu/layanan" className={`${linkBase} ${isActive("/menu/layanan") ? activeStyle : inactiveStyle}`}>Layanan</Link>
            <Link href="/menu/Paket" className={`${linkBase} ${isActive("/menu/Paket") ? activeStyle : inactiveStyle}`}>Paket</Link>
          <Link href="#" className={`${linkBase} ${inactiveStyle}`}>Artikel</Link>
          <Link href="#" className={`${linkBase} ${inactiveStyle}`}>Karir</Link>
          <Link href="/menu/Dokter" className="bg-orange-500 text-white font-semibold px-5 py-2 rounded-md w-full text-center hover:bg-orange-600 transition">
            Buat Janji
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;