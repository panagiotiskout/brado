export const GYM = {
  name: "Brado Training Center",
  address: "Akti Themistokleous 44, Piraeus 18537, Greece",
  addressShort: "Akti Themistokleous 44, Piraeus",
  mobile: "6980265034",
  mobileDisplay: "6980 265 034",
  landline: "2104284650",
  landlineDisplay: "210 428 4650",
  instagram: "https://www.instagram.com/brado.training/",
  instagramHandle: "@brado.training",
  mapsQuery: "Akti Themistokleous 44, Piraeus 18537, Greece",
  timezone: "Europe/Athens",
  maxCapacity: 8,
  sessionMinutes: 60,
  slotIntervalMinutes: 30,
  cancelCutoffHours: 2,
} as const;

/* Geocoded from OpenStreetMap: 44 Akti Themistokleous, Freattyda. */
export const GYM_COORDS = {
  lat: 37.9309483,
  lng: 23.6460246,
  display: "37°55′51″N 23°38′46″E",
} as const;

export type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export const WEEKLY_HOURS: Record<
  DayKey,
  { open: string | null; close: string | null }
> = {
  monday: { open: "08:00", close: "23:00" },
  tuesday: { open: "08:00", close: "23:00" },
  wednesday: { open: "08:00", close: "23:00" },
  thursday: { open: "08:00", close: "23:00" },
  friday: { open: "08:00", close: "23:00" },
  saturday: { open: "09:00", close: "18:00" },
  sunday: { open: null, close: null },
};
