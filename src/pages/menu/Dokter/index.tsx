import React from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Image from "next/image";
import Link from "next/link";
import DownIcon from "../../../components/HealthCare/source/down.svg";
import AnimatedCollapse from "../../../components/AnimatedCollapse"; // Import komponen yang sudah diperbaiki

import { doctors, getDoctorSpecialization, searchDoctors } from "../../../data/doctors";

// Category mapping can reuse subset from healthcare page for consistency
const categories: { id: string; title: string; specializationIds: number[] }[] = [
	{ id: "anak", title: "Anak", specializationIds: [1, 23] },
	{ id: "anestesi", title: "Anestesi", specializationIds: [24] },
	{ id: "bedah-ortopedi", title: "Bedah Ortopedi", specializationIds: [2, 21] },
	{ id: "bedah-urologi", title: "Bedah Urologi", specializationIds: [12] },
	{ id: "jantung", title: "Jantung & Pembuluh Darah", specializationIds: [3, 38] },
	{ id: "kebidanan", title: "Kebidanan & Kandungan", specializationIds: [6, 33] },
	{ id: "paru", title: "Paru & Pernapasan", specializationIds: [8] },
	{ id: "penyakit-dalam", title: "Penyakit Dalam", specializationIds: [9, 10, 11, 15, 36] },
	{ id: "saraf", title: "Saraf", specializationIds: [7, 20] },
	{ id: "tht", title: "THT", specializationIds: [25] },
];

export default function DoctorsPage() {
	return (
		<div className="bg-stone-50 min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1 pt-24 pb-24 px-4 sm:px-6 md:px-16">
				<div className="max-w-[1272px] mx-auto">
					<SectionHeader />
					<DoctorsSearch />
				</div>
			</main>
			<Footer />
		</div>
	);
}

function SectionHeader() {
	return (
		<>
				<div className="inline-flex flex-col items-start gap-[5px] mb-6">
					<div className="text-black font-semibold tracking-wide text-xs sm:text-sm">DOKTER</div>
				<div className="w-24 h-0.5 bg-orange-500" />
			</div>
				<h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-black leading-snug max-w-5xl mb-10">
				Temukan Dokter Spesialis Sesuai Kebutuhan Anda
			</h1>
		</>
	);
}

function DoctorsSearch() {
	const [query, setQuery] = React.useState("");
	const [openCategory, setOpenCategory] = React.useState<string | null>(null);

	const onToggleCategory = (id: string) => {
		setOpenCategory((prev) => (prev === id ? null : id));
	};

	const filtered = React.useMemo(() => searchDoctors(query), [query]);

	// When searching show flat results grid, else show accordion categories
	const showSearchResults = query.trim().length > 0;

	return (
		<div>
			<div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
				<div className="flex items-center w-full gap-4">
					<input
						type="text"
						placeholder="Cari dokter..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="w-full sm:max-w-sm px-4 py-2 rounded-md border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
					/>
					<div className="text-sm text-neutral-500 whitespace-nowrap">{filtered.length} ditemukan</div>
				</div>
			</div>

			{showSearchResults ? (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{filtered.map((d) => (
						<DoctorCard key={d.id} doctorId={d.id} />
					))}
				</div>
			) : (
				<div className="mb-10 rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-sm">
					{categories.map((cat, idx) => {
						const isOpen = openCategory === cat.id;
						const catDoctors = doctors.filter((doc) => cat.specializationIds.includes(doc.specializationId));
						return (
							<div key={cat.id}>
								<button
									onClick={() => onToggleCategory(cat.id)}
									className={`w-full flex items-center justify-between py-4 text-left transition-colors duration-600 ${
										isOpen ? "text-orange-500" : "text-neutral-800"
									}`}
								>
									<span className="font-semibold text-sm sm:text-base">{cat.title}</span>
									<span
										className={`inline-flex items-center justify-center transition-transform duration-500 ${
											isOpen ? "rotate-180" : "rotate-0"
										}`}
									>
										<Image src={DownIcon} alt="toggle" width={24} height={24} />
									</span>
								</button>
								<AnimatedCollapse isOpen={isOpen}>
									<div className="pl-1 sm:pl-2 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
										{catDoctors.length === 0 && (
											<div className="col-span-full text-sm text-neutral-500">Belum ada dokter terdaftar.</div>
										)}
											{catDoctors.map((d, i) => (
													<div
														key={d.id}
														style={{
															// Stagger: each item 60ms later
															transitionDelay: `${i * 60}ms`,
														}}
														className={`stagger-item opacity-0 translate-y-3 will-change-transform`}
													>
														<DoctorCard doctorId={d.id} />
													</div>
												))}
									</div>
								</AnimatedCollapse>
								{idx < categories.length - 1 && <div className="h-px bg-zinc-200" />}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

type DoctorCardProps = { doctorId: number };
function DoctorCard({ doctorId }: DoctorCardProps) {
	const doctor = doctors.find((d) => d.id === doctorId);
	if (!doctor) return null;
	const spec = getDoctorSpecialization(doctor);

	return (
		<div className="relative bg-white rounded-[5px] outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-hidden w-full h-48 flex">
			{/* Photo */}
			<div className="p-6 pr-0 flex flex-col justify-start">
				<div className="relative">
					<img
						src={doctor.photo || "https://placehold.co/128x133"}
						alt={doctor.name}
						className="w-32 h-[133px] object-cover rounded-[5px] border border-zinc-300"
					/>
					{spec && (
						<span className="sm:hidden absolute left-1 bottom-1 w-3 h-3 bg-orange-500 rounded-sm border border-white/80" />
					)}
				</div>
			</div>
			{/* Content */}
			<div className="flex-1 p-6 pl-4 flex flex-col">
				<div className="flex items-start gap-2">
					<h3 className="text-black text-base sm:text-xl font-semibold leading-snug flex-1">{doctor.name}</h3>
					{spec && (
						<span className="hidden sm:inline-flex items-center gap-1 text-orange-500 text-[10px] font-bold">
							<span className="w-3 h-3 bg-orange-500 rounded-sm" />
							{spec.title}
						</span>
					)}
				</div>
				<p className="mt-2 text-neutral-600 text-sm sm:text-base font-medium line-clamp-2">{doctor.summary}</p>
				<div className="mt-auto flex items-center gap-3 sm:gap-4 pt-4">
					<Link
						href={`#/dokter/${doctor.id}`}
						className="inline-flex items-center gap-1 sm:gap-2 text-orange-500 text-xs sm:text-sm font-semibold"
					>
						<span className="hidden sm:inline-block w-3 h-3 bg-orange-500 rounded-sm" />
						<span className="sm:hidden">Profile</span>
						<span className="hidden sm:inline">Lihat Profile</span>
					</Link>
					<button className="relative inline-flex items-center gap-1 sm:gap-2 bg-white border border-zinc-300 rounded-md px-4 py-1.5 sm:px-5 sm:py-2 text-neutral-600 text-xs sm:text-sm font-semibold hover:border-orange-500 hover:text-orange-500 transition">
						<span className="hidden sm:inline-block w-3 h-3 bg-orange-500 rounded-sm" /> Appointment
					</button>
				</div>
			</div>
		</div>
	);
}