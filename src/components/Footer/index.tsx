import React from "react";
import Image from "next/image";
import FbIcon from "./source/fb.svg";
import IgIcon from "./source/ig.svg";
import LinkedinIcon from "./source/linkedin.svg";
import TwtIcon from "./source/twt.svg";
import BackgroundImg from "./source/background.png";
import ClockIcon from "./source/clock.svg";
import CallIcon from "./source/call.svg";
import LogoImg from "./source/logo.png";

const Footer = () => {
  return (
  <footer className="w-full bg-white font-sans relative overflow-hidden" style={{ minHeight: 476 }}>
      {/* Background Image */}
      <Image
        src={BackgroundImg}
        alt="Background"
        fill
        className="object-cover z-0 -top-[432px] left-0 h-[1041px] w-full absolute"
      />
      {/* Overlay */}
  <div className="w-full h-full absolute left-0 top-0 bg-amber-900/30" style={{ zIndex: 1 }} />
      {/* Content */}
  <div className="relative z-10 w-full max-w-[1129px] mx-auto px-4 pt-24 pb-7 flex flex-col gap-9">
  {/* Desktop Layout */}
  <div className="w-full hidden md:flex justify-between items-start">
          {/* Left Section */}
          <div className="inline-flex flex-col justify-start items-start gap-8">
            <div className="w-full flex items-center justify-start mb-2">
              <Image src={LogoImg} alt="Mentari Hospital Logo" width={180} height={180} className="object-contain" />
            </div>
            <div className="flex flex-col justify-start items-start gap-3.5">
              <div className="text-neutral-50 text-xl font-semibold leading-loose">Social Profiles</div>
              <div className="flex gap-2.5">
                  <a href="#" className="p-2.5 bg-neutral-100 rounded-md outline outline-1 outline-zinc-100 flex items-center justify-center">
                    <Image src={FbIcon} alt="Facebook" width={18} height={18} />
                  </a>
                  <a href="#" className="p-2.5 bg-neutral-100 rounded-md outline outline-1 outline-zinc-100 flex items-center justify-center">
                    <Image src={IgIcon} alt="Instagram" width={18} height={18} />
                  </a>
                  <a href="#" className="p-2.5 bg-neutral-100 rounded-md outline outline-1 outline-zinc-100 flex items-center justify-center">
                    <Image src={LinkedinIcon} alt="LinkedIn" width={18} height={18} />
                  </a>
                  <a href="#" className="p-2.5 bg-neutral-100 rounded-md outline outline-1 outline-zinc-100 flex items-center justify-center">
                    <Image src={TwtIcon} alt="Twitter" width={18} height={18} />
                  </a>
              </div>
            </div>
          </div>
          {/* Right Section */}
          <div className="w-[807px] flex justify-start items-start gap-7">
            {/* Home */}
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-3.5">
              <div className="text-neutral-50 text-xl font-semibold leading-loose">Home</div>
              <div className="flex flex-col gap-2">
                <div className="text-neutral-50 text-lg font-normal leading-relaxed">About Us</div>
                <div className="text-neutral-50 text-lg font-normal leading-relaxed">Health Care</div>
                <div className="text-neutral-50 text-lg font-normal leading-relaxed">Our Doctor</div>
                <div className="text-neutral-50 text-lg font-normal leading-relaxed">Testimonial</div>
              </div>
            </div>
            {/* Menu */}
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-3.5">
              <div className="text-neutral-50 text-xl font-semibold leading-loose">Menu</div>
              <div className="flex flex-col gap-2">
                <div className="text-neutral-50 text-lg font-normal leading-relaxed">Jadwal Dokter</div>
                <div className="text-neutral-50 text-lg font-normal leading-relaxed">Fasilitas</div>
                <div className="text-neutral-50 text-lg font-normal leading-relaxed">Paket Kesehatan</div>
                <div className="text-neutral-50 text-lg font-normal leading-relaxed">Artikel</div>
                <div className="text-neutral-50 text-lg font-normal leading-relaxed">Karir</div>
              </div>
            </div>
            {/* Work Hours */}
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-3.5">
              <div className="text-neutral-50 text-xl font-semibold leading-loose">Work Hours</div>
              <div className="w-72 inline-flex justify-start items-start gap-5 flex-wrap content-start">
                <div className="rounded-md flex justify-start items-center gap-1.5">
                  <Image src={ClockIcon} alt="Clock" width={24} height={24} />
                  <div className="text-neutral-50 text-lg font-normal leading-relaxed">24/7</div>
                </div>
                <div className="w-72 text-neutral-50 text-lg font-normal leading-relaxed">Rumah sakit kami beroperasi 24 jam setiap hari untuk memberikan pelayanan tanpa henti bagi pasien.</div>
                <div className="rounded-md flex justify-start items-center gap-1.5">
                  <Image src={CallIcon} alt="Call" width={24} height={24} />
                  <div className="text-neutral-50 text-lg font-normal leading-relaxed">+91 91813 23 2309</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="w-full flex md:hidden flex-col gap-8">
          {/* Logo & Social */}
          <div className="flex flex-col gap-4">
            <Image src={LogoImg} alt="Mentari Hospital Logo" width={140} height={140} className="object-contain" />
            <div>
              <div className="text-neutral-50 text-[14px] font-semibold mb-2">Social Profiles</div>
              <div className="flex gap-2.5">
                <a href="#" className="p-2 bg-neutral-100 rounded-md outline outline-1 outline-zinc-100 flex items-center justify-center"><Image src={FbIcon} alt="Facebook" width={18} height={18} /></a>
                <a href="#" className="p-2 bg-neutral-100 rounded-md outline outline-1 outline-zinc-100 flex items-center justify-center"><Image src={IgIcon} alt="Instagram" width={18} height={18} /></a>
                <a href="#" className="p-2 bg-neutral-100 rounded-md outline outline-1 outline-zinc-100 flex items-center justify-center"><Image src={LinkedinIcon} alt="LinkedIn" width={18} height={18} /></a>
                <a href="#" className="p-2 bg-neutral-100 rounded-md outline outline-1 outline-zinc-100 flex items-center justify-center"><Image src={TwtIcon} alt="Twitter" width={18} height={18} /></a>
              </div>
            </div>
          </div>
          {/* Home, Menu, Work Hours side by side */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2 min-w-0">
              <div className="text-neutral-50 text-[14px] font-semibold">Home</div>
              <ul className="text-neutral-50 text-[10px] flex flex-col gap-1 leading-snug">
                <li>About Us</li>
                <li>Health Care</li>
                <li>Our Doctor</li>
                <li>Testimonial</li>
              </ul>
            </div>
            <div className="flex flex-col gap-2 min-w-0">
              <div className="text-neutral-50 text-[14px] font-semibold">Menu</div>
              <ul className="text-neutral-50 text-[10px] flex flex-col gap-1 leading-snug">
                <li>Jadwal Dokter</li>
                <li>Fasilitas</li>
                <li>Paket Kesehatan</li>
                <li>Artikel</li>
                <li>Karir</li>
              </ul>
            </div>
            <div className="flex flex-col gap-2 min-w-0">
              <div className="text-neutral-50 text-[14px] font-semibold">Work Hours</div>
              <div className="flex items-center gap-1.5">
                <Image src={ClockIcon} alt="Clock" width={16} height={16} />
                <span className="text-neutral-50 text-[10px]">24/7</span>
              </div>
              <p className="text-neutral-50 text-[10px] leading-snug">Rumah sakit kami beroperasi 24 jam setiap hari untuk memberikan pelayanan.</p>
              <div className="flex items-center gap-1.5">
                <Image src={CallIcon} alt="Call" width={16} height={16} />
                <span className="text-neutral-50 text-[10px]">+91 91813 23 2309</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-0 outline outline-1 outline-zinc-100"></div>
  <div className="w-full text-center text-neutral-50 text-[10px] md:text-lg font-normal leading-relaxed">© 2025 Mentari Hospital. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
