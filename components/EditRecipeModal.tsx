import React, { useState } from 'react';
import { Category, Recipe } from '../types.ts';
import { translations } from '../constants.ts';

interface EditRecipeModalProps {
  recipe: Recipe;
  lang: 'en' | 'ru';
  onClose: () => void;
  onSave: (updatedRecipe: Recipe) => void;
}

export const EditRecipeModal: React.FC<EditRecipeModalProps> = ({ recipe, lang, onClose, onSave }) => {
  const t = translations[lang];
  const [formData, setFormData] = useState<Recipe>({ ...recipe });

  const handleSubmit = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    onSave({
      ...formData,
      ingredients: formData.ingredients.filter(i => i.trim()),
      instructions: formData.instructions.filter(i => i.trim())
    });
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
    <div className="fixed inset-0 z-[70] flex items-start md:items-center justify-center p-4 bg-[#3f4238]/80 backdrop-blur-md overflow-hidden">
      <div className="bg-[#f4f1ea] w-full max-w-3xl h-auto max-h-[95dvh] flex flex-col rounded-sm shadow-2xl border border-[#e5e1d8] animate-in fade-in zoom-in duration-300">
        
        <div className="flex justify-between items-center p-6 md:p-8 border-b border-[#e5e1d8] bg-white shrink-0">
          <h2 className="serif text-3xl text-[#3f4238]">{t.editRecipe}</h2>
          <button 
            onClick={onClose} 
            className="p-2 text-[#a5a58d] hover:text-[#3f4238] transition-colors rounded-full hover:bg-[#f4f1ea]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#a5a58d] mb-2">{t.recipeTitle}</label>
              <input 
                required
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-white border border-[#e5e1d8] p-4 text-sm focus:outline-none focus:border-[#a5a58d] transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#a5a58d] mb-2">{t.category}</label>
              <div className="relative">
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as Category})}
                  className="w-full bg-white border border-[#e5e1d8] p-4 text-sm focus:outline-none focus:border-[#a5a58d] appearance-none"
                >
                  {Object.values(Category).map(cat => (
                    <option key={cat} value={cat}>{t[cat]}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#a5a58d]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#a5a58d] mb-5 flex justify-between items-center border-b border-[#e5e1d8] pb-2">
              <span>{t.ingredients}</span>
              <button 
                type="button" 
                onClick={() => addListItem('ingredients')} 
                className="text-[9px] bg-[#3f4238] text-white px-4 py-1.5 rounded-sm hover:bg-[#525547] transition-all shadow-sm"
              >
                {t.add}
              </button>
            </label>
            <div className="space-y-3">
              {formData.ingredients.map((ing, i) => (
                <div key={i} className="flex gap-3 items-center group">
                  <input 
                    type="text" 
                    value={ing}
                    onChange={(e) => handleListChange('ingredients', i, e.target.value)}
                    className="flex-1 bg-white border border-[#e5e1d8] p-3 text-sm focus:border-[#a5a58d] outline-none transition-all"
                  />
                  <button 
                    type="button" 
                    onClick={() => removeListItem('ingredients', i)} 
                    className="text-red-300 hover:text-red-500 transition-colors p-2 opacity-0 group-hover:opacity-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#a5a58d] mb-5 flex justify-between items-center border-b border-[#e5e1d8] pb-2">
              <span>{t.instructions}</span>
              <button 
                type="button" 
                onClick={() => addListItem('instructions')} 
                className="text-[9px] bg-[#3f4238] text-white px-4 py-1.5 rounded-sm hover:bg-[#525547] transition-all shadow-sm"
              >
                {t.add}
              </button>
            </label>
            <div className="space-y-6">
              {formData.instructions.map((step, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <span className="serif text-xl text-[#a5a58d] pt-3 w-6 shrink-0 italic opacity-50">{i + 1}</span>
                  <textarea 
                    value={step}
                    onChange={(e) => handleListChange('instructions', i, e.target.value)}
                    className="flex-1 bg-white border border-[#e5e1d8] p-4 text-sm min-h-[100px] focus:border-[#a5a58d] outline-none transition-all"
                  />
                  <button 
                    type="button" 
                    onClick={() => removeListItem('instructions', i)} 
                    className="text-red-300 hover:text-red-500 transition-colors p-2 mt-2 opacity-0 group-hover:opacity-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        <div className="p-8 bg-white border-t border-[#e5e1d8] shrink-0 shadow-inner">
          <button 
            type="button"
            onClick={handleSubmit}
            className="w-full py-5 px-8 bg-[#3f4238] text-[#f4f1ea] uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-[#525547] transition-all shadow-xl active:scale-[0.98]"
          >
            {t.saveRecipe}
          </button>
        </div>
      </div>
    </div>
  );
};
