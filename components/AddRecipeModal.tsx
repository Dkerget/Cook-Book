import React, { useState, useRef } from 'react';
import { Category, NewRecipeInput } from '../types';
import { translations } from '../App';

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
    if (formData.title) onAdd(formData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#3f4238]/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#f4f1ea] w-full max-w-2xl max-h-[90vh] flex flex-col rounded-sm shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-[#e5e1d8] flex justify-between items-center bg-white">
          <h2 className="serif text-3xl text-[#3f4238]">{t.newRecipe}</h2>
          <button onClick={onClose} className="text-[#a5a58d]">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input required placeholder={t.placeholderTitle} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 text-sm border border-[#e5e1d8]" />
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})} className="w-full p-3 text-sm border border-[#e5e1d8]">
                {Object.values(Category).map(c => <option key={c} value={c}>{t[c]}</option>)}
              </select>
              <input type="url" placeholder={t.sourceUrl} value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full p-3 text-sm border border-[#e5e1d8]" />
            </div>
            <div className="border-2 border-dashed border-[#e5e1d8] flex items-center justify-center p-4 cursor-pointer min-h-[150px]" onClick={() => fileInputRef.current?.click()}>
              {formData.thumbnail ? <img src={formData.thumbnail} className="max-h-full object-contain" /> : <span className="text-[10px] font-bold text-[#a5a58d] uppercase">{t.uploadPhoto}</span>}
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
          <div className="space-y-4">
            <div className="font-bold text-[10px] text-[#a5a58d] uppercase border-b pb-1 flex justify-between">
              {t.ingredients}
              <button type="button" onClick={() => setFormData({...formData, ingredients: [...formData.ingredients, '']})}>{t.add}</button>
            </div>
            {formData.ingredients.map((ing, i) => (
              <input key={i} value={ing} placeholder={t.placeholderIng} onChange={e => {
                const n = [...formData.ingredients]; n[i] = e.target.value; setFormData({...formData, ingredients: n});
              }} className="w-full p-2 text-sm border border-[#e5e1d8]" />
            ))}
            <div className="font-bold text-[10px] text-[#a5a58d] uppercase border-b pb-1 flex justify-between">
              {t.instructions}
              <button type="button" onClick={() => setFormData({...formData, instructions: [...formData.instructions, '']})}>{t.add}</button>
            </div>
            {formData.instructions.map((step, i) => (
              <textarea key={i} value={step} placeholder={t.placeholderStep} onChange={e => {
                const n = [...formData.instructions]; n[i] = e.target.value; setFormData({...formData, instructions: n});
              }} className="w-full p-2 text-sm border border-[#e5e1d8]" />
            ))}
          </div>
        </form>
        <div className="p-6 bg-white border-t">
          <button onClick={handleSubmit} className="w-full py-4 bg-[#3f4238] text-white text-[10px] font-bold uppercase tracking-widest">{t.addToCollection}</button>
        </div>
      </div>
    </div>
  );
};