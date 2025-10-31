import React from 'react';
import Head from 'next/head';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import AnimatedCollapse from '../../../../components/AnimatedCollapse';
import DownIcon from '../../../../components/HealthCare/source/down.svg';

export default function InpatientPage() {
	return (
		<>
			<Head>
				<title>Rawat Inap - Perawatan 24 Jam</title>
				<meta
					name="description"
					content="Layanan rawat inap 24 jam dengan kamar perawatan nyaman, pemantauan intensif, dan tim medis profesional."
				/>
			</Head>
			<div className="min-h-screen w-full bg-stone-50 flex flex-col">
				<Navbar />
				<main className="flex-1 w-full bg-white">
					<section className="relative w-full pt-24 pb-10 sm:pt-32 sm:pb-14">
						<div className="mx-auto w-full max-w-[1272px] px-4">
							<div className="flex justify-center">
								<div className="inline-flex flex-col justify-start items-center gap-[5px] mb-4 font-be-vietnam">
									<span className="text-black text-xs sm:text-sm font-semibold tracking-wide text-center">RAWAT INAP</span>
									<span className="h-0.5 w-24 bg-orange-500 rounded-md" />
								</div>
							</div>
							<h1 className="text-black font-bold font-sans tracking-tight text-2xl sm:text-3xl md:text-4xl leading-snug text-center mx-auto max-w-5xl">
								Layanan Rawat Inap – Perawatan Nyaman 24 Jam
							</h1>
							<p className="mt-6 text-neutral-700 text-sm sm:text-base font-medium max-w-3xl text-center mx-auto">
								Kamar perawatan nyaman, fasilitas lengkap, dan pemantauan dokter-perawat sepanjang waktu untuk pemulihan yang optimal.
							</p>
							<div className="mt-10 sm:mt-14">
								<div className="w-full h-56 sm:h-[360px] md:h-[480px] bg-neutral-200 rounded-md flex items-center justify-center text-neutral-600 text-sm sm:text-base font-medium select-none">
									Ilustrasi Rawat Inap (Coming Soon)
								</div>
							</div>
						</div>
					</section>

					{/* Inpatient Services Accordion */}
					<InpatientServicesAccordion />
				</main>
				<Footer />
			</div>
		</>
	);
}

// ---------------- Inpatient Services Accordion ----------------
interface ServiceItem {
	id: string;
	title: string;
	body: React.ReactNode;
}

const inpatientServices: ServiceItem[] = [
	{
		id: 'rooms',
		title: '1. Kamar Perawatan',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>Pilihan kelas kamar menyesuaikan kebutuhan dan kenyamanan pasien.</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>VIP / VVIP</li>
					<li>Kelas 1</li>
					<li>Kelas 2</li>
					<li>Kelas 3</li>
				</ul>
				<p className="font-semibold">Fasilitas Kamar (variasi sesuai kelas):</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>AC, TV, kamar mandi dalam</li>
					<li>Tempat tidur pasien elektrik & pendamping</li>
					<li>Meals plan harian & room service</li>
				</ul>
			</div>
		)
	},
	{
		id: 'nursing',
		title: '2. Keperawatan 24 Jam',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>Perawat profesional siap 24 jam melakukan pemantauan, pemberian obat, dan perawatan sesuai instruksi dokter.</p>
			</div>
		)
	},
	{
		id: 'doctor-rounds',
		title: '3. Visit Dokter & Konsultasi',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>Visit dokter harian dan konsultasi antar disiplin untuk evaluasi kondisi dan evaluasi terapi.</p>
			</div>
		)
	},
	{
		id: 'icu',
		title: '4. Perawatan Intensif (ICU/ICCU/NICU)',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>Unit perawatan intensif dengan pemantauan ketat dan peralatan lengkap untuk kasus kritis.</p>
			</div>
		)
	},
	{
		id: 'supporting',
		title: '5. Penunjang Medis Terintegrasi',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>Laboratorium, radiologi, farmasi 24 jam, serta layanan rehabilitasi medik.</p>
			</div>
		)
	},
	{
		id: 'education',
		title: '6. Edukasi & Discharge Planning',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>Edukasi perawatan di rumah, kontrol lanjutan, serta perencanaan pulang untuk mencegah readmisi.</p>
			</div>
		)
	}
];

function InpatientServicesAccordion() {
	const [openId, setOpenId] = React.useState<string | null>(null);
	const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id));

	return (
		<section className="w-full pt-2 pb-20 bg-white">
			<div className="mx-auto w-full max-w-[1272px] px-4">
				<div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-sm">
					{inpatientServices.map((item, idx) => {
						const isOpen = openId === item.id;
						return (
							<div key={item.id}>
								<button
									onClick={() => toggle(item.id)}
									className={`w-full flex items-center justify-between py-4 text-left transition-colors ${isOpen ? 'text-orange-500' : 'text-neutral-800'}`}
								>
									<span className="font-semibold text-sm sm:text-base pr-4">{item.title}</span>
									<span className={`inline-flex items-center justify-center transition-transform duration-500 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
										<img src={DownIcon.src} alt="toggle" className="w-6 h-6" />
									</span>
								</button>
								<AnimatedCollapse isOpen={isOpen}>
									<div className="pb-6 pt-1 px-1 sm:px-2">{item.body}</div>
								</AnimatedCollapse>
								{idx < inpatientServices.length - 1 && <div className="h-px bg-zinc-200" />}
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

