export type SamplePlayer = {
  balance: string;
  id: string;
  name: string;
  sessions: number;
  status: "Aktif" | "Nonaktif";
};

export type SampleSession = {
  date: string;
  id: string;
  participants: number;
  status: "Selesai" | "Terjadwal";
  venue: string;
};

export const samplePlayers: SamplePlayer[] = [
  { id: "player-001", name: "Andi Pratama", status: "Aktif", sessions: 12, balance: "Rp 45.000" },
  { id: "player-002", name: "Budi Santoso", status: "Aktif", sessions: 9, balance: "Rp 0" },
  { id: "player-003", name: "Citra Maharani", status: "Nonaktif", sessions: 5, balance: "Rp 20.000" },
];

export const sampleSessions: SampleSession[] = [
  {
    id: "session-001",
    date: "20 Nov 2026",
    venue: "GOR Flamboyan",
    participants: 3,
    status: "Selesai",
  },
  {
    id: "session-002",
    date: "18 Nov 2026",
    venue: "GOR Flamboyan",
    participants: 3,
    status: "Selesai",
  },
  {
    id: "session-003",
    date: "25 Nov 2026",
    venue: "GOR Flamboyan",
    participants: 3,
    status: "Terjadwal",
  },
];

export const sampleTransactions = [
  {
    amount: "Rp 35.000",
    date: "20 Nov 2026",
    id: "TX-001",
    player: "Andi Pratama",
    status: "Tercatat",
    type: "Iuran sesi",
  },
  {
    amount: "Rp 35.000",
    date: "20 Nov 2026",
    id: "TX-002",
    player: "Budi Santoso",
    status: "Tercatat",
    type: "Iuran sesi",
  },
  {
    amount: "Rp 20.000",
    date: "18 Nov 2026",
    id: "TX-003",
    player: "Citra Maharani",
    status: "Tercatat",
    type: "Pembayaran",
  },
];

export const sampleExpenses = [
  { amount: "Rp 180.000", category: "Kok", date: "20 Nov 2026", id: "EXP-001" },
  { amount: "Rp 75.000", category: "Air minum", date: "18 Nov 2026", id: "EXP-002" },
];
