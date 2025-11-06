import React from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Image from "next/image";
import { useRouter } from "next/router";
import ImgRawatJalan from "./source/rawat-jalan.png";
import ImgRawatInap from "./source/rawat-inap.png";
import ImgGawatDarurat from "./source/gawat-darurat.png";
import ImgRadiologi from "./source/radiologi.png";
import ImgIVFMorulla from "./source/IVF-morulla.png";
import ImgTraumaCenter from "./source/trauma-center.png";

type Service = {
	title: string;
	highlight?: boolean; 
	imageSrc?: any; 
};

const SERVICES: Service[] = [
	{ title: "Rawat Jalan", imageSrc: ImgRawatJalan },
	{ title: "Rawat Inap", imageSrc: ImgRawatInap },
	{ title: "Gawat Darurat", imageSrc: ImgGawatDarurat },
	{ title: "Radiologi", imageSrc: ImgRadiologi },
	{ title: "IVF Morulla", imageSrc: ImgIVFMorulla },
	{ title: "Trauma Center", imageSrc: ImgTraumaCenter, highlight: true },
];

export default function LayananPage() {
	const router = useRouter();
	const toSlug = (title: string) => {
		// Special case: route IVF Morulla to canonical /ivf path
		if (title.toLowerCase().startsWith('ivf')) return 'ivf';
		return title
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.trim()
			.replace(/\s+/g, "-");
	};

	return (
		<div className="min-h-screen w-full bg-stone-50">
			<Navbar />

			{/* Header */}
			<section className="max-w-[1512px] mx-auto px-4 sm:px-6 md:px-10 pt-10 md:pt-20 pb-10">
				<div className="max-w-[1272px] mx-auto items-center pt-12 px-2">
					<div className="flex flex-col items-center gap-[5px] w-fit mx-auto">
						<span className="text-black text-xs sm:text-sm font-semibold text-center">
							LAYANAN
						</span>
						<div className="h-0.5 bg-orange-500 rounded-md w-full"></div>
					</div>

					<div className="mt-4 relative flex items-center justify-center w-full">
						<h1 className="text-center text-black text-2xl md:text-4xl font-semibold max-w-[1127px]">
							Menyediakan layanan kesehatan terpercaya dengan tenaga medis berpengalaman
						</h1>
					</div>

					{/* Cards grid: match Paket/Fasilitas — 2 cols mobile, 3 cols at md, same gaps */}
					<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 w-full mt-14">
						{SERVICES.map((svc, idx) => (
							<button
								key={idx}
								type="button"
								onClick={() => router.push(`/menu/layanan/${toSlug(svc.title)}`)}
								className={[
									"group relative w-full aspect-square rounded-[5px] overflow-hidden outline outline-1 outline-zinc-300",
									"transition-all duration-300 hover:scale-105 hover:shadow-xl",
									"focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:outline-offset-2",
								].join(" ")}
							>
								{/* Background image (no hover scale on image; card scales instead) */}
								{svc.imageSrc && (
									<Image src={svc.imageSrc} alt={svc.title} fill className="object-cover" />
								)}
								{/* Dark overlay for legibility */}
								<div className="absolute inset-0 bg-black/30" />

								{/* Top-left boxed label (like Fasilitas) */}
								<div className="absolute left-3 top-3 md:left-4 md:top-4">
									<div className="relative inline-block">
										<div className="relative px-2 py-1 md:px-4 md:py-2 bg-white/75 inline-flex justify-start items-center whitespace-nowrap text-black text-xs sm:text-sm md:text-xl font-medium font-be-vietnam rounded-tl-[5px] md:rounded-tl-[5px] rounded-br-[5px] md:rounded-br-[5px] rounded-tr-[5px] rounded-bl-[5px] shadow">
											{svc.title}
										</div>
									</div>
								</div>
							</button>
						))}
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}

