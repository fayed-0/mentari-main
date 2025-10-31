import React from 'react';
import Head from 'next/head';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import AnimatedCollapse from '../../../../components/AnimatedCollapse';
import DownIcon from '../../../../components/HealthCare/source/down.svg';

export default function RadiologyPage() {
	return (
		<>
			<Head>
				<title>Layanan Radiologi & Pencitraan Medis</title>
				<meta
					name="description"
					content="Layanan radiologi lengkap dengan teknologi pencitraan terbaru untuk diagnosis yang akurat dan tepat."
				/>
			</Head>
			<div className="min-h-screen w-full bg-stone-50 flex flex-col">
				<Navbar />
				<main className="flex-1 w-full bg-white">
					<section className="relative w-full pt-24 pb-10 sm:pt-32 sm:pb-14">
						<div className="mx-auto w-full max-w-[1272px] px-4">
							<div className="flex justify-center">
								<div className="inline-flex flex-col justify-start items-center gap-[5px] mb-4 font-be-vietnam">
									<span className="text-black text-xs sm:text-sm font-semibold tracking-wide text-center">RADIOLOGI</span>
									<span className="h-0.5 w-24 bg-orange-500 rounded-md" />
								</div>
							</div>
							<h1 className="text-black font-semibold font-be-vietnam tracking-tight text-2xl sm:text-3xl md:text-4xl leading-snug text-center mx-auto max-w-5xl">
								Layanan Radiologi & Pencitraan Medis
							</h1>
							<p className="mt-6 text-neutral-700 text-sm sm:text-base font-medium max-w-3xl text-center mx-auto">
								Pemeriksaan radiologi komprehensif dengan peralatan modern untuk mendukung diagnosis yang akurat dan perencanaan perawatan yang optimal.
							</p>
							<div className="mt-10 sm:mt-14">
								<div className="w-full h-56 sm:h-[360px] md:h-[480px] bg-neutral-400 rounded-md flex items-center justify-center text-white text-sm sm:text-base font-medium select-none">
									{/* Placeholder area for future media (image / video / illustration) */}
									Media / Ilustrasi Radiologi (Coming Soon)
								</div>
							</div>
						</div>
					</section>

					{/* Radiology Services Accordion */}
					<RadiologyServicesAccordion />
				</main>
				<Footer />
			</div>
		</>
	);
}

// ---------------- Radiology Services Accordion ----------------
interface RadiologyServiceItem {
	id: string;
	title: string;
	body: React.ReactNode;
}

