import React from 'react';
import Head from 'next/head';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import AnimatedCollapse from '../../../../components/AnimatedCollapse';
import DownIcon from '../../../../components/HealthCare/source/down.svg';

export default function EmergencyPage() {
	return (
		<>
			<Head>
				<title>IGD 24 Jam - Gawat Darurat</title>
				<meta
					name="description"
					content="Instalasi Gawat Darurat 24 jam dengan penanganan cepat, triase, resusitasi, dan dukungan tim multidisiplin."
				/>
			</Head>
			<div className="min-h-screen w-full bg-stone-50 flex flex-col">
				<Navbar />
				<main className="flex-1 w-full bg-white">
					<section className="relative w-full pt-24 pb-10 sm:pt-32 sm:pb-14">
						<div className="mx-auto w-full max-w-[1272px] px-4">
                            <div className="flex justify-center">
                                <div className="inline-flex flex-col items-center gap-2 mb-4 w-fit">
                                    <span className="text-black text-xs sm:text-sm font-semibold tracking-wide">
                                    GAWAT DARURAT
                                    </span>
                                    <span className="h-0.5 bg-orange-500 rounded-md w-full" />
                                </div>
                            </div>
                            
							<h1 className="text-black font-semibold font-be-vietnam tracking-tight text-2xl sm:text-3xl md:text-4xl leading-snug text-center mx-auto max-w-5xl">
								IGD 24 Jam – Cepat, Tepat, Terkoordinasi
							</h1>
							<p className="mt-6 text-neutral-700 text-sm sm:text-base font-medium max-w-3xl text-center mx-auto">
								Layanan darurat dengan sistem triase, resusitasi, stabilisasi, dan rujukan bila diperlukan, didukung dokter umum, spesialis on-call, serta penunjang 24 jam.
							</p>
							<div className="mt-10 sm:mt-14">
								<div className="w-full h-56 sm:h-[360px] md:h-[480px] bg-neutral-200 rounded-md flex items-center justify-center text-neutral-600 text-sm sm:text-base font-medium select-none">
									Ilustrasi IGD (Coming Soon)
								</div>
							</div>
						</div>
					</section>

					{/* Emergency Services Accordion */}
					<EmergencyServicesAccordion />
				</main>
				<Footer />
			</div>
		</>
	);
}

// ---------------- Emergency Services Accordion ----------------
interface ServiceItem {
	id: string;
	title: string;
	body: React.ReactNode;
}

const emergencyServices: ServiceItem[] = [
	{
		id: 'triage',
		title: '1. Triase & Penilaian Cepat',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>Penentuan prioritas berdasarkan tingkat kegawatan untuk memastikan penanganan paling mendesak dilakukan terlebih dahulu.</p>
			</div>
		)
	},
	{
		id: 'resus',
		title: '2. Resusitasi & Stabilisasi',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>Penanganan henti napas, syok, trauma berat, dan kondisi kritis lainnya sesuai protokol ACLS/ATLS.</p>
			</div>
		)
	},
	{
		id: 'trauma',
		title: '3. Penanganan Trauma',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>Evaluasi luka, ortopedi darurat, imobilisasi, dan tindakan pembedahan minor.</p>
			</div>
		)
	},
	{
		id: 'pediatric',
		title: '4. Emergency Anak & Obstetri',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>Penanganan darurat pada bayi/anak serta kondisi kebidanan darurat dengan kolaborasi spesialis terkait.</p>
			</div>
		)
	},
	{
		id: 'supporting',
		title: '5. Penunjang 24 Jam',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>Laboratorium, radiologi (X-Ray, CT, USG), farmasi, dan bank darah (kerja sama PMI) untuk dukungan cepat.</p>
			</div>
		)
	},
	{
		id: 'referral',
		title: '6. Rujukan & Koordinasi Lintas Unit',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>Koordinasi dengan ruang rawat inap, ICU, kamar operasi, atau rujukan eksternal bila dibutuhkan.</p>
			</div>
		)
	},
	{
		id: 'prep',
		title: '7. Persiapan & Informasi Pasien',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<ul className="list-disc pl-5 space-y-1">
					<li>Jika memungkinkan, bawa identitas dan kartu asuransi</li>
					<li>Datang bersama pendamping</li>
					<li>Infokan alergi, obat rutin, dan riwayat penyakit</li>
				</ul>
			</div>
		)
	}
];

function EmergencyServicesAccordion() {
	const [openId, setOpenId] = React.useState<string | null>(null);
	const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id));

	return (
		<section className="w-full pt-2 pb-20 bg-white">
			<div className="mx-auto w-full max-w-[1272px] px-4">
				<div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-sm">
					{emergencyServices.map((item, idx) => {
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
								{idx < emergencyServices.length - 1 && <div className="h-px bg-zinc-200" />}
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

