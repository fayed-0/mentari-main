import React from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Image from "next/image";
import { useRouter } from "next/router";
// Background images for each service
import ImgRawatJalan from "./source/rawat-jalan.png";
import ImgRawatInap from "./source/rawat-inap.png";
import ImgGawatDarurat from "./source/gawat-darurat.png";
import ImgRadiologi from "./source/radiologi.png";
import ImgIVFMorulla from "./source/IVF-morulla.png";
import ImgTraumaCenter from "./source/trauma-center.png";

type Service = {
	title: string;
	highlight?: boolean; // trauma center variant (gray background, white text)
	imageSrc?: any; // next/image static import
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
	const toSlug = (title: string) =>
		title
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.trim()
			.replace(/\s+/g, "-");

	return (
		<div className="min-h-screen w-full bg-stone-50">
			<Navbar />

			{/* Header */}
			<section className="max-w-[1512px] mx-auto px-4 sm:px-6 md:px-10 pt-24 pb-10">
				<div className="max-w-[1272px] mx-auto">
					<div className="flex flex-col items-center gap-[5px] w-full">
						<div className="text-black text-xs sm:text-sm font-semibold text-center">Layanan</div>
						<div className="w-24 h-0 outline outline-2 outline-offset-[-1px] outline-orange-500" />
					</div>
					<div className="mt-3 relative flex items-center justify-center w-full">
						<h1 className="text-center text-black text-2xl md:text-4xl font-semibold max-w-[1127px]">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit
						</h1>
					</div>

					{/* Cards grid: 2 cols on mobile like Fasilitas, 3 cols on desktop */}
					<div className="mt-10 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
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
								{/* Background image */}
								{svc.imageSrc && (
									<Image src={svc.imageSrc} alt={svc.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
								)}
								{/* Dark overlay for legibility */}
								<div className="absolute inset-0 bg-black/30" />

								{/* Centered label */}
								<div className="absolute inset-0 flex items-center justify-center px-6">
									<div
										className={[
											"text-center text-white",
											svc.highlight ? "font-semibold" : "font-medium",
											"text-xl",
										].join(" ")}
									>
										{svc.title}
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

