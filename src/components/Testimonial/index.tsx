// Testimonial.tsx
import React from "react";
import Img1 from "./source/img1.png";
import Img2 from "./source/img2.png";
import LArrow from "./source/L_arrow.svg";
import RArrow from "./source/r_arrow.svg";
import Star from "./source/si_star.svg";
import Arrow from "./source/arrow.svg";

type ViewMoreProps = {
	size?: "sm" | "md" | "lg";
	boxed?: boolean;
	className?: string;
};

const ViewMore = ({ size = "md", boxed = false, className = "" }: ViewMoreProps) => {
	const sizeCls = size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base";
	const base = "inline-flex items-center gap-2 font-semibold cursor-pointer";
	const color = "text-orange-500";
	const boxedCls = "bg-white border border-zinc-300 rounded-md px-3 py-1.5 shadow-sm hover:shadow md:px-4 md:py-2";
	const arrowSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";
	return (
		<div className={`${base} ${color} ${boxed ? boxedCls : "hover:underline"} ${sizeCls} ${className}`}>
			<span>View More</span>
			<img src={(Arrow as any).src ? (Arrow as any).src : (Arrow as any)} alt="arrow" className={arrowSize} />
		</div>
	);
};


const testimonials = [
	{
		id: 1,
		name: "Lorem Ipsum",
		message:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		img: Img1,
		rating: 5,
	},
	{
		id: 2,
		name: "Lorem Ipsum",
		message:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		img: Img2,
		rating: 5,
	},
];

export default function Testimonial() {
	const [active, setActive] = React.useState(0);
	const [slideDirection, setSlideDirection] = React.useState<'left' | 'right' | null>(null);
	const [isSliding, setIsSliding] = React.useState(false);
	const maxIdx = testimonials.length - 1;

	const next = () => {
		if (isSliding) return; 
		setSlideDirection('left'); 
		setIsSliding(true); 
		setTimeout(() => { 
			setActive((prev) => (prev < maxIdx ? prev + 1 : 0)); 
			setIsSliding(false); 
		}, 300); 
	};
	const prev = () => {
		if (isSliding) return; 
		setSlideDirection('right'); 
		setIsSliding(true); 
		setTimeout(() => { 
			setActive((prev) => (prev > 0 ? prev - 1 : maxIdx)); 
			setIsSliding(false); 
		}, 300); 
	};

	// Touch events for swipe
	const touchStartX = React.useRef(0);
	const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
		touchStartX.current = e.touches[0].clientX;
	};
	const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
		const deltaX = e.changedTouches[0].clientX - touchStartX.current;
		if (deltaX > 50) prev();
		if (deltaX < -50) next();
	};

	return (
		<div className="w-full bg-white overflow-hidden py-12">
			<div className="max-w-[1272px] mx-auto px-4">

				{/* Header + View More (Mobile) */}
				<div className="flex flex-row items-center justify-between mb-4">
					<div className="inline-flex flex-col items-start gap-1">
						<h3 className="text-xs sm:text-base font-semibold text-black">
							TESTIMONIAL
						</h3>
						<div className="w-20 h-0.5 bg-orange-500"></div>
					</div>
					<div className="block md:hidden ml-2">
						<ViewMore size="md" boxed />
					</div>
				</div>

				{/* Heading + View More (Desktop) */}
				<div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
					<h2 className="text-2xl sm:text-[16px] md:text-[32px] font-semibold text-black max-w-4xl">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit
					</h2>
					<div className="hidden md:inline-flex ml-6 mt-2 md:mt-0">
						<ViewMore size="md" boxed />
					</div>
				</div>

				{/* Mobile: single testimonial, swipe & button next/prev, with sliding effect */}
				<div className="block md:hidden relative mb-8">
					<div
						className="overflow-hidden w-full"
						onTouchStart={handleTouchStart}
						onTouchEnd={handleTouchEnd}
						style={{ position: 'relative', height: '100%' }}
					>
						<div
							className="min-w-full bg-white rounded-lg outline outline-1 outline-zinc-300 p-6 flex flex-col items-start gap-6"
							style={{
								transform: isSliding
									? slideDirection === 'left'
										? 'translateX(-100%)'
										: 'translateX(100%)'
									: 'translateX(0)',
								transition: 'transform 0.3s linear',
							}}
						>
							<div className="flex flex-row items-center gap-4 mb-4">
								<div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-300 flex-shrink-0">
									<img
										src={testimonials[active].img.src ? testimonials[active].img.src : (testimonials[active].img as any)}
										alt={testimonials[active].name}
										className="w-full h-full object-cover"
									/>
								</div>
								<div className="flex flex-col">
									<div className="text-sm font-semibold text-black mb-1">
										{testimonials[active].name}
									</div>
									<div className="flex gap-2 mb-1">
										{Array.from({ length: testimonials[active].rating }).map((_, idx) => (
											<img
												key={idx}
												src={Star.src ? Star.src : Star}
												alt="star"
												className="w-5 h-5"
											/>
										))}
									</div>
								</div>
							</div>
							<p className="text-neutral-600 text-sm font-medium">
								{testimonials[active].message}
							</p>

						</div>
					</div>
					{/* Navigation Arrows */}
					<div className="flex justify-center items-center gap-6 mt-6">
						<img
							src={LArrow.src ? LArrow.src : LArrow}
							alt="left"
							className={`w-8 h-8 cursor-pointer ${active === 0 ? 'opacity-50 pointer-events-none' : ''}`}
							onClick={prev}
						/>
						<img
							src={RArrow.src ? RArrow.src : RArrow}
							alt="right"
							className={`w-8 h-8 cursor-pointer ${active === maxIdx ? 'opacity-50 pointer-events-none' : ''}`}
							onClick={next}
						/>
					</div>
				</div>

				{/* Desktop: grid or carousel as before */}
				<div className="hidden md:grid grid-cols-2 gap-6 justify-center mb-8">
					{testimonials.map((t) => (
						<div
							key={t.id}
							className="bg-white rounded-lg outline outline-1 outline-zinc-300 p-6 flex flex-col md:flex-row items-start gap-6"
						>
							<div className="flex flex-row items-center gap-4 mb-4 md:mb-0">
									<div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-300 flex-shrink-0">
									<img
										src={t.img.src ? t.img.src : (t.img as any)}
										alt={t.name}
										className="w-full h-full object-cover"
									/>
								</div>
								<div className="flex flex-col md:hidden">
									<div className="text-lg font-semibold text-black mb-1">
										{t.name}
									</div>
									<div className="flex gap-2 mb-1">
										{Array.from({ length: t.rating }).map((_, idx) => (
											<img
												key={idx}
												src={Star.src ? Star.src : Star}
												alt="star"
												className="w-5 h-5"
											/>
										))}
									</div>
								</div>
							</div>
							<div className="flex flex-col">
								<div className="hidden md:block">
									<div className="text-xl font-semibold text-black mb-2">
										{t.name}
									</div>
									<div className="flex gap-2 mb-2">
										{Array.from({ length: t.rating }).map((_, idx) => (
											<img
												key={idx}
												src={Star.src ? Star.src : Star}
												alt="star"
												className="w-5 h-5"
											/>
										))}
									</div>
								</div>
								<p className="text-neutral-600 text-base sm:text-lg font-medium">
									{t.message}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
