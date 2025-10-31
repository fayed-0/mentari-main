import React from 'react';
import Head from 'next/head';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import AnimatedCollapse from '../../../../components/AnimatedCollapse';
import DownIcon from '../../../../components/HealthCare/source/down.svg';

export default function OutpatientPage() {
	return (
		<>
			<Head>
				<title>Rawat Jalan - Klinik Umum & Spesialis</title>
				<meta
					name="description"
					content="Layanan rawat jalan komprehensif: klinik umum & spesialis, penunjang medis, farmasi, dan tindakan komprehensif harian."
				/>
			</Head>
			<div className="min-h-screen w-full bg-stone-50 flex flex-col">
				<Navbar />
				<main className="flex-1 w-full bg-white">
					<section className="relative w-full pt-24 pb-10 sm:pt-32 sm:pb-14">
						<div className="mx-auto w-full max-w-[1272px] px-4">
							<div className="flex justify-center">
								<div className="inline-flex flex-col justify-start items-center gap-[5px] mb-4 font-be-vietnam">
									<span className="text-black text-xs sm:text-sm font-semibold tracking-wide text-center">RAWAT JALAN</span>
									<span className="h-0.5 w-24 bg-orange-500 rounded-md" />
								</div>
							</div>
							<h1 className="text-black font-semibold font-be-vietnam tracking-tight text-2xl sm:text-3xl md:text-4xl leading-snug text-center mx-auto max-w-5xl">
								Layanan Rawat Jalan – Klinik Umum & Spesialis
							</h1>
							<p className="mt-6 text-neutral-700 text-sm sm:text-base font-medium max-w-3xl text-center mx-auto">
								Pemeriksaan, konsultasi, dan tindakan medis harian dengan akses penunjang (lab, radiologi, farmasi) untuk perawatan cepat dan tepat tanpa perlu rawat inap.
							</p>
							<div className="mt-10 sm:mt-14">
								<div className="w-full h-56 sm:h-[360px] md:h-[480px] bg-neutral-200 rounded-md flex items-center justify-center text-neutral-600 text-sm sm:text-base font-medium select-none">
									Ilustrasi Rawat Jalan (Coming Soon)
								</div>
							</div>
						</div>
					</section>

					{/* Outpatient Services Accordion */}
					<OutpatientServicesAccordion />
				</main>
				<Footer />
			</div>
		</>
	);
}

// ---------------- Outpatient Services Accordion ----------------
interface ServiceItem {
	id: string;
	title: string;
	body: React.ReactNode;
}

const outpatientServices: ServiceItem[] = [
	{
		id: 'clinics',
		title: '1. Klinik Umum & Spesialis',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>
					Konsultasi dengan dokter umum dan berbagai dokter spesialis (Penyakit Dalam, Anak, Bedah, Obgyn, Saraf, Jantung, THT, Mata, Kulit & Kelamin, Gigi, dan lainnya).
				</p>
				<p className="font-semibold">Fasilitas:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Ruang konsultasi nyaman & privat</li>
					<li>Registrasi online/offline</li>
					<li>Integrasi penunjang (lab, radiologi, farmasi)</li>
				</ul>
			</div>
		)
	},
	{
		id: 'minor-procedures',
		title: '2. Tindakan Medis & Keperawatan Sederhana',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>Tindakan tanpa rawat inap seperti penjahitan luka ringan, nebulisasi, injeksi, perawatan luka, pasang lepas infus, dan lainnya.</p>
				<p className="font-semibold">Keunggulan:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Prosedur cepat, aman, dan steril</li>
					<li>Ditangani tenaga profesional</li>
					<li>Edukasi perawatan mandiri di rumah</li>
				</ul>
			</div>
		)
	},
	{
		id: 'laboratory',
		title: '3. Laboratorium',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>Pemeriksaan darah, urin, feses, fungsi hati-ginjal, panel metabolik, marker infeksi, dan pemeriksaan khusus sesuai indikasi.</p>
				<p className="font-semibold">Layanan:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Hematologi, Kimia Klinik, Imunologi</li>
					<li>PCR, Kultur, dan pemeriksaan khusus</li>
					<li>Hasil cepat dengan sistem notifikasi</li>
				</ul>
			</div>
		)
	},
	{
		id: 'radiology',
		title: '4. Radiologi Rawat Jalan',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>
					Akses pencitraan X-Ray, USG, CT Scan, dan pemeriksaan lain sesuai indikasi klinis, terintegrasi dengan poliklinik untuk tindak lanjut cepat.
				</p>
			</div>
		)
	},
	{
		id: 'pharmacy',
		title: '5. Farmasi Rawat Jalan',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>Peracikan resep dan konseling obat oleh apoteker untuk penggunaan obat yang tepat, aman, dan efektif.</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Obat generik & bermerek</li>
					<li>Konsultasi interaksi & efek samping</li>
					<li>Layanan antar (opsional)</li>
				</ul>
			</div>
		)
	},
	{
		id: 'rehab',
		title: '6. Rehabilitasi Medik / Fisioterapi',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>Terapi fisik, latihan, dan modalitas untuk pemulihan pasca-cedera, nyeri muskuloskeletal, pasca-operasi, atau kondisi neurologis.</p>
			</div>
		)
	},
	{
		id: 'flow',
		title: '7. Alur Kunjungan & Pendaftaran',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p className="font-semibold">Langkah-langkah:</p>
				<ol className="list-decimal pl-5 space-y-1">
					<li>Registrasi di loket/online</li>
					<li>Screening & vital sign</li>
					<li>Konsultasi dokter</li>
					<li>Penunjang bila diperlukan</li>
					<li>Resep & pengambilan obat</li>
				</ol>
			</div>
		)
	},
	{
		id: 'prepare',
		title: '8. Persiapan Pasien',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<ul className="list-disc pl-5 space-y-1">
					<li>Bawa kartu identitas & kartu asuransi</li>
					<li>Datang 10–15 menit sebelum jadwal</li>
					<li>Bawa hasil pemeriksaan sebelumnya (jika ada)</li>
				</ul>
			</div>
		)
	}
];

function OutpatientServicesAccordion() {
	const [openId, setOpenId] = React.useState<string | null>(null);
	const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id));

	return (
		<section className="w-full pt-2 pb-20 bg-white">
			<div className="mx-auto w-full max-w-[1272px] px-4">
				<div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-sm">
					{outpatientServices.map((item, idx) => {
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
								{idx < outpatientServices.length - 1 && <div className="h-px bg-zinc-200" />}
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

