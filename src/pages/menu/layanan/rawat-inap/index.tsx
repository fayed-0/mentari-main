import React from 'react';
import Head from 'next/head';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import AnimatedCollapse from '../../../../components/AnimatedCollapse';
import DownIcon from '../../../../components/HealthCare/source/down.svg';

export default function InpatientPage() {
	const roomCards = [
		{
			id: 'suite-1',
			title: 'Suite | Rp. 2.050.000',
			summary:
				'Tempat Tidur Elektrik, Bed Side Cabinet, Sofa Bed / Sofa, Dining Set, Kitchen Set, Televisi 40\", Kamar Mandi (Water heater), Lemari Pakaian, Ruangan Full AC',
			full:
				'Tempat Tidur Elektrik, Bed Side Cabinet, Sofa Bed / Sofa, Dining Set, Kitchen Set, Televisi 40\", Kamar Mandi (Water heater), Lemari Pakaian, Ruangan Full AC'
		},
		{
			id: 'vvip',
			title: 'VVIP | Rp. 2.050.000',
			summary:
				'Tempat Tidur Elektrik, Bed Side Cabinet, Sofa Bed / Sofa, Televisi 40\", Kamar Mandi (Water heater), Lemari Pakaian, Ruangan Full AC, Kulkas',
			full:
				'Tempat Tidur Elektrik, Bed Side Cabinet, Sofa Bed / Sofa, Televisi 40\", Kamar Mandi (Water heater), Lemari Pakaian, Ruangan Full AC, Kulkas'
		},
		{
			id: 'vip',
			title: 'VIP | Rp. 1.200.000',
			summary:
				'Tempat Tidur Elektrik, Bed Side Cabinet, Sofa Bed / Sofa, Televisi 40\", Kamar Mandi (Water heater), Lemari Pakaian, Ruangan Full AC, Kulkas Portable',
			full:
				'Tempat Tidur Elektrik, Bed Side Cabinet, Sofa Bed / Sofa, Televisi 40\", Kamar Mandi (Water heater), Lemari Pakaian, Ruangan Full AC, Kulkas Portable'
		},
		{
			id: 'kelas1',
			title: 'Kelas 1 | Rp. 625.000',
			summary:
				'Tempat Tidur Standar (2 Pasien per Kamar), Bed Side Cabinet, Sofa Bed / Sofa, 2 Televisi 30\", Kamar Mandi (Water heater), Lemari Pakaian, Ruangan Full AC',
			full:
				'Tempat Tidur Standar (2 Pasien per Kamar), Bed Side Cabinet, Sofa Bed / Sofa, 2 Televisi 30\", Kamar Mandi (Water heater), Lemari Pakaian, Ruangan Full AC'
		},
		{
			id: 'kelas2',
			title: 'Kelas 2 | Rp. 400.000',
			summary:
				'Tempat Tidur Standar (2 Pasien per Kamar), Bed Side Cabinet, Sofa Bed / Sofa, Televisi 30\" (Sharing), Kamar Mandi (Water heater), Lemari Pakaian, Ruangan Full AC',
			full:
				'Tempat Tidur Standar (2 Pasien per Kamar), Bed Side Cabinet, Sofa Bed / Sofa, Televisi 30\" (Sharing), Kamar Mandi (Water heater), Lemari Pakaian, Ruangan Full AC'
		},
		{
			id: 'kelas3',
			title: 'Kelas 3 | Rp. 200.000',
			summary:
				'Tempat Tidur Standar (3-4 Pasien per Kamar), Bed Side Cabinet, Sofa Bed / Sofa, Televisi 30\" (Sharing), Kamar Mandi (Water heater), Lemari Pakaian, Ruangan Full AC',
			full:
				'Tempat Tidur Standar (3-4 Pasien per Kamar), Bed Side Cabinet, Sofa Bed / Sofa, Televisi 30\" (Sharing), Kamar Mandi (Water heater), Lemari Pakaian, Ruangan Full AC'
		}
	];

	const [selectedCard, setSelectedCard] = React.useState<any | null>(null);
	const [isModalOpen, setIsModalOpen] = React.useState(false);

	// (mobile-only filter removed) 

	const openModal = (card: any) => {
		setSelectedCard(card);
		setIsModalOpen(true);
		document.body.style.overflow = 'hidden';
	};

	const closeModal = () => {
		setSelectedCard(null);
		setIsModalOpen(false);
		document.body.style.overflow = '';
	};

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
							<h1 className="text-black font-semibold font-be-vietnam tracking-tight text-2xl sm:text-3xl md:text-4xl leading-snug text-center mx-auto max-w-5xl">
								Pilihan Kamar Rawat Inap
							</h1>
							<p className="mt-6 text-neutral-700 text-sm sm:text-base font-medium max-w-3xl text-center mx-auto">
								Tersedia berbagai pilihan tipe kamar dengan fasilitas dan kenyamanan yang dapat disesuaikan dengan kebutuhan Anda
							</p>

							<div className="hidden md:block mt-10 md:mt-14">
								<div className="w-full max-w-[1271px] mx-auto relative" style={{ paddingTop: '88.75%' }}>
									{roomCards.map((card, idx) => {
										const col = idx % 3; // 0,1,2
										const row = Math.floor(idx / 3); // 0,1
										const leftPct = (col * 437) / 1271 * 100; // percentage from original px
										const topPct = (row * 584) / 1128 * 100; // percentage from original px
										const cardWidthPct = (384 / 1271) * 100; // original w-96 (384px)
										const cardHeightPct = (544 / 1128) * 100;
										return (
											<button
												key={card.id}
												onClick={() => openModal(card)}
												className="absolute overflow-hidden text-left"
												style={{
													left: `${leftPct}%`,
													top: `${topPct}%`,
													width: `${cardWidthPct}%`,
													height: `${cardHeightPct}%`
												}}
											>
												<div className="absolute left-0 top-0 rounded-[5px] w-full h-[70%] bg-neutral-400 flex items-center justify-center">
													<span className="text-white font-semibold">Coming Soon</span>
												</div>
												<div className="absolute left-0" style={{ top: '73%' }}>
													<h3 className="text-black text-xl font-semibold font-be-vietnam">{card.title}</h3>
												</div>
												<div className="absolute left-0" style={{ top: '79%' }}>
													<p className="text-black md:text-neutral-700 text-base font-medium font-be-vietnam">{card.summary}</p>
												</div>
											</button>
										);
									})}
								</div>
							</div>

							{isModalOpen && selectedCard && (
								<div
									className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
									role="dialog"
									aria-modal="true"
								>
									<button
										aria-label="Tutup"
										onClick={closeModal}
										className="absolute top-4 right-4 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
									>
										✕
									</button>

									{/* Modal content: image left, detail panel right (responsive) */}
									<div className="relative mx-4 w-[calc(100%-32px)] h-[78vh] md:mx-0 md:w-[70vw] md:h-[70vh] flex flex-col md:flex-row gap-6 items-stretch">
										{/* Left: image */}
										<div className="md:w-1/2 w-full aspect-square md:aspect-auto md:h-auto bg-black/800 rounded-lg overflow-hidden flex items-center justify-center relative">
											{/* show room title as a visual placeholder; replace with <Image> if you provide images */}
											<div className="w-full h-full flex items-center justify-center bg-cover bg-center" style={{ backgroundColor: '#b91c1c' }}>
												<div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">{selectedCard.title.split('|')[0]}</div>
											</div>
										</div>
										{/* Right: detail panel */}
										<div className="md:w-1/2 w-full bg-zinc-600 text-white rounded-lg p-6 flex flex-col">
											<h2 className="text-white text-xl md:text-3xl font-semibold mb-3">{selectedCard.title}</h2>
											<div className="flex-1 overflow-auto pr-2 text-xs md:text-base leading-relaxed max-h-[26vh] md:max-h-none">
												<p>{selectedCard.full}</p>
											</div>
											{/* Full width action button */}
											<div className="mt-4">
												<button onClick={closeModal} className="w-full bg-white text-zinc-900 hover:bg-white/90 py-2 rounded-md text-base md:py-3 md:text-lg font-semibold">Appointment</button>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</section>

					{/* Room Types Filter (mobile only) */}
					<div className="block md:hidden">
						<RoomTypeAccordion />
					</div>
				</main>
				<Footer />
			</div>
		</>
	);
}

// ---------------- Room Types (Filter) ----------------

interface ServiceItem {
	id: string;
	title: string;
	body: React.ReactNode;
}

const roomOptions: ServiceItem[] = [
	{
		id: 'suite',
		title: '1. Kamar Suite',
		body: (
			<div className="space-y-3">
				<div className="w-full h-40 rounded-md bg-neutral-300 flex items-center justify-center">
					<span className="text-white font-semibold">Coming Soon</span>
				</div>
				<h4 className="text-black text-sm font-semibold">Suite | Rp. 2.050.000</h4>
				<p className="text-neutral-700 text-sm">Tempat Tidur Elektrik, Bed Side Cabinet, Sofa Bed / Sofa, Dining Set, Kitchen Set, Televisi 40", Kamar Mandi (Water heater), Lemari Pakaian, Ruangan Full AC</p>
			</div>
		)
	},
	{
		id: 'vvip',
		title: '2. Kamar VVIP',
		body: (
			<div className="space-y-3">
				<div className="w-full h-40 rounded-md bg-neutral-300 flex items-center justify-center">
					<span className="text-white font-semibold">Coming Soon</span>
				</div>
				<h4 className="text-black text-sm font-semibold">VVIP | Rp. 2.050.000</h4>
				<p className="text-neutral-700 text-sm">Tempat Tidur Elektrik, Bed Side Cabinet, Sofa Bed / Sofa, Televisi 40", Kamar Mandi (Water heater), Lemari Pakaian, Ruangan Full AC, Kulkas</p>
			</div>
		)
	},
	{
		id: 'vip',
		title: '3. Kamar VIP',
		body: (
			<div className="space-y-3">
				<div className="w-full h-40 rounded-md bg-neutral-300 flex items-center justify-center">
					<span className="text-white font-semibold">Coming Soon</span>
				</div>
				<h4 className="text-black text-sm font-semibold">VIP | Rp. 1.200.000</h4>
				<p className="text-neutral-700 text-sm">Tempat Tidur Elektrik, Bed Side Cabinet, Sofa Bed / Sofa, Televisi 40", Kamar Mandi (Water heater), Lemari Pakaian, Ruangan Full AC, Kulkas Portable</p>
			</div>
		)
	},
	{
		id: 'kelas1',
		title: '4. Kelas 1',
		body: (
			<div className="space-y-3">
				<div className="w-full h-40 rounded-md bg-neutral-300 flex items-center justify-center">
					<span className="text-white font-semibold">Coming Soon</span>
				</div>
				<h4 className="text-black text-sm font-semibold">Kelas 1 | Rp. 625.000</h4>
				<p className="text-neutral-700 text-sm">Tempat Tidur Standar (2 Pasien per Kamar), Bed Side Cabinet, Sofa Bed / Sofa, 2 Televisi 30", Kamar Mandi (Water heater), Lemari Pakaian, Ruangan Full AC</p>
			</div>
		)
	},
	{
		id: 'kelas2',
		title: '5. Kelas 2',
		body: (
			<div className="space-y-3">
				<div className="w-full h-40 rounded-md bg-neutral-300 flex items-center justify-center">
					<span className="text-white font-semibold">Coming Soon</span>
				</div>
				<h4 className="text-black text-sm font-semibold">Kelas 2 | Rp. 400.000</h4>
				<p className="text-neutral-700 text-sm">Tempat Tidur Standar (2 Pasien per Kamar), Bed Side Cabinet, Sofa Bed / Sofa, Televisi 30" (Sharing), Kamar Mandi (Water heater), Lemari Pakaian, Ruangan Full AC</p>
			</div>
		)
	},
	{
		id: 'kelas3',
		title: '6. Kelas 3',
		body: (
			<div className="space-y-3">
				<div className="w-full h-40 rounded-md bg-neutral-300 flex items-center justify-center">
					<span className="text-white font-semibold">Coming Soon</span>
				</div>
				<h4 className="text-black text-sm font-semibold">Kelas 3 | Rp. 200.000</h4>
				<p className="text-neutral-700 text-sm">Tempat Tidur Standar (3-4 Pasien per Kamar), Bed Side Cabinet, Sofa Bed / Sofa, Televisi 30" (Sharing), Kamar Mandi (Water heater), Lemari Pakaian, Ruangan Full AC</p>
			</div>
		)
	}
];

function RoomTypeAccordion() {
	// Default open on mobile: suite
	const [openId, setOpenId] = React.useState<string | null>('suite');
	const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id));

	return (
		<section className="w-full pt-6 pb-6 bg-white">
			<div className="mx-auto w-full max-w-[1272px] px-4">
				<div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-sm">
					{roomOptions.map((item, idx) => {
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
									<div className="pb-4 pt-1 px-1 sm:px-2">{item.body}</div>
								</AnimatedCollapse>
								{idx < roomOptions.length - 1 && <div className="h-px bg-zinc-200" />}
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}


