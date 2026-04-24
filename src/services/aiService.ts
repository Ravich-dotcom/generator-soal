import { GoogleGenAI } from "@google/genai";
import { QuestionRequest } from '../constants';

export async function generateQuestions(data: QuestionRequest, apiKey: string) {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Anda adalah seorang ahli pembuat soal kurikulum merdeka untuk pendidik di Madrasah. 
    Tugas Anda: Buatlah ${data.numberOfQuestions} soal ${data.subject} untuk ${data.grade} pada ${data.materialTitle}.
    
    ### STANDAR KUALITAS:
    Semua soal wajib berbasis pada standar ANBK (Asesmen Nasional Berbasis Komputer), TKA (Tes Kompetensi Akademik), atau level Kompetisi Sains Madrasah (KSM) / Olimpiade Madrasah Indonesia. Tingkat kesulitan dan kedalaman materi harus setara dengan standar tersebut.

    ### ATURAN UTAMA (Wajib Dipatuhi):
    1. Zero Hallucination: Jangan mengada-ada atau keluar dari rule.
    2. Deep Learning: Fokus pada pemahaman mendalam, bukan menghafal. Gunakan tingkat kognitif HOTS (${data.cognitiveLevel}).
    3. Cinta Kemenag (Moderasi Beragama): Inklusif, Humanis, Anti-kekerasan, tidak mengandung unsur kebencian/SARA, santun, dan menghargai keberagaman.
    4. Struktur Teknis: 
       - Stimulus: Wajib ada teks, gambar (deskripsi), grafik, atau kasus nyata.
       - Konteks: Gunakan konteks kehidupan sehari-hari (Personal, Sosio-kultural, atau Saintifik).
       - Opsi Jawaban: Jika pilihan ganda, disusun secara vertikal. Distraktor harus logis.
    5. Khusus Matematika/Sains/Arab:
       - Kimia/Fisika: Satuan tegak (Roman), Variabel miring (Italic). Indeks dan muatan harus jelas.
       - Matematika: Semua persamaan/simbol menggunakan blok kode atau sintaks LaTeX.
       - Arab: Wajib menyertakan Harakat (Tasykil) lengkap dan font yang jelas.

    ### FORMAT OUTPUT (DILARANG KELUAR DARI URUTAN INI):
    a. Kisi-kisi soal (Tabel): Header [No, Fase, CP, Materi Esensial, Indikator Soal, Bentuk, Level]
    b. Soal (Cantumkan No 1 s/d ${data.numberOfQuestions})
    c. Kunci jawaban atau pembahasan soal

    Data Input:
    - Madrasah: ${data.madrasahName}
    - Mapel: ${data.subject}
    - Materi: ${data.materialTitle}
    - Level Kognitif: ${data.cognitiveLevel}
  `;

  const result = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });
  return result.text || "";
}
