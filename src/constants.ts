export interface QuestionRequest {
  grade: string;
  subject: string;
  semester: string;
  madrasahName: string;
  materialTitle: string;
  questionType: string;
  cognitiveLevel: string;
  numberOfQuestions: number;
}

export const SUBJECTS: string[] = [
  // Mata Pelajaran Wajib Umum
  "Pendidikan Pancasila",
  "Bahasa Indonesia",
  "Matematika",
  "Ilmu Pengetahuan Alam dan Sosial (IPAS)",
  "Ilmu Pengetahuan Alam (IPA)",
  "Ilmu Pengetahuan Sosial (IPS)",
  "Bahasa Inggris",
  "Informatika",
  "Seni Budaya",
  "PJOK",
  // Mata Pelajaran Wajib Keagamaan (Kemenag)
  "Al-Qur'an Hadis",
  "Akidah Akhlak",
  "Fikih",
  "Sejarah Kebudayaan Islam (SKI)",
  "Bahasa Arab",
  // Mata Pelajaran Pilihan
  "Biologi",
  "Fisika",
  "Kimia",
  "Ekonomi",
  "Geografi",
  "Sosiologi",
  "Antropologi",
  "Bahasa Jepang",
  "Bahasa Mandarin",
  "Bahasa Prancis",
  "Prakarya (Budidaya)",
  "Prakarya (Kerajinan)",
  "Prakarya (Rekayasa)",
  "Prakarya (Pengolahan)"
];

export const QUESTION_TYPES: string[] = [
    "Pilihan Ganda",
    "Pilihan Ganda Kompleks",
    "Isian Singkat",
    "Benar-Salah",
    "Uraian"
];

export const GRADES: string[] = [
  "SD/MI Kelas 1", "SD/MI Kelas 2", "SD/MI Kelas 3", "SD/MI Kelas 4", "SD/MI Kelas 5", "SD/MI Kelas 6",
  "SMP/MTs Kelas 7", "SMP/MTs Kelas 8", "SMP/MTs Kelas 9",
  "SMA/MA Kelas 10", "SMA/MA Kelas 11", "SMA/MA Kelas 12"
];
