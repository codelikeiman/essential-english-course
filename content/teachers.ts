/**
 * PLACEHOLDER TEACHERS — names, credentials and photos below are samples.
 * Replace them with your real teachers before launch, then set
 * `placeholder: false` on each real entry (that removes the "Contoh" tag).
 *
 * Each teacher's quote and "teaches" line live in
 * messages/{id,en}.json → teachers.people.<id>.
 */

export type TeacherId = "tina" | "aisveriyah" | "ridhi" | "firman" | "adinda" | "raihan" | "lailan";

export type Teacher = {
  id: TeacherId;
  name: string;
  credentials: string[];
  image: { src: string; width: number; height: number };
  placeholder: boolean;
};

// TODO: real photos → /public/images/teacher-<id>.jpg, portrait 4:5, ≥ 800×1000px.
export const teachers: Teacher[] = [
  {
    id: "tina",
    name: "Sir Tina",
    credentials: ["TESOL", "S.Pd. Bahasa Inggris"],
    image: { src: "/images/teacher-sari.jpg", width: 800, height: 1000 },
    placeholder: true,
  },
  {
    id: "aisveriyah",
    name: "Miss Aisveriyah",
    credentials: ["IELTS 7.5", "TOEFL ITP 610"],
    image: { src: "/images/teacher-daniel.jpg", width: 800, height: 1000 },
    placeholder: true,
  },
  {
    id: "ridhi",
    name: "Miss Ridhi",
    credentials: ["CELTA"],
    image: { src: "/images/teacher-rina.jpg", width: 800, height: 1000 },
    placeholder: true,
  },
  {
    id: "firman",
    name: "Sir Firman",
    credentials: ["TOEFL ITP 600", "TESOL"],
    image: { src: "/images/teacher-yosef.jpg", width: 800, height: 1000 },
    placeholder: true,
  },
  {
    id: "adinda",
    name: "Miss Adinda",
    credentials: ["TKT", "S.Pd. Bahasa Inggris"],
    image: { src: "/images/teacher-tika.jpg", width: 800, height: 1000 },
    placeholder: true,
  },
  {
    id: "raihan",
    name: "Sir Raihan",
    credentials: ["TKT", "S.Pd. Bahasa Inggris"],
    image: { src: "/images/teacher-tika.jpg", width: 800, height: 1000 },
    placeholder: true,
  },
  {
    id: "lailan",
    name: "Miss Lailan",
    credentials: ["TKT", "S.Pd. Bahasa Inggris"],
    image: { src: "/images/teacher-tika.jpg", width: 800, height: 1000 },
    placeholder: true,
  },
];