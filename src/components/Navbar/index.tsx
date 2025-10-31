import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import Logo from "./source/Logo.png";
import SearchIcon from "../PageCover/source/search.svg";
import Link from "next/link";
import { searchAll, type SearchItem } from "../../data/searchIndex";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  
  const results: SearchItem[] = useMemo(() => (query.trim() ? searchAll(query).slice(0, 8) : []), [query]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const desktopSearchRef = useRef<HTMLFormElement | null>(null);
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === "/") return router.pathname === "/";
    return router.pathname.startsWith(path);
  };

  const linkBase = "font-reguler transition-colors";
  const activeStyle = "underline underline-offset-4 text-orange-500";
  const inactiveStyle = "hover:text-orange-500";

  const openSelected = () => {
    if (!results.length) return;
    const target = results[Math.max(0, activeIdx)] || results[0];
    setOpenDropdown(false);
    setIsOpen(false);
    router.push(target.path);
  };

  const onDesktopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openSelected();
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (ev: MouseEvent) => {
      if (!desktopSearchRef.current) return;
      if (!desktopSearchRef.current.contains(ev.target as Node)) {
        setOpenDropdown(false);
        setActiveIdx(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
  <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 md:px-10 py-4 bg-white/70 backdrop-blur-md shadow-sm z-50">
      <div className="flex items-center gap-3">
        <Link href="/" aria-label="Beranda">
          <img
            src={typeof Logo === 'string' ? Logo : (Logo as any).src}
            alt="RS Mentari"
            className="h-9 w-auto cursor-pointer select-none"
          />
        </Link>
      </div>

    {/* Menu desktop */}
  <div className="hidden lg:flex gap-10 text-black-100 text-lg font-reguler font-be-vietnam absolute left-1/2 transform -translate-x-1/2 z-40">
        <Link href="/" className={`${linkBase} ${isActive("/") ? activeStyle : inactiveStyle}`}>Beranda</Link>
  <Link href="/menu/Dokter" className={`${linkBase} ${isActive("/menu/Dokter") ? activeStyle : inactiveStyle}`}>Dokter</Link>
        <Link href="/menu/Fasilitas" className={`${linkBase} ${isActive("/menu/Fasilitas") ? activeStyle : inactiveStyle}`}>Fasilitas</Link>
    <Link href="/menu/layanan" className={`${linkBase} ${isActive("/menu/layanan") ? activeStyle : inactiveStyle}`}>Layanan</Link>
          <Link href="/menu/Paket" className={`${linkBase} ${isActive("/menu/Paket") ? activeStyle : inactiveStyle}`}>Paket</Link>
        <Link href="#" className={`${linkBase} ${inactiveStyle}`}>Artikel</Link>
        <Link href="#" className={`${linkBase} ${inactiveStyle}`}>Karir</Link>
      </div>

  {/* Desktop search + appointment grouped (show on lg+) */}
  <div className="hidden lg:flex items-center gap-3">
    {!isActive("/") && (
      <form ref={desktopSearchRef} onSubmit={onDesktopSubmit} className="flex items-center relative">
        <div className="flex items-stretch rounded-md overflow-hidden border border-stone-300 shadow-sm">
            <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpenDropdown(true); setActiveIdx(-1); }}
            onFocus={() => { if (results.length) setOpenDropdown(true); }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setOpenDropdown(true);
                setActiveIdx((prev) => Math.min(results.length - 1, prev + 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIdx((prev) => Math.max(-1, prev - 1));
              } else if (e.key === 'Enter') {
                if (openDropdown) {
                  e.preventDefault();
                  openSelected();
                }
              } else if (e.key === 'Escape') {
                setOpenDropdown(false);
                setActiveIdx(-1);
              }
            }}
            placeholder="Cari..."
            className="h-10 w-40 md:w-56 px-3 bg-white text-stone-600 text-sm focus:outline-none"
            aria-label="Cari"
          />
          <button type="submit" className="h-10 w-10 bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600">
            <img src={typeof SearchIcon === 'string' ? SearchIcon : (SearchIcon as any).src} alt="Cari" className="w-4 h-4" />
          </button>
        </div>

        {openDropdown && results.length > 0 && (
          <div className="absolute top-full left-0 mt-2 w-56 max-w-[60vw] bg-white border border-stone-200 rounded-lg shadow-xl z-50">
            <ul className="py-2 max-h-80 overflow-auto">
              {results.map((item, idx) => (
                <li key={`${item.path}-${idx}`}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIdx(idx)}
                    onClick={async () => { await router.push(item.path); setOpenDropdown(false); }}
                    className={`w-full text-left px-4 py-2 hover:bg-stone-100 ${idx === activeIdx ? 'bg-stone-100' : ''}`}
                  >
                    <div className="text-[10px] uppercase tracking-wide text-stone-500">{item.type}</div>
                    <div className="text-sm font-medium text-stone-800">{item.title}</div>
                    {item.description && (
                      <div className="text-xs text-stone-600 line-clamp-2">{item.description}</div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    )}

    <Link href="/menu/Dokter" className="bg-orange-500 text-white font-reguler px-5 py-2 rounded-md hover:bg-orange-600 transition">
        Buat Janji
      </Link>
      </div>

      <button
        className="lg:hidden text-black"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Mobile menu */}
    {isOpen && (
  <div className="absolute top-16 left-0 w-full bg-white flex flex-col gap-4 p-6 shadow-md lg:hidden z-50 font-be-vietnam">
          <div className="flex items-center w-full mb-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari..."
              className="w-full h-8 px-2 bg-transparent text-stone-400 text-xs font-normal border border-stone-400 rounded-l-[5px] focus:outline-none"
            />
            <button onClick={() => openSelected()} className="w-10 h-8 bg-orange-500 rounded-r-[5px] flex items-center justify-center">
              <img src={typeof SearchIcon === 'string' ? SearchIcon : (SearchIcon as any).src} alt="search" className="w-5 h-5" />
            </button>
          </div>
          {/* Mobile inline results */}
          {query.trim() && results.length > 0 && (
            <div className="-mt-2 mb-2">
              <ul className="divide-y divide-stone-200 border border-stone-200 rounded-md overflow-hidden">
                {results.map((item, idx) => (
                  <li key={`${item.path}-${idx}`}>
                    <button
                      type="button"
                      onClick={async () => { await router.push(item.path); setIsOpen(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-stone-50"
                    >
                      <div className="text-[10px] uppercase tracking-wide text-stone-500">{item.type}</div>
                      <div className="text-sm font-medium text-stone-800">{item.title}</div>
                      {item.description && (
                        <div className="text-xs text-stone-600 line-clamp-2">{item.description}</div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
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