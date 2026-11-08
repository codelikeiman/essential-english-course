/**
 * PLACEHOLDER TEACHERS — names, credentials and photos below are samples.
 * Replace them with your real teachers before launch, then set
 * `placeholder: false` on each real entry (that removes the "Contoh" tag).
 *
 * Each teacher's quote and "teaches" line live in
 * messages/{id,en}.json → teachers.people.<id>.
 */

export type TeacherId = "sari" | "daniel" | "rina" | "yosef" | "tika";

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
    id: "sari",
    name: "Miss Sari",
    credentials: ["TESOL", "S.Pd. Bahasa Inggris"],
    image: { src: "/images/teacher-sari.jpg", width: 800, height: 1000 },
    placeholder: true,
  },
  {
    id: "daniel",
    name: "Mr. Daniel",
    credentials: ["IELTS 7.5", "TOEFL ITP 610"],
    image: { src: "/images/teacher-daniel.jpg", width: 800, height: 1000 },
    placeholder: true,
  },
  {
    id: "rina",
    name: "Miss Rina",
    credentials: ["CELTA"],
    image: { src: "/images/teacher-rina.jpg", width: 800, height: 1000 },
    placeholder: true,
  },
  {
    id: "yosef",
    name: "Mr. Yosef",
    credentials: ["TOEFL ITP 600", "TESOL"],
    image: { src: "/images/teacher-yosef.jpg", width: 800, height: 1000 },
    placeholder: true,
  },
  {
    id: "tika",
    name: "Miss Tika",
    credentials: ["TKT", "S.Pd. Bahasa Inggris"],
    image: { src: "/images/teacher-tika.jpg", width: 800, height: 1000 },
    placeholder: true,
  },
];
