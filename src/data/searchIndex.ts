import { specializations, toSlug } from "./specializations";
import { doctors } from "./doctors";

export type SearchItem = {
  title: string;
  description?: string;
  path: string;
  type: "page" | "specialization" | "doctor";
  tags?: string[];
};

export const buildSearchIndex = (): SearchItem[] => {
  const items: SearchItem[] = [];

  // Core pages
  items.push(
    { title: "Beranda", description: "Halaman utama RS Mentari", path: "/", type: "page", tags: ["home", "beranda"] },
    { title: "Dokter", description: "Daftar dokter profesional", path: "/menu/Dokter", type: "page", tags: ["dokter", "jadwal", "spesialis"] },
    { title: "Fasilitas", description: "Fasilitas & sarana di RS Mentari", path: "/menu/Fasilitas", type: "page", tags: ["fasilitas", "ruangan"] },
    { title: "Layanan", description: "Layanan dan klinik di RS Mentari", path: "/menu/layanan", type: "page", tags: ["layanan", "klinik"] },
    { title: "Health Care", description: "Daftar spesialisasi & layanan medis", path: "/healthcare", type: "page", tags: ["spesialis", "healthcare"] },
    { title: "IVF (Bayi Tabung)", description: "Klinik Bayi Tabung & Gangguan Kesuburan", path: "/menu/layanan/ivf", type: "page", tags: ["ivf", "kesuburan", "morulla"] },
    { title: "Trauma Center", description: "Kegawatdaruratan & Rehabilitasi", path: "/menu/layanan/trauma-center", type: "page", tags: ["trauma", "igd", "rehabilitasi"] },
  );

  // Specialization detail pages
  specializations.forEach((s) => {
    items.push({
      title: s.title,
      description: s.desc,
      path: `/healthcare/${toSlug(s.title)}`,
      type: "specialization",
      tags: ["spesialis", "layanan", "klinik"],
    });
  });

  // Doctors (link ke halaman dokter)
  doctors.forEach((d) => {
    items.push({
      title: d.name,
      description: d.summary,
      path: "/menu/Dokter",
      type: "doctor",
      tags: ["dokter", "spesialis"],
    });
  });

  return items;
};

export const searchAll = (q: string): SearchItem[] => {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const idx = buildSearchIndex();
  return idx.filter((it) => {
    const hay = [it.title, it.description || "", ...(it.tags || [])].join(" ").toLowerCase();
    return hay.includes(query);
  });
};
