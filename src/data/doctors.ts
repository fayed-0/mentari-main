import { specializations, toSlug } from "./specializations";

export type Doctor = {
  id: number;
  name: string; // e.g. "dr. Budi Sutomo, Sp.N"
  specializationId: number; // reference to specializations.id
  summary: string; // short description
  photo?: string; // URL or relative path
};

// Helper to resolve specialization title & slug inside components
export const getDoctorSpecialization = (doctor: Doctor) => {
  return specializations.find((s) => s.id === doctor.specializationId);
};

// Temporary mock images can use https://placehold.co/128x133 or local later
export const doctors: Doctor[] = [
  {
    id: 1,
    name: "dr. Budi Sutomo, Sp.N",
    specializationId: 7, // Neurologi
    summary: "Perawatan gangguan otak, saraf & tulang belakang.",
    photo: "https://placehold.co/128x133",
  },
  {
    id: 2,
    name: "dr. Santi Prameswari, Sp.A",
    specializationId: 1, // Pediatri
    summary: "Kesehatan komprehensif bayi, anak & remaja.",
    photo: "https://placehold.co/128x133",
  },
  {
    id: 3,
    name: "dr. Andi Prakoso, Sp.OT",
    specializationId: 21, // Bedah Ortopedi
    summary: "Operasi tulang & sendi minimal invasif.",
    photo: "https://placehold.co/128x133",
  },
  {
    id: 4,
    name: "dr. Rina Maharani, Sp.JP",
    specializationId: 3, // Kardiologi
    summary: "Pencegahan & terapi penyakit jantung.",
    photo: "https://placehold.co/128x133",
  },
  {
    id: 5,
    name: "dr. Fajar Nugraha, Sp.P",
    specializationId: 8, // Pulmonologi
    summary: "Gangguan paru & pernapasan kronis.",
    photo: "https://placehold.co/128x133",
  },
  {
    id: 6,
    name: "dr. Maya Lestari, Sp.PD-KEMD",
    specializationId: 10, // Endokrinologi
    summary: "Penanganan diabetes & gangguan hormonal.",
    photo: "https://placehold.co/128x133",
  },
  {
    id: 7,
    name: "dr. Dedi Wirawan, Sp.U",
    specializationId: 12, // Urologi
    summary: "Saluran kemih & reproduksi pria.",
    photo: "https://placehold.co/128x133",
  },
  {
    id: 8,
    name: "dr. Nita Kurnia, Sp.THT-KL",
    specializationId: 25, // THT
    summary: "Gangguan telinga, hidung & tenggorokan.",
    photo: "https://placehold.co/128x133",
  },
  {
    id: 9,
    name: "dr. Yudi Pratama, Sp.BS",
    specializationId: 20, // Bedah Saraf
    summary: "Tindakan bedah saraf presisi & aman.",
    photo: "https://placehold.co/128x133",
  },
  {
    id: 10,
    name: "dr. Laras Puspitasari, Sp.OG",
    specializationId: 6, // Kebidanan
    summary: "Kesehatan perempuan & kehamilan sehat.",
    photo: "https://placehold.co/128x133",
  },
];

export const searchDoctors = (q: string) => {
  const query = q.toLowerCase();
  return doctors.filter((d) => {
    const spec = getDoctorSpecialization(d);
    return [d.name, d.summary, spec?.title].some((field) => field?.toLowerCase().includes(query));
  });
};

export const getDoctorById = (id: number) => doctors.find((d) => d.id === id);
