import React from 'react';
import Head from 'next/head';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import AnimatedCollapse from '../../../../components/AnimatedCollapse';
import DownIcon from '../../../../components/HealthCare/source/down.svg';

export default function TraumaCenterPage() {
	return (
		<>
			<Head>
				<title>Trauma Center & Rehabilitasi | RS Mentari</title>
				<meta
					name="description"
					content="Layanan kegawatdaruratan 24 jam, perawatan intensif, trauma center, serta rehabilitasi medik komprehensif di RS Mentari."
				/>
			</Head>
			<div className="min-h-screen w-full bg-stone-50 flex flex-col">
				<Navbar />
				<main className="flex-1 w-full bg-white">
					<section className="relative w-full pt-24 pb-12 sm:pt-32 sm:pb-16">
						<div className="mx-auto w-full max-w-[1272px] px-4">
							<div className="flex flex-col items-center gap-2 mb-4">
								<span className="text-black text-xs sm:text-sm font-semibold tracking-wide">TRAUMA CENTER</span>
								<span className="w-24 h-0 outline outline-2 outline-offset-[-1px] outline-orange-500" />
							</div>
							<h1 className="text-black font-bold tracking-tight text-2xl sm:text-3xl md:text-5xl leading-snug text-center mx-auto max-w-5xl">
								Trauma Center & Rehabilitasi Komprehensif
							</h1>
							<p className="mt-6 text-neutral-700 text-sm sm:text-base font-medium max-w-3xl text-center mx-auto">
								Menangani kegawatdaruratan, cedera kompleks, perawatan intensif, dan pemulihan fungsi melalui pendekatan multidisiplin terintegrasi.
							</p>
							<div className="mt-10 sm:mt-14">
								<div className="w-full h-56 sm:h-[360px] md:h-[480px] bg-neutral-400 rounded-md flex items-center justify-center text-white text-sm sm:text-base font-medium select-none">
									Media / Ilustrasi (Coming Soon)
								</div>
							</div>
						</div>
					</section>
					<TraumaAccordion />
				</main>
				<Footer />
			</div>
		</>
	);
}

// ---------------- DATA ----------------
interface SectionItem { id: string; title: string; body: React.ReactNode }

