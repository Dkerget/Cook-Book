
import React from 'react';
import { Recipe } from '../types';
import { translations } from '../App';

interface RecipeDetailProps {
  recipe: Recipe;
  lang: 'en' | 'ru';
  onClose: () => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, lang, onClose, onEdit, onDelete }) => {
  const t = translations[lang];

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(recipe.url);
      alert(t.copied);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleDelete = () => {
    onDelete(recipe.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-2 md:p-6 bg-[#f4f1ea]/95 backdrop-blur-md overflow-y-auto">
      <div className="bg-white w-full max-w-5xl h-auto md:max-h-[92dvh] shadow-2xl relative rounded-sm flex flex-col md:flex-row overflow-hidden border border-[#e5e1d8] animate-in fade-in zoom-in duration-300">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur-md rounded-full hover:bg-white shadow-md transition-all active:scale-90"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3f4238]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden bg-[#f4f1ea] shrink-0">
          <img 
            src={recipe.thumbnail} 
            alt={recipe.title} 
            className="w-full h-full object-cover grayscale-[0.05] brightness-[0.98]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-10 lg:p-12 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="max-w-md mx-auto w-full">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#a5a58d] font-bold mb-3 block">
              {t[recipe.category]}
            </span>
            <h2 className="serif text-4xl md:text-5xl lg:text-6xl text-[#3f4238] mb-6 leading-tight">
              {recipe.title}
            </h2>

            <div className="flex flex-wrap gap-x-5 gap-y-3 mb-8 border-b border-[#f4f1ea] pb-6">
              <a 
                href={recipe.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] font-bold uppercase tracking-widest text-[#3f4238] hover:text-[#a5a58d] transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                <span>{t.viewSource}</span>
              </a>
              <button 
                onClick={() => onEdit(recipe)}
                className="text-[10px] font-bold uppercase tracking-widest text-[#3f4238] hover:text-[#a5a58d] transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                <span>{t.edit}</span>
              </button>
              <button 
                onClick={handleShare}
                className="text-[10px] font-bold uppercase tracking-widest text-[#3f4238] hover:text-[#a5a58d] transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                <span>{t.copyLink}</span>
              </button>
              <button 
                onClick={handleDelete}
                className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                <span>{t.delete}</span>
              </button>
            </div>

            <section className="mb-8">
              <h4 className="serif text-2xl mb-4 text-[#3f4238] font-semibold italic">{t.ingredients}</h4>
              <ul className="space-y-2.5">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#6b705c] leading-relaxed">
                    <span className="w-1 h-1 rounded-full bg-[#a5a58d] mt-2 shrink-0"></span>
                    {ing}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h4 className="serif text-2xl mb-4 text-[#3f4238] font-semibold italic">{t.instructions}</h4>
              <ol className="space-y-5 pb-10">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="flex gap-5">
                    <span className="serif text-2xl text-[#a5a58d] font-light italic leading-none shrink-0 w-6">
                      {i + 1}
                    </span>
                    <p className="text-sm text-[#6b705c] leading-relaxed">
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
