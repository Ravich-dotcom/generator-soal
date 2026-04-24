/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { Document, Packer, Paragraph, HeadingLevel } from 'docx';
import { GRADES, SUBJECTS, QUESTION_TYPES, QuestionRequest } from './constants';
import { generateQuestions } from './services/aiService';

export default function App() {
  const [formData, setFormData] = useState<QuestionRequest>({
    grade: '',
    subject: '',
    semester: 'Ganjil',
    madrasahName: '',
    materialTitle: '',
    questionType: 'Pilihan Ganda',
    cognitiveLevel: 'C4',
    numberOfQuestions: 10,
  });

  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>(localStorage.getItem('GEMINI_API_KEY') || '');

  const handleGenerate = async () => {
    if (!apiKey) {
        setError("API Key diperlukan.");
        return;
    }
    setLoading(true);
    setError(null);
    try {
      const generatedResult = await generateQuestions(formData, apiKey);
      setResult(generatedResult);
      localStorage.setItem('GEMINI_API_KEY', apiKey);
    } catch (e) {
      console.error(e);
      setError("Terjadi kesalahan. Pastikan API Key benar. Mencoba lagi dalam 5 detik...");
      setTimeout(handleGenerate, 5000);
    } finally {
      setLoading(false);
    }
  };

  const downloadWord = async () => {
    if (!result) return;
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({ text: "HASIL GENERASI SOAL", heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: result }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Soal_${formData.materialTitle || 'Hasil'}.docx`;
    link.click();
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-emerald-100 shadow-sm z-10">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">G</div>
                <div>
                    <h1 className="text-lg font-bold text-emerald-900 leading-tight">Generator Soal</h1>
                    <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">Asisten Perangkat Ajar Modern</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[11px] font-medium text-emerald-700">AI Status: Terhubung</span>
                </div>
                <button onClick={downloadWord} disabled={!result} className="px-4 py-1.5 bg-emerald-600 text-white text-sm font-semibold rounded-md hover:bg-emerald-700 disabled:bg-gray-400">Download .docx</button>
            </div>
        </header>
        
        <main className="flex flex-1 overflow-hidden">
            <aside className="w-[360px] bg-white border-r border-slate-200 overflow-y-auto p-5 custom-scrollbar">
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
                    <section>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Konfigurasi API</h3>
                      <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-600">Gemini API Key</label>
                          <input type="password" className="w-full text-sm border border-slate-200 rounded p-2 bg-slate-50" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Masukkan API Key..." />
                      </div>
                    </section>

                    <section>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Identitas & Kurikulum</h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-slate-600">Kelas</label>
                                <select className="w-full text-sm border border-slate-200 rounded p-2 bg-slate-50 focus:border-emerald-500 outline-none" value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})}>
                                    <option value="">Pilih</option>
                                    {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-slate-600">Semester</label>
                                <select className="w-full text-sm border border-slate-200 rounded p-2 bg-slate-50" value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})}>
                                    <option value="Ganjil">Ganjil</option>
                                    <option value="Genap">Genap</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-600">Mata Pelajaran</label>
                            <select className="w-full text-sm border border-slate-200 rounded p-2 bg-slate-50" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}>
                                <option value="">Pilih Mapel</option>
                                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-600">Nama Madrasah</label>
                            <input type="text" className="w-full text-sm border border-slate-200 rounded p-2 bg-slate-50" value={formData.madrasahName} onChange={e => setFormData({...formData, madrasahName: e.target.value})} placeholder="MIS Darul Ulum..." />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-600">Judul Materi</label>
                            <input type="text" className="w-full text-sm border border-slate-200 rounded p-2 bg-slate-50" value={formData.materialTitle} onChange={e => setFormData({...formData, materialTitle: e.target.value})} placeholder="Hukum Newton..." />
                        </div>
                      </div>
                    </section>
                    
                    <section>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 mt-2">Konfigurasi Soal</h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-slate-600">Bentuk Soal</label>
                              <select className="w-full text-sm border border-slate-200 rounded p-2 bg-slate-50" value={formData.questionType} onChange={e => setFormData({...formData, questionType: e.target.value})}>
                                  {QUESTION_TYPES.map(qt => <option key={qt} value={qt}>{qt}</option>)}
                              </select>
                          </div>
                          <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-slate-600">Level Kognitif</label>
                              <select className="w-full text-sm border border-slate-200 rounded p-2 bg-slate-50" value={formData.cognitiveLevel} onChange={e => setFormData({...formData, cognitiveLevel: e.target.value})}>
                                  <option value="C4">C4</option>
                                  <option value="C5">C5</option>
                                  <option value="C6">C6</option>
                              </select>
                          </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-600">Jumlah Soal</label>
                            <input type="number" className="w-full text-sm border border-slate-200 rounded p-2 bg-slate-50" value={formData.numberOfQuestions} onChange={e => setFormData({...formData, numberOfQuestions: parseInt(e.target.value)})} />
                        </div>
                      </div>
                    </section>
                    
                    <button type="submit" disabled={loading} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 mt-4 disabled:bg-gray-400">
                        {loading ? "Menghasilkan..." : "GENERATE PERANGKAT AJAR"}
                    </button>
                    {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                </form>
            </aside>
            
            <section className="flex-1 bg-slate-100 p-6 flex flex-col gap-4 overflow-hidden">
              <div className="flex gap-2">
                <button className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded shadow-sm">PRATINJAU KISI-KISI</button>
                <button className="px-4 py-1.5 bg-white text-slate-500 text-xs font-bold rounded border border-slate-200">PRATINJAU SOAL</button>
              </div>

              <div className="flex-1 bg-white border border-slate-200 shadow-sm rounded-lg p-8 overflow-y-auto custom-scrollbar">
                {result ? (
                    <div className="w-full mx-auto max-w-3xl space-y-6 prose text-gray-800">
                        <pre className="whitespace-pre-wrap font-sans text-sm">{result}</pre>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                        {loading ? "Sedang memproses AI..." : "Hasil akan muncul di sini setelah generate."}
                    </div>
                )}
              </div>
            </section>
        </main>
    </div>
  );
}
