import BabyIcon from "../components/HealthCare/source/baby.svg";
import BoneIcon from "../components/HealthCare/source/bone.svg";
import CardiologyIcon from "../components/HealthCare/source/cardiology.svg";
import DentistryIcon from "../components/HealthCare/source/dentistry.svg";
import DermatologyIcon from "../components/HealthCare/source/dermatology.svg";
import GynecologyIcon from "../components/HealthCare/source/gynecology.svg";
import EndokrinologiIcon from "../components/HealthCare/source/Endokrinologi.svg";
import GastroenterologiIcon from "../components/HealthCare/source/Gastroenterologi.svg";
import NefrologiIcon from "../components/HealthCare/source/Nefrologi.svg";
import PulmonologiIcon from "../components/HealthCare/source/Pulmonologi.svg";
import UrologiIcon from "../components/HealthCare/source/Urologi.svg";
import HematologiIcon from "../components/HealthCare/source/hematologi.svg";
import NeurologiIcon from "../components/HealthCare/source/neurologi.svg";
import OnkologiIcon from "../components/HealthCare/source/ongkologi.svg";
import ReumatologiIcon from "../components/HealthCare/source/reumatologi.svg";
import AnestesiIcon from "../components/HealthCare/source/anastesi.svg"; 
import BedahAnakIcon from "../components/HealthCare/source/bedah anak.svg";
import BedahPlastikIcon from "../components/HealthCare/source/bedah pelastik.svg"; 
import BedahOrtopediIcon from "../components/HealthCare/source/bedah ortopedi.svg"; 
import BedahSarafIcon from "../components/HealthCare/source/bedah saraf.svg"; 
import BedahUmumIcon from "../components/HealthCare/source/bedah umum.svg"; 
import GeriatriIcon from "../components/HealthCare/source/geriatri.svg"; 
import PsikiatriIcon from "../components/HealthCare/source/psikiatri.svg"; 
import PsikologiKlinisIcon from "../components/HealthCare/source/psikologi klinis.svg"; 
import RehabilitasiKlinikIcon from "../components/HealthCare/source/rehabilitas klinik.svg"; 
import ThtIcon from "../components/HealthCare/source/tht.svg";
import MataIcon from "../components/HealthCare/source/mata.svg"; 
import ImunAlergiIcon from "../components/HealthCare/source/imun&alergi.svg"; 
import GiziKlinikIcon from "../components/HealthCare/source/gizi klinik.svg";
import PatologiKlinikIcon from "../components/HealthCare/source/patologi klinik.svg";
import RadiologiIcon from "../components/HealthCare/source/radiologi.svg";
import FisioterapiIcon from "../components/HealthCare/source/fisioterapi.svg";
import FarmasiIcon from "../components/HealthCare/source/farmasi.svg"; 
import WoundCareIcon from "../components/HealthCare/source/woundcare.svg"; 
import KardiovaskularIcon from "../components/HealthCare/source/kardiovaskular.svg";
import InfeksiIcon from "../components/HealthCare/source/infeksi.svg"; 
import LaktasiIcon from "../components/HealthCare/source/laktasi.svg"; 
import PerinatologiIcon from "../components/HealthCare/source/perinatologi.svg"; 
import GinekologiOnkologiIcon from "../components/HealthCare/source/ginekologi.svg"; 
import PaliatifIcon from "../components/HealthCare/source/paliatif.svg";

export type Specialization = {
  id: number;
  title: string;
  desc: string;
  icon: any | null;
};

