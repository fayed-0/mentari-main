import Image from 'next/image';
import Link from 'next/link';
import ArrowIcon from '../OurDoctor/source/arrow.svg';
import suiteImg from './source/suite.png';
import vipImg from './source/VIP.png';
import vvipImg from './source/VVIP.png';

interface CardProps {
	variant?: 'large' | 'small';
	title: string;
	description: string;
	image: any; 
	imageOffset?: string; 
}


const Card = ({ variant = 'small', title, description, image, imageOffset }: CardProps) => {
	// Heights scale down on tablet (sm) and up again on desktop (md)
	const sizeClasses = variant === 'large'
		? 'w-full h-[220px] sm:h-[300px] md:h-[384px]'
		: 'w-full h-[200px] sm:h-[300px] md:h-[384px]';
	return (
		<div className={`${sizeClasses} relative bg-neutral-600 rounded-[5px] overflow-hidden group`}>
			<div className={`absolute inset-0 ${imageOffset || ''}`}>
				<Image src={image} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
			</div>
			<div className="absolute inset-0 bg-neutral-600/20" />
			<div className="absolute bottom-5 left-5 right-5 sm:left-7 sm:right-7 text-white space-y-2">
				<h3 className={`font-semibold text-sm sm:text-xl`}>{title}</h3>
				<p className="font-medium leading-snug text-xs sm:text-base">{description}</p>
			</div>
		</div>
	);
};

type ViewMoreProps = {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    boxed?: boolean;
};

const ViewMore = ({ size = 'md', className = '', boxed = false }: ViewMoreProps) => {
    const sizeClass = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base';
    return (
        <Link
            href="/menu/rawat-inap"
            className={`inline-flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white transition ${sizeClass} ${className} ${
                boxed ? 'bg-white border border-zinc-300 rounded-md px-3 py-1.5 shadow-sm hover:shadow md:px-4 md:py-2' : ''
            }`}
            aria-label="Lihat lebih banyak kamar rawat inap"
        >
            <span className={`font-semibold ${boxed ? 'text-orange-500' : 'text-orange-500 hover:underline'}`}>View More</span>
			<img src={ArrowIcon.src} alt="arrow" className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
        </Link>
    );
};

export default function RawatInapSection() {
	return (
		<section className="w-full pt-8 pb-6 sm:pt-20 sm:pb-12 px-4 sm:px-6 md:px-16">
			<div className="mx-auto w-full max-w-[1272px]">
				{/* Section Label + Mobile View More */}
				<div className="flex flex-row items-center justify-between mb-6 md:mb-6">
					<div className="inline-flex flex-col items-start gap-1">
						<span className="text-black font-semibold tracking-wide text-xs sm:text-sm">RAWAT INAP</span>
						<span className="w-24 h-0 outline outline-2 outline-offset-[-1px] outline-orange-500" />
					</div>
					<div className="block md:hidden ml-2">
						<ViewMore size="md" boxed />
					</div>
				</div>
				{/* Heading + Desktop View More */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 sm:mb-14">
					<h1 className="max-w-[1052px] text-black text-2xl sm:text-2xl md:text-4xl font-semibold leading-snug">
						Ruang rawat inap modern dengan pilihan suite hingga kamar standar yang nyaman
					</h1>
					<div className="hidden md:flex items-center gap-2 mt-4 md:mt-0 ml-auto cursor-pointer">
						<ViewMore size="md" boxed />
					</div>
				</div>

				{/* Mobile Full-Width Layout */}
				<div className="sm:hidden mb-5 flex w-full gap-[10px]">
					<div className="relative h-52 flex-[6] bg-neutral-600 rounded-[10px] overflow-hidden">
						<div className="absolute inset-0 -top-[18px]">
							<Image src={suiteImg} alt="Suite" fill className="object-cover" />
						</div>
						<div className="absolute left-3 bottom-3 text-white text-sm font-semibold">Suite</div>
					</div>
					<div className="relative h-52 flex-[3] bg-neutral-600 rounded-[10px] overflow-hidden">
						<div className="absolute inset-0 -left-[35px]">
							<Image src={vvipImg} alt="VVIP" fill className="object-cover" />
						</div>
						<div className="absolute left-2 bottom-3 text-white text-sm font-semibold">VVIP</div>
					</div>

					<div className="relative h-52 flex-[3] bg-neutral-600 rounded-[10px] overflow-hidden">
						<div className="absolute inset-0 -left-[29px]">
							<Image src={vipImg} alt="VIP" fill className="object-cover" />
						</div>
						<div className="absolute left-2 bottom-3 text-white text-sm font-semibold">VIP</div>
					</div>
				</div>

				{/* Tablet/Desktop */}
				<div className="hidden sm:grid sm:grid-cols-12 sm:gap-[20px] md:gap-[25px]">
					<div className="col-span-12 sm:col-span-6">
						<Card
							variant="large"
							title="Suite"
							description="Ruang rawat inap eksklusif dengan kenyamanan layaknya di rumah, cocok untuk Anda yang mengutamakan privasi dan pelayanan premium."
							image={suiteImg}
							imageOffset=""
						/>
					</div>
					<div className="col-span-12 sm:col-span-3">
						<Card
							title="VVIP"
							description="Ruang rawat inap mewah menghadirkan ketenangan dan kenyamanan maksimal."
							image={vvipImg}
							imageOffset=""
						/>
					</div>
					<div className="col-span-12 sm:col-span-3">
						<Card
							title="VIP"
							description="Ruang rawat inap modern dengan fasilitas lengkap untuk istirahat nyaman."
							image={vipImg}
							imageOffset=""
						/>
					</div>
				</div>
			</div>
		</section>
	);
}

export { Card };
