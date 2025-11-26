import React from 'react';
import Head from 'next/head';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import AnimatedCollapse from '../../../../components/AnimatedCollapse';
import DownIcon from '../../../../components/HealthCare/source/down.svg';
import fs from 'fs';
import path from 'path';

interface ServiceSection {
  id: string;
  title: string;
  bodyHtml: string;
}

interface ServiceDetail {
  slug: string;
  title: string;
  description: string;
  heroImage?: string;
  sections: ServiceSection[];
}

interface PageProps {
  service: ServiceDetail;
}

export default function OutpatientPage({ service }: PageProps) {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id));

  return (
    <>
      <Head>
        <title>{service.title}</title>
        <meta name="description" content={service.description} />
      </Head>
      <div className="min-h-screen w-full bg-stone-50 flex flex-col">
        <Navbar />
        <main className="flex-1 w-full bg-white">
          {/* HERO */}
          <section className="relative w-full pt-24 pb-10 sm:pt-32 sm:pb-14">
            <div className="mx-auto w-full max-w-[1272px] px-4">
              <div className="flex justify-center">
                <div className="inline-flex flex-col justify-start items-center gap-[5px] mb-4 font-be-vietnam">
                  <span className="text-black text-xs sm:text-sm font-semibold tracking-wide text-center">{service.slug.toUpperCase()}</span>
                  <span className="h-0.5 w-24 bg-orange-500 rounded-md" />
                </div>
              </div>
              <h1 className="text-black font-semibold font-be-vietnam tracking-tight text-2xl sm:text-3xl md:text-4xl leading-snug text-center mx-auto max-w-5xl">
                {service.title}
              </h1>
              <p className="mt-6 text-neutral-700 text-sm sm:text-base font-medium max-w-3xl text-center mx-auto">
                {service.description}
              </p>
              <div className="mt-10 sm:mt-14">
                {service.heroImage ? (
                  <img
                    src={service.heroImage}
                    alt={service.title}
                    className="w-full h-56 sm:h-[360px] md:h-[480px] object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-56 sm:h-[360px] md:h-[480px] bg-neutral-200 rounded-md flex items-center justify-center text-neutral-600 text-sm sm:text-base font-medium select-none">
                    Ilustrasi / Gambar Belum Tersedia
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* SECTIONS ACCORDION */}
          <section className="w-full pt-2 pb-20 bg-white">
            <div className="mx-auto w-full max-w-[1272px] px-4">
              <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-sm">
                {service.sections.map((item, idx) => {
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
                        <div className="pb-6 pt-1 px-1 sm:px-2 text-neutral-700 text-sm sm:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: item.bodyHtml }} />
                      </AnimatedCollapse>
                      {idx < service.sections.length - 1 && <div className="h-px bg-zinc-200" />}
                    </div>
                  );
                })}
                {service.sections.length === 0 && (
                  <p className="text-sm text-neutral-500">Belum ada konten untuk layanan ini.</p>
                )}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}

export async function getStaticProps() {
  const slug = 'rawat-jalan';
  const filePath = path.join(process.cwd(), 'src', 'data', 'layanan', `${slug}.json`);
  let service: ServiceDetail;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    service = JSON.parse(raw);
  } catch (e) {
    service = { slug, title: 'Layanan Rawat Jalan', description: 'Konten belum tersedia.', sections: [] };
  }
  return {
    props: { service },
    revalidate: 60 // ISR: refresh every 60s
  };
}

