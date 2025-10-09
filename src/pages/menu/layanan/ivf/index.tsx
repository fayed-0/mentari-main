import React from 'react';
import Head from 'next/head';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import AnimatedCollapse from '../../../../components/AnimatedCollapse';
import DownIcon from '../../../../components/HealthCare/source/down.svg';

// IVF (Morula) service page hero
// Adapted from provided fixed-size layout into responsive section.
// Original sizes: container 1512x853, heading width 1270 @ top 90px, gray box 1270x481 @ top 282.
// We map to: full-width section with max-w, vertical spacing, responsive typography.

export default function IVFPage() {
	return (
		<>
			<Head>
				<title>Klinik Bayi Tabung &amp; Gangguan Kesuburan | Mentari</title>
				<meta
					name="description"
					content="Klinik bayi tabung (IVF) dan penanganan gangguan kesuburan dengan tim profesional dan fasilitas modern."
				/>
			</Head>
			<div className="min-h-screen w-full bg-stone-50 flex flex-col">
				<Navbar />
				<main className="flex-1 w-full bg-white">
					<section className="relative w-full pt-24 pb-10 sm:pt-32 sm:pb-14">
						<div className="mx-auto w-full max-w-[1272px] px-4">
							<div className="flex flex-col items-center gap-2 mb-4">
								<span className="text-black text-xs sm:text-sm font-semibold tracking-wide">IVF MORULLA</span>
								<span className="w-24 h-0 outline outline-2 outline-offset-[-1px] outline-orange-500" />
							</div>
							<h1 className="text-black font-bold font-sans tracking-tight text-2xl sm:text-3xl md:text-5xl leading-snug text-center mx-auto max-w-5xl">
								Klinik Bayi Tabung Dan Gangguan Kesuburan
							</h1>
							<p className="mt-6 text-neutral-700 text-sm sm:text-base font-medium max-w-3xl text-center mx-auto">
								Layanan fertilitas komprehensif mulai dari konsultasi, evaluasi kesuburan, prosedur IVF, hingga pendampingan emosional bagi pasangan.
							</p>
							<div className="mt-10 sm:mt-14">
								<div className="w-full h-56 sm:h-[360px] md:h-[480px] bg-neutral-400 rounded-md flex items-center justify-center text-white text-sm sm:text-base font-medium select-none">
									{/* Placeholder area for future media (image / video / illustration) */}
									Media / Ilustrasi (Coming Soon)
								</div>
							</div>
						</div>
					</section>

					{/* IVF Services / Programs Accordion */}
					<IVFServicesAccordion />
				</main>
				<Footer />
			</div>
		</>
	);
}

// ---------------- IVF Services Accordion ----------------
interface IVFServiceItem {
	id: string;
	title: string;
	body: React.ReactNode;
}

