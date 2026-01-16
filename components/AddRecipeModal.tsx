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
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<NewRecipeInput>({
    title: '',
    url: '',
    category: Category.Breakfast,
    ingredients: [''],
    instructions: [''],
    thumbnail: ''
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setThumbnailPreview(base64);
        setFormData(prev => ({ ...prev, thumbnail: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleListChange = (field: 'ingredients' | 'instructions', index: number, value: string) => {
    const newList = [...(formData[field] || [])];
    newList[index] = value;
    setFormData({ ...formData, [field]: newList });
  };

  const addListItem = (field: 'ingredients' | 'instructions') => {
    setFormData({ ...formData, [field]: [...(formData[field] || []), ''] });
  };

  const removeListItem = (field: 'ingredients' | 'instructions', index: number) => {
    const newList = (formData[field] || []).filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newList.length ? newList : [''] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#3f4238]/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#f4f1ea] w-full max-w-2xl max-h-[90vh] flex flex-col rounded-sm shadow-2xl border border-[#e5e1d8] animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center p-6 border-b border-[#e5e1d8] bg-white/50 shrink-0">
          <h2 className="serif text-3xl text-[#3f4238]">{t.newRecipe}</h2>
          <button onClick={onClose} className="p-2 text-[#a5a58d] hover:text-[#3f4238] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#a5a58d] mb-2">{t.recipeTitle}</label>
                <input 
                  required
                  type="text" 
                  placeholder={t.placeholderTitle}
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white border border-[#e5e1d8] p-3 text-sm rounded-sm focus:outline-none focus:border-[#a5a58d] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#a5a58d] mb-2">{t.category}</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as Category})}
                  className="w-full bg-white border border-[#e5e1d8] p-3 text-sm rounded-sm focus:outline-none focus:border-[#a5a58d] transition-colors appearance-none"
                >
                  {Object.values(Category).map(cat => (
                    <option key={cat} value={cat}>{t[cat]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#a5a58d] mb-2">{t.sourceUrl}</label>
                <input 
                  type="url" 
                  placeholder="https://..."
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  className="w-full bg-white border border-[#e5e1d8] p-3 text-sm rounded-sm focus:outline-none focus:border-[#a5a58d] transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#e5e1d8] rounded-sm p-4 bg-white/30 group hover:border-[#a5a58d] transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*"
              />
              {thumbnailPreview ? (
                <div className="relative w-full aspect-square">
                  <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover rounded-sm" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-[10px] uppercase font-bold tracking-widest">{t.changePhoto}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#a5a58d] mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#a5a58d]">{t.uploadPhoto}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#a5a58d] mb-3 flex justify-between items-center border-b border-[#e5e1d8] pb-1">
                <span>{t.ingredients}</span>
                <button type="button" onClick={() => addListItem('ingredients')} className="text-[9px] bg-[#3f4238] text-white px-2 py-0.5 rounded-sm hover:bg-[#525547]">{t.add}</button>
              </label>
              <div className="space-y-2">
                {formData.ingredients.map((ing, i) => (
                  <div key={i} className="flex gap-2">
                    <input 
                      type="text" 
                      value={ing}
                      onChange={(e) => handleListChange('ingredients', i, e.target.value)}
                      className="flex-1 bg-white border border-[#e5e1d8] p-2 text-sm rounded-sm focus:border-[#a5a58d] outline-none"
                      placeholder={t.placeholderIng}
                    />
                    <button type="button" onClick={() => removeListItem('ingredients', i)} className="text-red-300 hover:text-red-500 p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#a5a58d] mb-3 flex justify-between items-center border-b border-[#e5e1d8] pb-1">
                <span>{t.instructions}</span>
                <button type="button" onClick={() => addListItem('instructions')} className="text-[9px] bg-[#3f4238] text-white px-2 py-0.5 rounded-sm hover:bg-[#525547]">{t.add}</button>
              </label>
              <div className="space-y-2">
                {formData.instructions.map((step, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="serif text-[#a5a58d] mt-2 w-4 text-sm">{i + 1}</span>
                    <textarea 
                      value={step}
                      onChange={(e) => handleListChange('instructions', i, e.target.value)}
                      className="flex-1 bg-white border border-[#e5e1d8] p-2 text-sm rounded-sm min-h-[60px] focus:border-[#a5a58d] outline-none"
                      placeholder={t.placeholderStep}
                    />
                    <button type="button" onClick={() => removeListItem('instructions', i)} className="text-red-300 hover:text-red-500 p-1 mt-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>

        <div className="p-6 bg-white border-t border-[#e5e1d8] shrink-0">
          <button 
            onClick={handleSubmit}
            className="w-full py-4 px-6 bg-[#3f4238] text-[#f4f1ea] uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-[#525547] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
          >
            {t.addToCollection}
          </button>
        </div>
      </div>
    </div>
  );
};