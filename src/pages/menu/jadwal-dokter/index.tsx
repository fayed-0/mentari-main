import React, { useMemo, useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

interface CalendarProps {
	value: Date | null;
	onChange: (d: Date) => void;
	availableWeekdays?: number[]; 
	isPracticing: (date: Date) => boolean;
	maxDate: Date;
}

const monthNames = [
	"Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"
];
const weekdayShort = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]; 

function startOfMonth(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), 1);
}
function addDays(date: Date, days: number) {
	const d = new Date(date);
	d.setDate(d.getDate() + days);
	return d;
}

const Calendar: React.FC<CalendarProps> = ({ value, onChange, availableWeekdays = [1,3,5], isPracticing, maxDate }) => {
  const [cursor, setCursor] = useState<Date>(value || new Date());
  const first = startOfMonth(cursor);
  const firstWeekday = first.getDay(); 
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth()+1, 0).getDate();
  const today = new Date();

  const cells: (Date | null)[] = [];
  for (let i=0;i<firstWeekday;i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));

  const isSameDay = (a: Date, b: Date) => a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const goMonth = (delta: number) => {
    const next = new Date(cursor.getFullYear(), cursor.getMonth()+delta, 1);
    if (next > maxDate) return;
    setCursor(next);
  };

	const prevMonthLastDay = new Date(cursor.getFullYear(), cursor.getMonth(), 0); 
	const canGoPrev = prevMonthLastDay >= startOfToday; 
	const nextMonthFirstDay = new Date(cursor.getFullYear(), cursor.getMonth()+1, 1);
	const canGoNext = nextMonthFirstDay <= maxDate; 

	return (
    <div className="w-full bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
			<div className="flex items-center justify-between mb-6">
				<button aria-label="Prev month" onClick={() => canGoPrev && goMonth(-1)} className="p-2 rounded hover:bg-zinc-100 disabled:opacity-30" disabled={!canGoPrev}>‹</button>
				<div className="font-semibold text-lg text-neutral-800">{monthNames[cursor.getMonth()]} {cursor.getFullYear()}</div>
				<button aria-label="Next month" onClick={() => canGoNext && goMonth(1)} className="p-2 rounded hover:bg-zinc-100 disabled:opacity-30" disabled={!canGoNext}>›</button>
			</div>
			<div className="grid grid-cols-7 text-center text-xs font-medium text-neutral-500 mb-2">
				{weekdayShort.map(h=> <div key={h}>{h}</div>)}
			</div>
      <div className="grid grid-cols-7 gap-1 mb-5">
        {cells.map((d,i)=>{
          if(!d) return <div key={i} className="h-10"/>;
          const disabledBase = d < startOfToday || d > maxDate;
          const practice = isPracticing(d);
          const disabled = disabledBase || !practice;
          const selected = value && isSameDay(d,value);
          return (
            <button
              key={i}
              disabled={disabled}
              onClick={()=> onChange(d)}
              className={"h-10 text-sm font-medium rounded-md p-5 flex items-center justify-center transition border " +
                (selected ? "bg-orange-500 text-white border-orange-500" : disabled ? "text-neutral-300 border-transparent" : practice ? "text-neutral-700 hover:bg-orange-100 border-transparent" : "text-neutral-300 border-transparent")}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-6 text-xs">
        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"/> <span>Praktek</span></div>
        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-neutral-400 inline-block"/> <span>Tidak Praktek</span></div>
      </div>
    </div>
  );
};

interface DoctorSchedule {
	name: string;
	specialization: string;
	photo?: string;
	operatingDays: number[]; 
	description?: string;
	slots: {
		[dateKey: string]: SlotStatus[];
	};
	weekdayTemplate: { [weekday: number]: SlotStatus[] }; 
}

export interface SlotStatus {
	start: string; 
	end: string;   
	booked?: boolean;
}

function formatDateKey(d: Date) {
	return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

const mockDoctor: DoctorSchedule = {
	name: "dr. Budi Sutomo, Sp.N",
	specialization: "Spesialis Neurologi",
	photo: "https://placehold.co/400x520",
	operatingDays: [1,3,5], 
	description: "Dokter spesialis neurologi berpengalaman dalam penanganan gangguan saraf.",
	weekdayTemplate: {
		1: [ { start: "08:00", end: "09:00" }, { start: "09:30", end: "10:30" }, { start: "15:00", end: "16:00" } ],
		3: [ { start: "08:00", end: "09:00", booked: true }, { start: "10:00", end: "11:00" } ],
		5: [ { start: "13:00", end: "14:00" }, { start: "15:00", end: "16:00" } ],
	},
	slots: {
		// Example specific date override
		// '2025-09-27': [ {start:'15:00', end:'16:00'} ]
	}
};

const weekdayNamesFull = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

export default function JadwalDokterAppointment() {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedSlot, setSelectedSlot] = useState<SlotStatus | null>(null);

	const maxDate = useMemo(()=>{
		const d = new Date();
		d.setDate(d.getDate()+14); 
		return d;
	},[]);

	const isPracticing = (d: Date) => mockDoctor.operatingDays.includes(d.getDay());

	const slotsForDate = useMemo(()=>{
		if(!selectedDate) return [] as SlotStatus[];
		const key = formatDateKey(selectedDate);
		if (mockDoctor.slots[key]) return mockDoctor.slots[key];
		return mockDoctor.weekdayTemplate[selectedDate.getDay()] || [];
	}, [selectedDate]);

	const canSelectSlot = (slot: SlotStatus) => {
		if(slot.booked) return false;
		if(!selectedDate) return false;
		// rule: sampai 1 jam sebelum jadwal berakhir
		const endDateTime = new Date(selectedDate);
		const [eh, em] = slot.end.split(":").map(Number);
		endDateTime.setHours(eh, em, 0, 0);
		const limit = new Date(endDateTime.getTime() - 60*60*1000); // 1 hour before end
		return new Date() < limit;
	};

	return (
		<div className="bg-stone-50 min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1 pt-24 pb-24 px-4 sm:px-6 md:px-16">
				<div className="max-w-[1272px] mx-auto">
					<div className="flex flex-col lg:flex-row gap-10">
						{/* Doctor profile */}
						<div className="w-full lg:w-[480px] flex flex-col gap-6">
							<div className="w-full aspect-[4/5] rounded-md overflow-hidden border border-zinc-300 bg-white">
								<img src={mockDoctor.photo} alt={mockDoctor.name} className="w-full h-full object-cover" />
							</div>
							<div className="bg-white border border-zinc-300 rounded-md p-5">
								<h1 className="text-2xl font-semibold mb-1">{mockDoctor.name}</h1>
								<p className="text-orange-500 font-medium mb-3">{mockDoctor.specialization}</p>
								<p className="text-sm text-neutral-600 leading-relaxed">{mockDoctor.description}</p>
							</div>
						</div>

						{/* calendar & slots */}
						<div className="flex-1 flex flex-col gap-8">
							<div className="space-y-6">
								<h2 className="text-lg font-semibold text-orange-500">Pilih Tanggal</h2>
								<Calendar
									value={selectedDate}
									onChange={(d) => { setSelectedDate(d); setSelectedSlot(null); }}
									availableWeekdays={mockDoctor.operatingDays}
									isPracticing={isPracticing}
									maxDate={maxDate}
								/>
							</div>

							<div className="space-y-4">
								<h3 className="text-base font-semibold text-orange-500">Pilih Jam</h3>
								<div className="bg-white rounded-xl border border-zinc-200 p-5 min-h-[140px] flex flex-wrap gap-3">
									{selectedDate ? (
										slotsForDate.length>0 ? (
											slotsForDate.map((slot, idx) => {
												const selectable = canSelectSlot(slot);
												const active = selectedSlot === slot;
												return (
													<button
														key={idx}
														onClick={()=> selectable && setSelectedSlot(slot)}
														className={"px-4 py-3 rounded-md border text-sm font-medium transition " +
															(active ? "border-orange-500 text-orange-500 bg-orange-50" : selectable ? "border-zinc-300 hover:border-orange-500" : "border-zinc-200 bg-zinc-100 text-zinc-400 cursor-not-allowed")}
													>
														{slot.start} - {slot.end}
													</button>
												);
											})
										) : (
											<span className="text-sm text-neutral-400">Tidak ada slot praktik di hari ini.</span>
										)
									) : (
										<span className="text-sm text-neutral-400">Pilih tanggal terlebih dahulu.</span>
									)}
								</div>
								{selectedSlot && selectedDate && (
									<div className="flex items-center justify-between bg-orange-50 border border-orange-500 rounded-md px-4 py-3 text-sm">
										<span>Janji pada <strong>{selectedDate.getDate()} {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</strong> pukul <strong>{selectedSlot.start}-{selectedSlot.end}</strong></span>
										<button className="px-4 py-2 rounded bg-orange-500 text-white text-xs font-semibold hover:bg-orange-500">Konfirmasi</button>
									</div>
								)}
								<p className="text-sm text-neutral-600 leading-relaxed">Jadwal Janji Temu Dokter dapat dipilih hingga <strong>14 hari</strong> ke depan dan paling lambat <strong>1 jam</strong> sebelum jadwal dokter berakhir.</p>
							</div>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}

