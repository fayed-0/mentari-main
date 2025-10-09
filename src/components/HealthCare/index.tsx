import React from "react";
import Image from "next/image";
import Link from "next/link";

// Import icons
import BabyIcon from "./source/baby.svg";
import BoneIcon from "./source/bone.svg";
import CardiologyIcon from "./source/cardiology.svg";
import DentistryIcon from "./source/dentistry.svg";
import DermatologyIcon from "./source/dermatology.svg";
import GynecologyIcon from "./source/gynecology.svg";
import ArrowIcon from "./source/arrow.svg";

const services = [
	{
		id: 1,
		title: "Pediatri",
		desc: "Perawatan menyeluruh untuk anak, dari bayi hingga remaja.",
		icon: BabyIcon,
	},
	{
		id: 2,
		title: "Ortopedi",
		desc: "Perawatan untuk gangguan tulang, sendi, dan otot.",
		icon: BoneIcon,
	},
	{
		id: 3,
		title: "Kardiologi",
		desc: "Perawatan jantung dan pembuluh darah yang ahli untuk semua usia.",
		icon: CardiologyIcon,
	},
	{
		id: 4,
		title: "Kedokteran Gigi",
		desc: "Perawatan gigi dan layanan kesehatan mulut yang lengkap.",
		icon: DentistryIcon,
	},
	{
		id: 5,
		title: "Dermatologi",
		desc: "Perawatan kesehatan kulit dan dermatologi kosmetik.",
		icon: DermatologyIcon,
	},
	{
		id: 6,
		title: "Kebidanan",
		desc: "Perawatan kesehatan wanita dan reproduksi yang komprehensif.",
		icon: GynecologyIcon,
	},
];

type ViewMoreProps = {
	size?: "sm" | "md" | "lg";
	className?: string;
	boxed?: boolean;
};

const ViewMore = ({ size = "md", className = "", boxed = false }: ViewMoreProps) => {
	const sizeCls = size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base";
	const base = "inline-flex items-center gap-2 font-semibold cursor-pointer";
	const color = "text-orange-500";
	const boxedCls = "bg-white border border-zinc-300 rounded-md px-3 py-1.5 shadow-sm hover:shadow md:px-4 md:py-2";
	return (
		<div className={`${base} ${color} ${boxed ? boxedCls : "hover:underline"} ${sizeCls} ${className}`}>
			<span>View More</span>
			<Image src={ArrowIcon} alt="Arrow" width={size === "sm" ? 12 : 14} height={size === "sm" ? 12 : 14} />
		</div>
	);
};

const HealthCare = () => {
	return (
		<section className="w-full bg-stone-50 py-8 sm:py-20 px-4 sm:px-6 md:px-16">
			{/* Title + View More (Mobile) */}
			<div className="max-w-[1272px] mx-auto mb-8 sm:mb-12">
				<div className="flex flex-row items-center justify-between mb-4 sm:mb-6">
					<div className="inline-flex flex-col items-start gap-[5px]">
						<div className="text-black font-semibold tracking-wide text-xs sm:text-sm">
							HEALTH CARE
						</div>
						<div className="w-20 h-0.5 bg-orange-500"></div>
					</div>
					<div className="block sm:hidden ml-2">
						<Link href="/healthcare" aria-label="Lihat semua layanan kesehatan">
							<ViewMore size="md" boxed />
						</Link>
					</div>
				</div>

				{/* Heading + View More (Desktop) */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
					<h2 className="text-2xl sm:text-2xl md:text-4xl font-semibold text-black leading-snug max-w-6xl">
						Layanan Kesehatan untuk Anda dan Keluarga
					</h2>
					<div className="hidden sm:inline-flex ml-6 mt-1 shrink-0">
						<Link href="/healthcare" aria-label="Lihat semua layanan kesehatan">
							<ViewMore size="md" boxed />
						</Link>
					</div>
				</div>
			</div>

			{/* Grid Cards */}
			<div className="max-w-[1272px] mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
				{services.map((service) => (
					<div
						key={service.id}
						className="group bg-white rounded-md border border-zinc-300 p-4 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:bg-orange-500 hover:scale-105 hover:shadow-xl"
					>
						{/* Icon */}
						<div className="w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center rounded-md border border-zinc-300 bg-white mb-4 sm:mb-6">
							<Image
								src={service.icon}
								alt={service.title}
								width={24}
								height={24}
								className="text-orange-500 group-hover:text-white"
							/>
						</div>

						{/* Title */}
						<h3 className="text-sm sm:text-xl font-semibold text-black group-hover:text-white mb-2 sm:mb-3">
							{service.title}
						</h3>

						{/* Description */}
						<p className="text-xs sm:text-base font-medium text-neutral-600 group-hover:text-white flex-grow">
							{service.desc}
						</p>

						{/* View More */}
						<div className="mt-4 sm:mt-6">
							<Link href="/healthcare" aria-label={`Detail ${service.title}`}>
								<ViewMore size="sm" boxed />
							</Link>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default HealthCare;