const radiologyServices: RadiologyServiceItem[] = [
	{
		id: 'x-ray',
		title: '1. X-Ray (Rontgen)',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>
					Pemeriksaan pencitraan menggunakan sinar-X untuk melihat kondisi tulang, sendi, dan organ dalam. Metode yang cepat dan efektif untuk mendeteksi berbagai kelainan.
				</p>
				<p className="font-semibold">Jenis Pemeriksaan:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>X-Ray Thorax (Dada)</li>
					<li>X-Ray Extremitas (Tangan & Kaki)</li>
					<li>X-Ray Spine (Tulang Belakang)</li>
					<li>X-Ray Abdomen (Perut)</li>
					<li>X-Ray Gigi & Rahang</li>
				</ul>
				<p>Persiapan: Umumnya tidak memerlukan persiapan khusus, kecuali untuk pemeriksaan tertentu.</p>
			</div>
		)
	},
	{
		id: 'ct-scan',
		title: '2. CT Scan (Computed Tomography)',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>
					Pemeriksaan pencitraan detail menggunakan kombinasi sinar-X dan teknologi komputer untuk menghasilkan gambar penampang tubuh secara 3D.
				</p>
				<p className="font-semibold">Keunggulan:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Deteksi tumor dan kanker</li>
					<li>Evaluasi cedera internal</li>
					<li>Pemeriksaan pembuluh darah</li>
					<li>Panduan untuk biopsi dan prosedur bedah</li>
				</ul>
				<p className="font-semibold">Persiapan:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Puasa 4-6 jam untuk pemeriksaan dengan kontras</li>
					<li>Informasi riwayat alergi dan penyakit</li>
				</ul>
			</div>
		)
	},
	{
		id: 'mri',
		title: '3. MRI (Magnetic Resonance Imaging)',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>
					Pemeriksaan menggunakan medan magnet kuat dan gelombang radio untuk menghasilkan gambar detail organ, jaringan lunak, tulang, dan struktur tubuh lainnya.
				</p>
				<p className="font-semibold">Indikasi:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Kelainan otak dan saraf tulang belakang</li>
					<li>Masalah sendi dan ligamen</li>
					<li>Tumor dan kanker</li>
					<li>Penyakit jantung dan pembuluh darah</li>
				</ul>
				<p className="font-semibold">Kontraindikasi:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Pemasangan alat pacu jantung</li>
					<li>Implan logam tertentu</li>
					<li>Klip aneurisma otak</li>
				</ul>
			</div>
		)
	},
	{
		id: 'usg',
		title: '4. USG (Ultrasonografi)',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>
					Pemeriksaan menggunakan gelombang suara frekuensi tinggi untuk melihat organ dalam tubuh secara real-time tanpa radiasi.
				</p>
				<p className="font-semibold">Jenis Pemeriksaan:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>USG Abdomen (Hati, Ginjal, Pankreas)</li>
					<li>USG Obstetri (Kehamilan)</li>
					<li>USG Thyroid (Kelenjar Tiroid)</li>
					<li>USG Payudara</li>
					<li>USG Doppler (Pembuluh Darah)</li>
				</ul>
				<p className="font-semibold">Persiapan:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Puasa 6-8 jam untuk USG abdomen</li>
					<li>Minum air dan menahan BAK untuk USG pelvis</li>
				</ul>
			</div>
		)
	},
	{
		id: 'mammografi',
		title: '5. Mammografi',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>
					Pemeriksaan X-Ray khusus untuk payudara untuk deteksi dini kanker payudara dan kelainan lainnya.
				</p>
				<p className="font-semibold">Jenis:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Mammografi Screening (Pemeriksaan rutin)</li>
					<li>Mammografi Diagnostik (Keluhan spesifik)</li>
					<li>Mammografi Digital</li>
				</ul>
				<p className="font-semibold">Rekomendasi:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Wanita usia 40+ tahun: Screening tahunan</li>
					<li>Wanita dengan risiko tinggi: Konsultasi dokter</li>
				</ul>
			</div>
		)
	},
	{
		id: 'fluoroscopy',
		title: '6. Fluoroskopi',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>
					Pemeriksaan pencitraan real-time menggunakan sinar-X untuk melihat pergerakan organ tubuh, sering digunakan sebagai panduan prosedur medis.
				</p>
				<p className="font-semibold">Aplikasi:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Pemeriksaan saluran cerna (Barium Swallow/Enema)</li>
					<li>Prosedur angiografi</li>
					<li>Pemasangan stent dan kateter</li>
					<li>Evaluasi sendi dan tulang</li>
				</ul>
			</div>
		)
	},
	{
		id: 'bone-densitometry',
		title: '7. Bone Densitometry (DEXA Scan)',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>
					Pemeriksaan untuk mengukur kepadatan mineral tulang dan mendiagnosis osteoporosis.
				</p>
				<p className="font-semibold">Indikasi:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Wanita post-menopause</li>
					<li>Riwayat fraktur akibat trauma ringan</li>
					<li>Penggunaan steroid jangka panjang</li>
					<li>Penyakit yang mempengaruhi metabolisme tulang</li>
				</ul>
				<p>Prosedur cepat, non-invasif, dan tanpa rasa sakit.</p>
			</div>
		)
	},
	{
		id: 'interventional-radiology',
		title: '8. Radiologi Intervensi',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>
					Prosedur minimal invasif yang menggunakan panduan pencitraan untuk diagnosis dan pengobatan berbagai kondisi medis.
				</p>
				<p className="font-semibold">Prosedur:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Biopsi dengan panduan USG/CT</li>
					<li>Drainase abses</li>
					<li>Embolisasi untuk menghentikan perdarahan</li>
					<li>Ablasi tumor</li>
					<li>Angioplasty dan stent placement</li>
				</ul>
			</div>
		)
	},
	{
		id: 'dental-radiology',
		title: '9. Radiologi Dental',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>
					Pemeriksaan pencitraan khusus untuk gigi dan rahang untuk mendukung perawatan gigi yang komprehensif.
				</p>
				<p className="font-semibold">Jenis Pemeriksaan:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Panoramic (OPG)</li>
					<li>Periapikal</li>
					<li>CEPH (Cephalometric)</li>
					<li>CBCT (Cone Beam CT)</li>
				</ul>
				<p>Membantu diagnosis karies, penyakit periodontal, impaksi gigi, dan perencanaan implan.</p>
			</div>
		)
	},
	{
		id: 'pediatric-radiology',
		title: '10. Radiologi Pediatric',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>
					Layanan radiologi khusus untuk bayi, anak, dan remaja dengan teknik dan protokol yang disesuaikan untuk kebutuhan khusus anak.
				</p>
				<p className="font-semibold">Fitur Khusus:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Dosis radiasi yang disesuaikan</li>
					<li>Prosedur yang cepat dan minim rasa tidak nyaman</li>
					<li>Staf yang terlatih dalam menangani pasien anak</li>
					<li>Lingkungan yang ramah anak</li>
				</ul>
			</div>
		)
	},
	{
		id: 'emergency-radiology',
		title: '11. Radiologi Emergency 24 Jam',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>
					Layanan radiologi tersedia 24 jam untuk menangani kasus-kasus darurat seperti trauma, kecelakaan, dan kondisi gawat darurat lainnya.
				</p>
				<p className="font-semibold">Layanan:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>X-Ray darurat</li>
					<li>CT Scan kepala dan tubuh</li>
					<li>USG emergency</li>
					<li>Fast-track reporting untuk kasus kritis</li>
				</ul>
				<p>Bekerja sama dengan tim emergency untuk penanganan yang cepat dan tepat.</p>
			</div>
		)
	},
	{
		id: 'contrast-studies',
		title: '12. Pemeriksaan dengan Kontras',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>
					Pemeriksaan menggunakan zat kontras untuk meningkatkan visibilitas organ dan pembuluh darah tertentu.
				</p>
				<p className="font-semibold">Jenis Kontras:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Kontras oral untuk saluran cerna</li>
					<li>Kontras intravena untuk CT dan MRI</li>
					<li>Kontras intra-articular untuk sendi</li>
				</ul>
				<p className="font-semibold">Persiapan:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Puasa sesuai instruksi</li>
					<li>Informasi riwayat alergi dan fungsi ginjal</li>
					<li>Penghentian obat tertentu sesuai konsultasi dokter</li>
				</ul>
			</div>
		)
	}
];

function RadiologyServicesAccordion() {
	const [openId, setOpenId] = React.useState<string | null>(null);
	const toggle = (id: string) => setOpenId(prev => prev === id ? null : id);

	return (
		<section className="w-full pt-2 pb-20 bg-white">
			<div className="mx-auto w-full max-w-[1272px] px-4">
				<div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-sm">
					{radiologyServices.map((item, idx) => {
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
									<div className="pb-6 pt-1 px-1 sm:px-2">
										{item.body}
									</div>
								</AnimatedCollapse>
								{idx < radiologyServices.length - 1 && <div className="h-px bg-zinc-200" />}
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}