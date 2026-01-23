import React, { useRef } from 'react';
import { Recipe } from '../types.ts';
import { translations } from '../constants.ts';

interface RecipeDetailProps {
  recipe: Recipe;
  lang: 'en' | 'ru';
  onClose: () => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
  onUpdate: (recipe: Recipe) => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, lang, onClose, onEdit, onDelete, onUpdate }) => {
  const t = translations[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(recipe.url || window.location.href);
      alert(t.copied);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleImageChange = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = { ...recipe, thumbnail: reader.result as string };
      onUpdate(updated);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 md:p-8 bg-[#efe9e0]/85 backdrop-blur-xl overflow-y-auto">
      <div className="clay-surface w-full max-w-6xl h-auto md:max-h-[90dvh] relative flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in duration-500">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-3 clay-chip hover:brightness-110 transition-all active:scale-90"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3f4238]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-full md:w-[45%] h-72 md:h-auto relative overflow-hidden shrink-0 p-6">
          <div className="clay-inset relative h-full w-full overflow-hidden">
            <img 
              src={recipe.thumbnail} 
              alt={recipe.title} 
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3f4238]/20 via-transparent to-transparent"></div>
          </div>
        </div>

        <div className="w-full md:w-[55%] p-8 md:p-14 lg:p-20 overflow-y-auto custom-scrollbar flex flex-col bg-transparent">
          <div className="max-w-xl mx-auto w-full">
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#a5a58d] font-bold mb-5 block">
              {t[recipe.category]}
            </span>
            <h2 className="serif text-5xl md:text-7xl text-[#3f4238] mb-10 leading-[1.1]">
              {recipe.title}
            </h2>

            <div className="flex flex-wrap gap-x-8 gap-y-4 mb-12 clay-inset px-6 py-4">
              {recipe.url && (
                <a 
                  href={recipe.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3f4238] hover:text-[#a5a58d] transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  <span>{t.viewSource}</span>
                </a>
              )}
              <button 
                onClick={() => onEdit(recipe)}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3f4238] hover:text-[#a5a58d] transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                <span>{t.edit}</span>
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3f4238] hover:text-[#a5a58d] transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h4l2-3h6l2 3h4v12H3V7zm9 3a4 4 0 100 8 4 4 0 000-8z" /></svg>
                <span>{t.replaceImage}</span>
              </button>
              <button 
                onClick={handleShare}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3f4238] hover:text-[#a5a58d] transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                <span>{t.copyLink}</span>
              </button>
              <button 
                onClick={() => onDelete(recipe.id)}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400 hover:text-red-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                <span>{t.delete}</span>
              </button>
              <input 
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e.target.files?.[0])}
              />
            </div>

            <section className="mb-12">
              <h4 className="serif text-3xl mb-6 text-[#3f4238] font-semibold italic tracking-wide">{t.ingredients}</h4>
              <ul className="space-y-4 clay-inset px-6 py-6">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-4 text-base text-[#6b705c] leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#a5a58d] mt-2.5 shrink-0 opacity-60"></span>
                    {ing}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-12">
              <h4 className="serif text-3xl mb-8 text-[#3f4238] font-semibold italic tracking-wide">{t.instructions}</h4>
              <ol className="space-y-8 clay-inset px-6 py-8">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="flex gap-8 group">
                    <span className="serif text-3xl text-[#a5a58d] font-light italic leading-none shrink-0 w-8 opacity-40 group-hover:opacity-100 transition-opacity">
                      {i + 1}
                    </span>
                    <p className="text-base text-[#6b705c] leading-relaxed pt-1">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
