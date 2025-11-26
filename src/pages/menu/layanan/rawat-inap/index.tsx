import React from 'react';
import Head from 'next/head';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import AnimatedCollapse from '../../../../components/AnimatedCollapse';
import DownIcon from '../../../../components/HealthCare/source/down.svg';
import fs from 'fs';
import path from 'path';

interface ServiceSection { id: string; title: string; bodyHtml: string; }
interface Room { id: string; title: string; summary: string; full: string; image: string; }
interface ServiceDetail { slug: string; title: string; description: string; heroImage?: string; sections: ServiceSection[]; rooms?: Room[]; }
interface PageProps { service: ServiceDetail; }

export default function InpatientPage({ service }: PageProps) {
	const roomCards: Room[] = service.rooms || [];

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
				<title>{service.title}</title>
				<meta name="description" content={service.description} />
			</Head>
			<div className="min-h-screen w-full bg-stone-50 flex flex-col">
				<Navbar />
				<main className="flex-1 w-full bg-white">
					<section className="relative w-full pt-24 pb-10 sm:pt-32 sm:pb-14">
						<div className="mx-auto w-full max-w-[1272px] px-4">
							{/* Hapus hero & info section: hanya grid kamar */}
							<div className="hidden md:block mt-4 md:mt-8">
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
												<div className="absolute left-0 top-0 rounded-[5px] w-full h-[70%] bg-neutral-400 flex items-center justify-center overflow-hidden">
													{card.image ? (
														<img src={card.image} alt={card.title} className="w-full h-full object-cover" />
													) : <span className="text-white font-semibold">Coming Soon</span>}
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
										<div className="md:w-1/2 w-full aspect-square md:aspect-auto md:h-auto rounded-lg overflow-hidden flex items-center justify-center relative bg-neutral-800">
											{selectedCard.image ? (
												<img src={selectedCard.image} alt={selectedCard.title} className="w-full h-full object-cover" />
											) : (
												<div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: '#b91c1c' }}>
													{selectedCard.title.split('|')[0]}
												</div>
											)}
											{/* Optional overlay gradient for readability on bright photos */}
											<div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
										</div>
										{/* Right: detail panel */}
										<div className="md:w-1/2 w-full bg-zinc-700 text-white rounded-lg p-6 flex flex-col">
											<h2 className="text-white text-xl md:text-3xl font-semibold mb-3">{selectedCard.title}</h2>
											<div className="flex-1 overflow-auto pr-2 text-xs md:text-base leading-relaxed max-h-[26vh] md:max-h-none">
												<p>{selectedCard.full}</p>
											</div>
											<div className="mt-4">
												<button onClick={closeModal} className="w-full bg-white text-zinc-900 hover:bg-white/90 py-2 rounded-md text-base md:py-3 md:text-lg font-semibold">Appointment</button>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</section>

					{/* Mobile only accordion kamar */}
							<div className="block md:hidden">
								<RoomTypeAccordion rooms={roomCards} />
							</div>
				</main>
				<Footer />
			</div>
		</>
	);
}

// ---------------- Room Types (Filter) ----------------

interface ServiceItem { id: string; title: string; body: React.ReactNode; }

function RoomTypeAccordion({ rooms }: { rooms: Room[] }) {
	const [openId, setOpenId] = React.useState<string | null>(rooms[0]?.id || null);
	const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id));
	const roomOptions: ServiceItem[] = rooms.map((r, i) => ({
		id: r.id,
		title: `${i + 1}. ${r.title.split('|')[0].trim()}`,
		body: (
			<div className="space-y-3">
				<div className="w-full h-40 rounded-md bg-neutral-300 flex items-center justify-center overflow-hidden">
					{r.image ? <img src={r.image} alt={r.title} className="w-full h-full object-cover" /> : <span className="text-white font-semibold">Coming Soon</span>}
				</div>
				<h4 className="text-black text-sm font-semibold">{r.title}</h4>
				<p className="text-neutral-700 text-sm">{r.summary}</p>
			</div>
		)
	}));

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

export async function getStaticProps() {
	const slug = 'rawat-inap';
	const filePath = path.join(process.cwd(), 'src', 'data', 'layanan', `${slug}.json`);
	let service: ServiceDetail;
	try {
		const raw = fs.readFileSync(filePath, 'utf-8');
		service = JSON.parse(raw);
	} catch (e) {
		service = { slug, title: 'Rawat Inap', description: 'Konten belum tersedia.', sections: [] };
	}
	return { props: { service }, revalidate: 60 };
}