const sections: SectionItem[] = [
	{
		id: 'igd',
		title: '1. Instalasi Gawat Darurat (IGD)',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base leading-relaxed font-medium">
				<p><span className="font-semibold">Layanan Gawat Darurat (IGD) 24 Jam</span> dengan tim dokter & perawat terlatih menangani berbagai kondisi kritis.</p>
				<p className="font-semibold">Peralatan utama:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>KED (Kendrick Extrication Device)</li>
					<li>LSB (Long Spinal Board)</li>
					<li>Kit Emergency lengkap</li>
					<li>Stretcher & Scoop Stretcher</li>
				</ul>
				<p><span className="font-semibold">Triage cepat & tepat</span> menilai prioritas klinis terutama kasus trauma dengan sistem prioritas kegawatdaruratan.</p>
			</div>
		)
	},
	{
		id: 'icu',
		title: '2. Unit Perawatan Intensif (ICU / PICU)',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base leading-relaxed font-medium">
				<p>Memberikan perawatan intensif bagi pasien dewasa (ICU) & anak (PICU) dengan kecederaan atau kondisi kritis.</p>
				<p className="font-semibold">Fasilitas & alat:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Ventilator</li>
					<li>HFNC</li>
					<li>Monitoring saturasi oksigen & CO₂</li>
					<li>Monitoring Arterial line & CVP</li>
				</ul>
				<p>Kamar terpisah menjaga privasi, keamanan, dan kenyamanan pasien.</p>
				<p>Dukungan fasilitas penunjang: Rehabilitasi, Ruang Operasi, Pencitraan, Laboratorium & Bank Darah.</p>
			</div>
		)
	},
	{
		id: 'tim-trauma',
		title: '3. Tim Medik Trauma Center',
		body: (
			<div className="space-y-3 text-neutral-700 text-sm sm:text-base leading-relaxed font-medium">
				<p>Tim multidisiplin siap 24 jam:</p>
				<ul className="list-disc pl-5 space-y-1 columns-1 sm:columns-2 md:columns-3">
					<li>Sp. Bedah Umum</li>
					<li>Sp. Bedah Tulang</li>
					<li>Sp. Radiologi</li>
					<li>Sp. Anestesi</li>
					<li>Sp. Rehabilitasi Medik</li>
					<li>Sp. THT</li>
					<li>Sp. Kedokteran Olahraga</li>
					<li>Dokter UGD & ICU</li>
					<li>Perawat Gawat Darurat</li>
					<li>Sp. Patologi Klinik</li>
				</ul>
			</div>
		)
	},
	{
		id: 'rehab-def',
		title: '4. Rehabilitasi Medik – Definisi & Cakupan',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base leading-relaxed font-medium">
				<p>Menyediakan layanan kesehatan terpadu (medis spesialistik, psikososial, edukasional, vokasional) untuk memaksimalkan fungsi.</p>
				<p>Cakupan: bayi hingga lanjut usia dengan gangguan fungsi atau disabilitas (kognisi, komunikasi, menelan, mobilisasi, kebugaran jantung paru, fungsi seksual, berkemih).</p>
			</div>
		)
	},
	{
		id: 'rehab-goals',
		title: '5. Tujuan Rehabilitasi',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base leading-relaxed font-medium">
				<ul className="list-disc pl-5 space-y-1">
					<li>Mengatasi kondisi sakit melalui intervensi medis & terapi fisik.</li>
					<li>Mencegah komplikasi tirah baring / progres penyakit.</li>
					<li>Memaksimalkan fungsi, aktivitas, partisipasi.</li>
					<li>Meningkatkan kualitas hidup.</li>
				</ul>
			</div>
		)
	},
	{
		id: 'rehab-team',
		title: '6. Tim Rehabilitasi',
		body: (
			<div className="space-y-3 text-neutral-700 text-sm sm:text-base leading-relaxed font-medium">
				<ul className="list-disc pl-5 space-y-1">
					<li>Dokter Spesialis Kedokteran Fisik & Rehabilitasi (Sp.KFR)</li>
					<li>Fisioterapis</li>
					<li>Kolaborasi lintas profesi sesuai kebutuhan klinis</li>
				</ul>
			</div>
		)
	},
	{
		id: 'rehab-programs',
		title: '7. Program Rehabilitasi Medik',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base leading-relaxed font-medium">
				<ul className="list-disc pl-5 space-y-1">
					<li><span className="font-semibold">Muskuloskeletal:</span> nyeri otot, cedera, mechanical back pain, inflamasi, pasca operasi/trauma, imobilisasi lama.</li>
					<li><span className="font-semibold">Neuromuskular:</span> Stroke, HNP, Parkinson, cedera tulang belakang, infeksi otak.</li>
					<li><span className="font-semibold">Kardiorespirasi:</span> CAD, retensi sputum, gagal jantung, gangguan endurance.</li>
					<li><span className="font-semibold">Pediatri:</span> Tumbuh kembang, cerebral palsy.</li>
					<li><span className="font-semibold">Geriatri:</span> Penyakit degeneratif, risiko jatuh, gangguan keseimbangan.</li>
				</ul>
			</div>
		)
	},
	{
		id: 'spkfr-services',
		title: '8. Layanan Dokter Sp.KFR',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base leading-relaxed font-medium">
				<ul className="list-disc pl-5 space-y-1">
					<li>Radial Shockwave Therapy – mengurangi nyeri & inflamasi, meningkatkan sirkulasi.</li>
					<li>Low Level Laser Therapy – nyeri, penyembuhan luka, perbaikan sel.</li>
					<li>Elastic Taping</li>
					<li>Injeksi Muskuloskeletal</li>
				</ul>
			</div>
		)
	},
	{
		id: 'fisio-modalitas',
		title: '9. Jenis Layanan Fisioterapi – Modalitas Alat',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base leading-relaxed font-medium">
				<ul className="list-disc pl-5 space-y-1">
					<li><span className="font-semibold">Ultrasound Therapy:</span> kurangi ketegangan & nyeri, regenerasi jaringan.</li>
					<li><span className="font-semibold">Diathermy:</span> kurangi spasme & nyeri, tingkatkan sirkulasi & kelenturan.</li>
					<li><span className="font-semibold">Electrical Stimulation:</span> kurangi nyeri, stimulasi saraf & kontraksi otot.</li>
					<li><span className="font-semibold">Infra Red:</span> kurangi spasme, nyeri, tingkatkan metabolisme.</li>
					<li><span className="font-semibold">Paraffin Bath:</span> kurangi nyeri & baal, sirkulasi darah.</li>
					<li><span className="font-semibold">Traksi Lumbal & Cervical:</span> kurangi penekanan tulang belakang, regang facet joint.</li>
					<li><span className="font-semibold">Tilting Table:</span> adaptasi gravitasi & keseimbangan.</li>
					<li><span className="font-semibold">Nebulizer:</span> relaksasi jalan napas, mobilisasi sekret, kurangi sesak.</li>
				</ul>
			</div>
		)
	},
	{
		id: 'latihan-modalitas',
		title: '10. Modalitas Latihan',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base leading-relaxed font-medium">
				<ul className="list-disc pl-5 space-y-1">
					<li>Treadmill</li>
					<li>Med bike (kaki & tangan)</li>
					<li>Wall bar & Pulley</li>
					<li>Shoulder Wheel</li>
					<li>Massage & Exercise</li>
				</ul>
			</div>
		)
	},
	{
		id: 'operational-hours',
		title: '11. Jam Operasional',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base leading-relaxed font-medium">
				<ul className="list-disc pl-5 space-y-1">
					<li>Dokter SpKFR: Selasa & Kamis 00.00–14.00, Sabtu 09.30–13.00</li>
					<li>Fisioterapi: Senin–Sabtu 07.30–20.00</li>
					<li>Minggu & tanggal merah: Libur</li>
				</ul>
			</div>
		)
	}
];

function TraumaAccordion() {
	const [openId, setOpenId] = React.useState<string | null>(null);
	const toggle = (id: string) => setOpenId(prev => prev === id ? null : id);
	return (
		<section className="w-full pt-2 pb-24 bg-white">
			<div className="mx-auto w-full max-w-[1272px] px-4">
				<div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-sm">
					{sections.map((s, idx) => {
						const isOpen = openId === s.id;
						return (
							<div key={s.id}>
								<button
									onClick={() => toggle(s.id)}
									className={`w-full flex items-center justify-between py-4 text-left transition-colors ${isOpen ? 'text-orange-500' : 'text-neutral-800'}`}
								>
									<span className="font-semibold text-sm sm:text-base pr-4">{s.title}</span>
									<span className={`inline-flex items-center justify-center transition-transform duration-500 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
										<img src={DownIcon.src} alt="toggle" className="w-6 h-6" />
									</span>
								</button>
								<AnimatedCollapse isOpen={isOpen}>
									<div className="pb-6 pt-1 px-1 sm:px-2">
										{s.body}
									</div>
								</AnimatedCollapse>
								{idx < sections.length - 1 && <div className="h-px bg-zinc-200" />}
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

