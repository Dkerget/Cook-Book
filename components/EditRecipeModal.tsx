
import React, { useState } from 'react';
import { Category, Recipe } from '../types';
import { translations } from '../App';

interface EditRecipeModalProps {
  recipe: Recipe;
  lang: 'en' | 'ru';
  onClose: () => void;
  onSave: (updatedRecipe: Recipe) => void;
}

export const EditRecipeModal: React.FC<EditRecipeModalProps> = ({ recipe, lang, onClose, onSave }) => {
  const t = translations[lang];
  const [formData, setFormData] = useState<Recipe>({ ...recipe });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleListChange = (
    field: 'ingredients' | 'instructions',
    index: number,
    value: string
  ) => {
    const newList = [...formData[field]];
    newList[index] = value;
    setFormData({ ...formData, [field]: newList });
  };

  const addListItem = (field: 'ingredients' | 'instructions') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeListItem = (field: 'ingredients' | 'instructions', index: number) => {
    const newList = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newList });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-start md:items-center justify-center p-2 bg-[#3f4238]/70 backdrop-blur-sm overflow-hidden">
      <div className="bg-[#f4f1ea] w-full max-w-2xl h-auto max-h-[96dvh] flex flex-col rounded-sm shadow-2xl border border-[#e5e1d8] animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center p-5 border-b border-[#e5e1d8] bg-white/50 shrink-0">
          <h2 className="serif text-2xl text-[#3f4238]">{t.editRecipe}</h2>
          <button 
            onClick={onClose} 
            className="p-2 text-[#a5a58d] hover:text-[#3f4238] transition-colors rounded-full hover:bg-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#a5a58d] mb-1.5">{t.recipeTitle}</label>
              <input 
                required
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-white border border-[#e5e1d8] p-2.5 text-sm rounded-sm focus:outline-none focus:border-[#a5a58d] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#a5a58d] mb-1.5">{t.category}</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as Category})}
                className="w-full bg-white border border-[#e5e1d8] p-2.5 text-sm rounded-sm focus:outline-none focus:border-[#a5a58d] transition-colors appearance-none"
              >
                {Object.values(Category).map(cat => (
                  <option key={cat} value={cat}>{t[cat]}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#a5a58d] mb-3 flex justify-between items-center border-b border-[#e5e1d8] pb-1">
              <span>{t.ingredients}</span>
              <button 
                type="button" 
                onClick={() => addListItem('ingredients')} 
                className="text-[9px] bg-[#3f4238] text-white px-3 py-1 rounded-sm hover:bg-[#525547] transition-all"
              >
                {t.add}
              </button>
            </label>
            <div className="space-y-2">
              {formData.ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input 
                    type="text" 
                    value={ing}
                    onChange={(e) => handleListChange('ingredients', i, e.target.value)}
                    className="flex-1 bg-white border border-[#e5e1d8] p-2 text-sm rounded-sm focus:border-[#a5a58d] outline-none transition-colors"
                  />
                  <button 
                    type="button" 
                    onClick={() => removeListItem('ingredients', i)} 
                    className="text-red-300 hover:text-red-500 transition-colors p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#a5a58d] mb-3 flex justify-between items-center border-b border-[#e5e1d8] pb-1">
              <span>{t.instructions}</span>
              <button 
                type="button" 
                onClick={() => addListItem('instructions')} 
                className="text-[9px] bg-[#3f4238] text-white px-3 py-1 rounded-sm hover:bg-[#525547] transition-all"
              >
                {t.add}
              </button>
            </label>
            <div className="space-y-3">
              {formData.instructions.map((step, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="serif text-lg text-[#a5a58d] pt-1 w-5 shrink-0">{i + 1}</span>
                  <textarea 
                    value={step}
                    onChange={(e) => handleListChange('instructions', i, e.target.value)}
                    className="flex-1 bg-white border border-[#e5e1d8] p-2 text-sm rounded-sm min-h-[60px] focus:border-[#a5a58d] outline-none transition-colors"
                  />
                  <button 
                    type="button" 
                    onClick={() => removeListItem('instructions', i)} 
                    className="text-red-300 hover:text-red-500 transition-colors p-1 mt-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        <div className="p-5 bg-white border-t border-[#e5e1d8] shrink-0">
          <button 
            onClick={handleSubmit}
            className="w-full py-3.5 px-6 bg-[#3f4238] text-[#f4f1ea] uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-[#525547] transition-all shadow-md active:scale-[0.98]"
          >
            {t.saveRecipe}
          </button>
        </div>
      </div>
    </div>
  );
};
