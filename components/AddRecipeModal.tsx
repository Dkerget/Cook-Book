import React, { useState, useRef } from 'react';
import { Category, NewRecipeInput } from '../types.ts';
import { translations } from '../App.tsx';

interface AddRecipeModalProps {
  onClose: () => void;
  lang: 'en' | 'ru';
  onAdd: (input: NewRecipeInput) => void;
}

export const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ onClose, lang, onAdd }) => {
  const t = translations[lang];
  const [formData, setFormData] = useState<NewRecipeInput>({
    title: '', url: '', category: Category.Breakfast, ingredients: [''], instructions: [''], thumbnail: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onAdd({
        ...formData,
        ingredients: formData.ingredients.filter(i => i.trim()),
        instructions: formData.instructions.filter(i => i.trim())
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#3f4238]/60 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#f4f1ea] w-full max-w-2xl max-h-[90vh] flex flex-col rounded-sm shadow-2xl overflow-hidden border border-[#e5e1d8]">
        <div className="p-8 border-b border-[#e5e1d8] flex justify-between items-center bg-white">
          <h2 className="serif text-4xl text-[#3f4238]">{t.newRecipe}</h2>
          <button onClick={onClose} className="text-[#a5a58d] hover:text-[#3f4238] transition-colors p-2">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#a5a58d] mb-2 block">{t.recipeTitle}</label>
                <input required placeholder={t.placeholderTitle} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-4 text-sm border border-[#e5e1d8] bg-white focus:outline-none focus:border-[#a5a58d]" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#a5a58d] mb-2 block">{t.category}</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})} className="w-full p-4 text-sm border border-[#e5e1d8] bg-white focus:outline-none focus:border-[#a5a58d] appearance-none">
                  {Object.values(Category).map(c => <option key={c} value={c}>{t[c]}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#a5a58d] mb-2 block">{t.sourceUrl}</label>
                <input type="url" placeholder={t.sourceUrl} value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full p-4 text-sm border border-[#e5e1d8] bg-white focus:outline-none focus:border-[#a5a58d]" />
              </div>
            </div>
            <div className="border-2 border-dashed border-[#e5e1d8] flex flex-col items-center justify-center p-6 cursor-pointer min-h-[220px] bg-white/50 hover:bg-white transition-colors group" onClick={() => fileInputRef.current?.click()}>
              {formData.thumbnail ? (
                <img src={formData.thumbnail} className="max-h-full object-contain" alt="Preview" />
              ) : (
                <div className="text-center">
                  <svg className="w-8 h-8 text-[#a5a58d] mx-auto mb-3 opacity-40 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  <span className="text-[10px] font-bold text-[#a5a58d] uppercase tracking-[0.2em]">{t.uploadPhoto}</span>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => {
                const f = e.target.files?.[0];
                if (f) {
                  const r = new FileReader();
                  r.onloadend = () => setFormData({...formData, thumbnail: r.result as string});
                  r.readAsDataURL(f);
                }
              }} />
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <div className="font-bold text-[10px] text-[#a5a58d] uppercase tracking-[0.3em] border-b border-[#e5e1d8] pb-2 mb-4 flex justify-between items-center">
                <span>{t.ingredients}</span>
                <button type="button" onClick={() => setFormData({...formData, ingredients: [...formData.ingredients, '']})} className="text-[9px] bg-[#3f4238] text-white px-3 py-1 rounded-sm">{t.add}</button>
              </div>
              <div className="space-y-3">
                {formData.ingredients.map((ing, i) => (
                  <input key={i} value={ing} placeholder={t.placeholderIng} onChange={e => {
                    const n = [...formData.ingredients]; n[i] = e.target.value; setFormData({...formData, ingredients: n});
                  }} className="w-full p-3 text-sm border border-[#e5e1d8] bg-white focus:outline-none focus:border-[#a5a58d]" />
                ))}
              </div>
            </div>

            <div>
              <div className="font-bold text-[10px] text-[#a5a58d] uppercase tracking-[0.3em] border-b border-[#e5e1d8] pb-2 mb-4 flex justify-between items-center">
                <span>{t.instructions}</span>
                <button type="button" onClick={() => setFormData({...formData, instructions: [...formData.instructions, '']})} className="text-[9px] bg-[#3f4238] text-white px-3 py-1 rounded-sm">{t.add}</button>
              </div>
              <div className="space-y-4">
                {formData.instructions.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <span className="serif text-[#a5a58d] pt-3 w-4 shrink-0 text-sm italic">{i + 1}</span>
                    <textarea value={step} placeholder={t.placeholderStep} onChange={e => {
                      const n = [...formData.instructions]; n[i] = e.target.value; setFormData({...formData, instructions: n});
                    }} className="w-full p-3 text-sm border border-[#e5e1d8] bg-white focus:outline-none focus:border-[#a5a58d] min-h-[80px]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
        <div className="p-8 bg-white border-t border-[#e5e1d8]">
          <button onClick={handleSubmit} className="w-full py-5 bg-[#3f4238] text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-[#525547] transition-all shadow-xl active:scale-[0.98]">{t.addToCollection}</button>
        </div>
      </div>
    </div>
  );
};