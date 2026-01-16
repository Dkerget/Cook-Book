import React from 'react';
import { Recipe } from '../types.ts';
import { translations } from '../constants.ts';

interface RecipeCardProps {
  recipe: Recipe;
  lang: 'en' | 'ru';
  onClick: (recipe: Recipe) => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, lang, onClick, onEdit, onDelete }) => {
  const t = translations[lang];

  return (
    <div 
      className="group relative bg-white border border-[#e5e1d8] rounded-sm overflow-hidden transition-all duration-500 hover:shadow-2xl cursor-pointer flex flex-col h-full"
      onClick={() => onClick(recipe)}
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <img 
          src={recipe.thumbnail} 
          alt={recipe.title} 
          className="w-full h-full object-cover grayscale-[0.1] transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[#3f4238]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      
      <div className="p-5 bg-white flex-1 flex flex-col justify-center text-center">
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#a5a58d] font-bold mb-2 block">
          {t[recipe.category]}
        </span>
        <h3 className="serif text-2xl text-[#3f4238] font-medium leading-tight px-2">
          {recipe.title}
        </h3>
      </div>

      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit(recipe);
          }}
          className="p-3 bg-white/95 backdrop-blur-md rounded-full shadow-lg hover:bg-[#3f4238] hover:text-white text-[#a5a58d] transition-all active:scale-90"
          title={t.edit}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(recipe.id);
          }}
          className="p-3 bg-white/95 backdrop-blur-md rounded-full shadow-lg hover:bg-red-500 hover:text-white text-red-300 transition-all active:scale-90"
          title={t.delete}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};