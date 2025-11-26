import React from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { useRouter } from "next/router";
import ImgRawatJalan from "./source/rawat-jalan.png";
import ImgRawatInap from "./source/rawat-inap.png";
import ImgGawatDarurat from "./source/gawat-darurat.png";
import ImgRadiologi from "./source/radiologi.png";
import ImgIVFMorulla from "./source/IVF-morulla.png";
import ImgTraumaCenter from "./source/trauma-center.png";

type ServiceListItem = { slug: string; title: string; image: string; visible: boolean; order: number };
type ServiceListData = { headerTitle: string; services: ServiceListItem[] };

export default function LayananPage() {
	const router = useRouter();
	const [data, setData] = React.useState<ServiceListData>({ headerTitle: "", services: [] });
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const res = await fetch('/api/layanan');
				const j = await res.json();
				if (!mounted) return;
				const d: ServiceListData = j.data || { headerTitle: '', services: [] };
				d.services = (d.services || []).filter(s=>s.visible!==false).sort((a,b)=>a.order-b.order);
				setData(d);
			} catch (e:any) {
				setError(e?.message || 'Gagal memuat layanan');
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => { mounted = false; };
	}, []);

	const staticImageMap: Record<string, string> = {
		'rawat-jalan': ImgRawatJalan.src,
		'rawat-inap': ImgRawatInap.src,
		'gawat-darurat': ImgGawatDarurat.src,
		'radiologi': ImgRadiologi.src,
		'ivf': ImgIVFMorulla.src,
		'trauma-center': ImgTraumaCenter.src,
	};

	return (
		<div className="min-h-screen w-full bg-stone-50">
			<Navbar />

			{/* Header */}
			<section className="max-w-[1512px] mx-auto px-4 sm:px-6 md:px-10 pt-10 md:pt-20 pb-10">
				<div className="max-w-[1272px] mx-auto items-center pt-12 px-2">
					<div className="flex flex-col items-center gap-[5px] w-fit mx-auto">
						<span className="text-black text-xs sm:text-sm font-semibold text-center">
							LAYANAN
						</span>
						<div className="h-0.5 bg-orange-500 rounded-md w-full"></div>
					</div>

					<div className="mt-4 relative flex items-center justify-center w-full">
						<h1 className="text-center text-black text-2xl md:text-4xl font-semibold max-w-[1127px]">
							{data.headerTitle || 'Menyediakan layanan kesehatan terpercaya dengan tenaga medis berpengalaman'}
						</h1>
					</div>

					{/* Cards grid: match Paket/Fasilitas — 2 cols mobile, 3 cols at md, same gaps */}
					<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 w-full mt-14">
						{loading && (
							<div className="col-span-2 md:col-span-3 text-sm text-slate-500">Memuat...</div>
						)}
						{!loading && data.services.map((svc, idx) => (
							<button
								key={idx}
								type="button"
								onClick={() => router.push(`/menu/layanan/${svc.slug}`)}
								className={[
									"group relative w-full aspect-square rounded-[5px] overflow-hidden outline outline-1 outline-zinc-300",
									"transition-all duration-300 hover:scale-105 hover:shadow-xl",
									"focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:outline-offset-2",
								].join(" ")}
							>
								{/* Background image */}
								<img src={svc.image || staticImageMap[svc.slug] || ''} alt={svc.title} className="absolute inset-0 w-full h-full object-cover" />
								{/* Dark overlay for legibility */}
								<div className="absolute inset-0 bg-black/30" />

								{/* Top-left boxed label (like Fasilitas) */}
								<div className="absolute left-3 top-3 md:left-4 md:top-4">
									<div className="relative inline-block">
										<div className="relative px-2 py-1 md:px-4 md:py-2 bg-white/75 inline-flex justify-start items-center whitespace-nowrap text-black text-xs sm:text-sm md:text-xl font-medium font-be-vietnam rounded-tl-[5px] md:rounded-tl-[5px] rounded-br-[5px] md:rounded-br-[5px] rounded-tr-[5px] rounded-bl-[5px] shadow">
											{svc.title}
										</div>
									</div>
								</div>
							</button>
						))}
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}

