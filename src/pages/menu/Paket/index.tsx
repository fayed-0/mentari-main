import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

import imgAsuransi from "./source/asuransi.png";
import imgDonorDarah from "./source/donor darah.png";

const paketList = [
	{ label: "Asuransi", img: imgAsuransi },
	{ label: "Donor Darah", img: imgDonorDarah },
];

export default function Paket() {
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [currentIndex, setCurrentIndex] = useState<number>(0);

	const total = paketList.length;

	const openLightbox = (idx: number) => {
		setCurrentIndex(idx);
		setLightboxOpen(true);
		if (typeof document !== "undefined") {
			document.body.style.overflow = "hidden";
		}
	};

	const closeLightbox = () => {
		setLightboxOpen(false);
		if (typeof document !== "undefined") {
			document.body.style.overflow = "";
		}
	};

	const prev = useCallback(() => setCurrentIndex((i) => (i - 1 + total) % total), [total]);
	const next = useCallback(() => setCurrentIndex((i) => (i + 1) % total), [total]);

	useEffect(() => {
		if (!lightboxOpen) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") closeLightbox();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [lightboxOpen]);

	const touchStartX = useRef<number | null>(null);
	const touchEndX = useRef<number | null>(null);
	const onTouchStart = (e: React.TouchEvent) => {
		touchEndX.current = null;
		touchStartX.current = e.changedTouches[0].clientX;
	};
	const onTouchMove = (e: React.TouchEvent) => {
		touchEndX.current = e.changedTouches[0].clientX;
	};
	const onTouchEnd = () => {
		if (touchStartX.current === null || touchEndX.current === null) return;
		const dx = touchStartX.current - touchEndX.current;
		const threshold = 40;
		if (dx > threshold) next();
		else if (dx < -threshold) prev();
		touchStartX.current = null;
		touchEndX.current = null;
	};

	return (
		<div className="bg-white min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1 flex flex-col items-center px-4 pt-10 md:pt-20 pb-16">
				<div className="w-full max-w-[1271px] mx-auto flex flex-col items-center pt-12 px-2 md:px-0">
						<div className="inline-flex flex-col justify-start items-center gap-[5px] mb-4 font-be-vietnam">
							<div className="text-black text-xs sm:text-sm font-semibold text-center">PAKET KESEHATAN</div>
							<div className="h-0.5 w-full bg-orange-500 rounded-md"></div>
						</div>
					<div className="w-full text-center text-black text-2xl md:text-4xl font-semibold font-be-vietnam mb-8 md:mb-10 px-2">
						Pilihan paket layanan yang kami sediakan
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 w-full mt-4">
						{paketList.map((item, idx) => (
							<div
								key={idx}
								className="group relative w-full aspect-square bg-neutral-600 rounded-md overflow-hidden border border-zinc-300 bg-white transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
								onClick={() => openLightbox(idx)}
							>
								<Image src={item.img} alt={item.label} fill className="object-cover" placeholder="empty" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px" />
								<div className="absolute left-3 top-3 md:left-4 md:top-4">
									<div className="relative inline-block">
										<div className="relative px-2 py-1 md:px-4 md:py-2 bg-white/75 inline-flex justify-start items-center whitespace-nowrap text-black text-xs sm:text-sm md:text-xl font-medium font-be-vietnam rounded-tl-[5px] md:rounded-tl-[5px] rounded-br-[5px] md:rounded-br-[5px] rounded-tr-[5px] rounded-bl-[5px] shadow">
											{item.label}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>

					{lightboxOpen && (
						<div
							className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
							role="dialog"
							aria-modal="true"
						>
							<button
								aria-label="Tutup"
								onClick={closeLightbox}
								className="absolute top-4 right-4 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
							>
								✕
							</button>

							{/* Modal content: image left, detail panel right (responsive) */}
							<div className="relative mx-4 w-[calc(100%-32px)] h-[78vh] md:mx-0 md:w-[70vw] md:h-[70vh] flex flex-col md:flex-row gap-6 items-stretch">
								{/* Left: image */}
								<div className="md:w-1/2 w-full aspect-square md:aspect-auto md:h-auto bg-black/800 rounded-lg overflow-hidden flex items-center justify-center relative" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
									<Image src={paketList[currentIndex].img} alt={paketList[currentIndex].label} fill className="object-cover p-0" priority />
								</div>
								{/* Right: detail panel */}
								<div className="md:w-1/2 w-full bg-zinc-600 text-white rounded-lg p-6 flex flex-col">
									<h2 className="text-white text-xl md:text-3xl font-semibold mb-3">Judul Paket (Lorem Ipsum)</h2>
									<div className="flex-1 overflow-auto pr-2 text-xs md:text-base leading-relaxed max-h-[26vh] md:max-h-none">
										<p>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
										</p>
										<p className="mt-3">
											Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
										</p>
										<p className="mt-3">
											Suspendisse potenti. Integer non feugiat lorem. Phasellus ut neque ut tortor varius luctus.
										</p>
									</div>
									{/* Full width action button */}
									<div className="mt-4">
										<button className="w-full bg-white text-zinc-900 hover:bg-white/90 py-2 rounded-md text-base md:py-3 md:text-lg font-semibold">Appointment</button>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</main>
			<Footer />
		</div>
	);
}