export const toSlug = (str: string) =>
  str
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const specializations: Specialization[] = [
  { id: 1, title: "Pediatri", desc: "Perawatan menyeluruh untuk anak, dari bayi hingga remaja.", icon: BabyIcon },
  { id: 2, title: "Ortopedi", desc: "Gangguan tulang, sendi, dan otot.", icon: BoneIcon },
  { id: 3, title: "Kardiologi", desc: "Kesehatan jantung & pembuluh darah.", icon: CardiologyIcon },
  { id: 4, title: "Kedokteran Gigi", desc: "Perawatan gigi & mulut komprehensif.", icon: DentistryIcon },
  { id: 5, title: "Dermatologi", desc: "Perawatan kulit & estetika.", icon: DermatologyIcon },
  { id: 6, title: "Kebidanan", desc: "Kesehatan wanita & reproduksi.", icon: GynecologyIcon },
  { id: 7, title: "Neurologi", desc: "Gangguan otak, saraf & tulang belakang.", icon: NeurologiIcon },
  { id: 8, title: "Pulmonologi", desc: "Penyakit paru & pernapasan.", icon: PulmonologiIcon },
  { id: 9, title: "Gastroenterologi", desc: "Saluran cerna & pencernaan.", icon: GastroenterologiIcon },
  { id: 10, title: "Endokrinologi", desc: "Hormonal & metabolik (tiroid, diabetes).", icon: EndokrinologiIcon },
  { id: 11, title: "Nefrologi", desc: "Kesehatan ginjal & metabolisme cairan.", icon: NefrologiIcon },
  { id: 12, title: "Urologi", desc: "Saluran kemih & sistem reproduksi pria.", icon: UrologiIcon },
  { id: 13, title: "Onkologi", desc: "Diagnosis & terapi kanker terpadu.", icon: OnkologiIcon },
  { id: 14, title: "Hematologi", desc: "Gangguan darah & sumsum tulang.", icon: HematologiIcon },
  { id: 15, title: "Reumatologi", desc: "Penyakit autoimun & sendi kronis.", icon: ReumatologiIcon },
  { id: 16, title: "Psikiatri", desc: "Kesehatan mental & perilaku.", icon: PsikiatriIcon },
  { id: 17, title: "Psikologi Klinis", desc: "Evaluasi & terapi psikologis.", icon: PsikologiKlinisIcon },
  { id: 18, title: "Geriatri", desc: "Perawatan kesehatan usia lanjut.", icon: GeriatriIcon },
  { id: 19, title: "Bedah Umum", desc: "Tindakan bedah dasar & elektif.", icon: BedahUmumIcon },
  { id: 20, title: "Bedah Saraf", desc: "Operasi otak & tulang belakang.", icon: BedahSarafIcon },
  { id: 21, title: "Bedah Ortopedi", desc: "Operasi tulang & muskuloskeletal.", icon: BedahOrtopediIcon },
  { id: 22, title: "Bedah Plastik", desc: "Rekonstruksi & estetika medis.", icon: BedahPlastikIcon },
  { id: 23, title: "Bedah Anak", desc: "Tindakan bedah khusus anak.", icon: BedahAnakIcon },
  { id: 24, title: "Anestesi", desc: "Manajemen nyeri & keselamatan operasi.", icon: AnestesiIcon },
  { id: 25, title: "THT", desc: "Telinga, hidung & tenggorokan.", icon: ThtIcon },
  { id: 26, title: "Mata (Oftalmologi)", desc: "Gangguan & operasi mata.", icon: MataIcon },
  { id: 27, title: "Fisioterapi", desc: "Rehabilitasi fisik & latihan fungsional.", icon: FisioterapiIcon },
  { id: 28, title: "Rehabilitasi Medik", desc: "Pemulihan pasca cedera & stroke.", icon: RehabilitasiKlinikIcon },
  { id: 29, title: "Gizi Klinik", desc: "Manajemen diet terapeutik.", icon: GiziKlinikIcon },
  { id: 30, title: "Imunologi & Alergi", desc: "Alergi & gangguan sistem imun.", icon: ImunAlergiIcon },
  { id: 31, title: "Patologi Klinik", desc: "Analisis lab untuk diagnosis.", icon: PatologiKlinikIcon },
  { id: 32, title: "Radiologi", desc: "Pencitraan diagnostik (USG, CT, X-Ray).", icon: RadiologiIcon },
  { id: 33, title: "Ginekologi Onkologi", desc: "Kanker sistem reproduksi wanita.", icon: GinekologiOnkologiIcon },
  { id: 34, title: "Perinatologi", desc: "Perawatan ibu & bayi risiko tinggi.", icon: PerinatologiIcon },
  { id: 35, title: "Laktasi", desc: "Dukungan menyusui & nutrisi bayi.", icon: LaktasiIcon },
  { id: 36, title: "Infeksi & Tropis", desc: "Penyakit menular & tropis.", icon: InfeksiIcon },
  { id: 37, title: "Farmasi Klinik", desc: "Optimasi terapi obat pasien.", icon: FarmasiIcon },
  { id: 38, title: "Kardiovaskular Intervensi", desc: "Tindakan minimal invasif jantung.", icon: KardiovaskularIcon },
  { id: 39, title: "Luka & Wound Care", desc: "Manajemen luka akut & kronis.", icon: WoundCareIcon },
  { id: 40, title: "Paliatif", desc: "Perawatan suportif & kualitas hidup.", icon: PaliatifIcon },
];

export const getSpecializationBySlug = (slug: string) =>
  specializations.find((s) => toSlug(s.title) === slug);