const ivfServices: IVFServiceItem[] = [
	{
		id: 'ovulation-induction',
		title: '1. Ovulation Induction (OI)',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>
					Ovulasi Induksi adalah prosedur untuk merangsang ovarium agar menghasilkan satu atau lebih sel telur matang
					menggunakan obat penyubur. Ditujukan bagi pasien dengan siklus haid tidak teratur atau anovulasi.
				</p>
				<p className="font-semibold">Tahapan:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Pemberian obat hormonal (Clomiphene Citrate / Gonadotropin) untuk stimulasi folikel.</li>
					<li>Monitoring USG transvaginal menilai ukuran folikel & ketebalan endometrium.</li>
					<li>Suntikan hCG pemicu ovulasi saat folikel 18–20 mm.</li>
				</ul>
				<p>Umumnya dipilih bila analisa sperma normal (jumlah, morfologi, motilitas).</p>
			</div>
		)
	},
	{
		id: 'tracking-cycle',
		title: '2. Tracking Cycle',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>Pemantauan siklus ovulasi untuk menentukan waktu subur optimal.</p>
				<p className="font-semibold">Langkah:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Mencatat tanggal menstruasi beberapa bulan.</li>
					<li>Mengamati suhu basal & perubahan lendir serviks.</li>
					<li>USG serial melihat pertumbuhan folikel.</li>
				</ul>
				<p>Membantu menentukan timing hubungan / inseminasi / IVF.</p>
			</div>
		)
	},
	{
		id: 'iui',
		title: '3. Intra Uterine Insemination (IUI)',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>
					Inseminasi buatan dengan menempatkan sperma terpilih langsung ke dalam rahim saat ovulasi untuk meningkatkan
					peluang pertemuan sperma dan sel telur.
				</p>
				<p className="font-semibold">Indikasi:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Gangguan sperma ringan (oligo / astheno / terato).</li>
					<li>Gangguan ovulasi ringan.</li>
					<li>Masalah lendir serviks.</li>
					<li>Infertilitas idiopatik.</li>
				</ul>
				<p className="font-semibold">Prosedur:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Stimulasi ovarium.</li>
					<li>Monitoring ovulasi (USG / test LH).</li>
					<li>Preparasi sperma (washing & seleksi motilitas tinggi).</li>
					<li>Inseminasi via kateter tipis.</li>
				</ul>
			</div>
		)
	},
	{
		id: 'ivf',
		title: '4. In Vitro Fertilization (IVF)',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>
					IVF (bayi tabung) adalah pembuahan di luar tubuh (laboratorium) lalu embrio terbaik dipindahkan ke rahim. Cocok
					untuk tuba tersumbat, kualitas sperma rendah, endometriosis, gangguan ovulasi berat, atau infertilitas idiopatik.
				</p>
				<p className="font-semibold">Tahapan:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Stimulasi ovarium multi-folikel.</li>
					<li>Ovum pick-up (aspirasi oosit).</li>
					<li>Pembuahan & kultur embrio 3–5 hari.</li>
					<li>Embryo transfer.</li>
				</ul>
			</div>
		)
	},
	{
		id: 'icsi',
		title: '5. Intra Cytoplasmic Sperm Injection (ICSI)',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>
					Teknik mikro di mana satu sperma disuntikkan langsung ke sitoplasma oosit — efektif untuk sperma sangat rendah
					jumlah atau motilitas.
				</p>
				<p className="font-semibold">Proses Ringkas:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Suntik sperma tunggal (mikromanipulator).</li>
					<li>Kultur embrio 3–5 hari.</li>
					<li>Transfer embrio sehat.</li>
				</ul>
			</div>
		)
	},
	{
		id: 'sperm-freezing',
		title: '6. Sperm Freezing',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>Pembekuan sperma (cryopreservation) pada -196°C untuk penggunaan masa depan.</p>
				<p className="font-semibold">Tujuan:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Sebelum kemoterapi / radioterapi.</li>
					<li>Cadangan program IVF.</li>
					<li>Kondisi medis menghambat ejakulasi rutin.</li>
				</ul>
				<p>Sperma beku dapat disimpan &gt;10 tahun dengan viabilitas baik.</p>
			</div>
		)
	},
	{
		id: 'oocyte-freezing',
		title: '7. Oocyte Freezing',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>Penyimpanan oosit matang melalui vitrifikasi untuk menjaga kesuburan.</p>
				<p className="font-semibold">Proses:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Stimulasi ovarium multi oosit.</li>
					<li>Pengambilan oosit (OPU).</li>
					<li>Vitrifikasi cepat mencegah kristal es.</li>
				</ul>
				<p>Bermanfaat bagi yang menunda kehamilan / terapi kanker.</p>
			</div>
		)
	},
	{
		id: 'embryo-freezing',
		title: '8. Embryo Freezing',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>Pembekuan embrio hasil IVF menggunakan vitrifikasi untuk siklus berikut tanpa stimulasi ulang.</p>
				<p className="font-semibold">Keuntungan:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Hemat biaya & waktu siklus lanjut.</li>
					<li>Kesempatan tambahan kehamilan.</li>
				</ul>
			</div>
		)
	},
	{
		id: 'fet',
		title: '9. Frozen Embryo Transfer (FET)',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>Transfer embrio beku yang dicairkan ke rahim setelah persiapan endometrium.</p>
				<p className="font-semibold">Keuntungan:</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Menghindari stimulasi ulang.</li>
					<li>Timing fleksibel.</li>
					<li>Outcome sebanding embrio segar bila kualitas baik.</li>
				</ul>
			</div>
		)
	},
	{
		id: 'teda-procedures',
		title: '10. TESA, MESA, dan PESA',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>Teknik bedah mikro mengambil sperma langsung dari testis / epididimis pada azoospermia.</p>
				<ul className="list-disc pl-5 space-y-1">
					<li><span className="font-semibold">TESA:</span> Aspirasi jaringan testis jarum halus.</li>
					<li><span className="font-semibold">MESA:</span> Aspirasi epididimis mikrosurgical.</li>
					<li><span className="font-semibold">PESA:</span> Aspirasi epididimis perkutaneus.</li>
				</ul>
				<p>Biasanya untuk material ICSI.</p>
			</div>
		)
	},
	{
		id: 'sperm-analysis',
		title: '11. Sperm Analysis',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>Evaluasi kualitas & kuantitas sperma: volume, konsentrasi, motilitas, morfologi, pH, viskositas.</p>
				<p>Dasar menentukan faktor pria dalam infertilitas.</p>
			</div>
		)
	},
	{
		id: 'dfi',
		title: '12. DFI (DNA Fragmentation Index)',
		body: (
			<div className="space-y-4 text-neutral-700 text-sm sm:text-base font-medium leading-relaxed">
				<p>Menilai tingkat kerusakan DNA sperma—fragmentasi tinggi berdampak pada fertilisasi, perkembangan embrio, dan risiko keguguran.</p>
				<p>Disarankan pada infertilitas lama, keguguran berulang, atau kegagalan IVF/ICSI.</p>
			</div>
		)
	}
];

function IVFServicesAccordion() {
	const [openId, setOpenId] = React.useState<string | null>(null);
	const toggle = (id: string) => setOpenId(prev => prev === id ? null : id);

	return (
		<section className="w-full pt-2 pb-20 bg-white">
			<div className="mx-auto w-full max-w-[1272px] px-4">
				<div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-sm">
					{ivfServices.map((item, idx) => {
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
								{idx < ivfServices.length - 1 && <div className="h-px bg-zinc-200" />}
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

