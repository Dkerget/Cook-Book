import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Category, Recipe, NewRecipeInput } from './types.ts';
import { RecipeCard } from './components/RecipeCard.tsx';
import { RecipeDetail } from './components/RecipeDetail.tsx';
import { AddRecipeModal } from './components/AddRecipeModal.tsx';
import { EditRecipeModal } from './components/EditRecipeModal.tsx';
import { translations, INITIAL_RECIPES } from './constants.ts';

const STORAGE_KEY = 'wellness_cookbook_data_v2';
const LANG_KEY = 'wellness_cookbook_lang';

const App: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'ru'>(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      return (saved as 'en' | 'ru') || 'en';
    } catch { return 'en'; }
  });

  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_RECIPES;
    } catch { return INITIAL_RECIPES; }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];

  useEffect(() => { localStorage.setItem(LANG_KEY, lang); }, [lang]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes)); }, [recipes]);

  const filteredRecipes = useMemo(() => {
    let result = recipes.filter(r => activeCategory === 'All' || r.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => r.title.toLowerCase().includes(q));
    }
    return result.sort((a, b) => b.createdAt - a.createdAt);
  }, [recipes, activeCategory, searchQuery]);

  const handleAddRecipe = (input: NewRecipeInput) => {
    const newRecipe: Recipe = {
      ...input,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      thumbnail: input.thumbnail || `https://picsum.photos/seed/${Date.now()}/800/800`
    };
    setRecipes(prev => [newRecipe, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleUpdateRecipe = (updated: Recipe) => {
    setRecipes(prev => prev.map(r => r.id === updated.id ? updated : r));
    setEditingRecipe(null);
    if (selectedRecipe?.id === updated.id) setSelectedRecipe(updated);
  };

  const handleDeleteRecipe = (id: string) => {
    if (window.confirm('Delete this recipe?')) {
      setRecipes(prev => prev.filter(r => r.id !== id));
      if (selectedRecipe?.id === id) setSelectedRecipe(null);
    }
  };

  return (
    <div className="relative min-h-screen pb-20 selection:bg-[#3f4238] selection:text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="clay-float absolute -top-32 -left-16 h-72 w-72 rounded-[48px] bg-white/50 blur-2xl"></div>
        <div className="clay-float-slow absolute top-24 right-10 h-96 w-96 rounded-full bg-[#e8e2d8]/80 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-[64px] bg-white/40 blur-2xl"></div>
      </div>

      <div className="fixed top-6 right-6 z-50 flex items-center gap-6">
        <div className="clay-chip flex gap-4 text-[9px] font-bold uppercase tracking-widest text-[#a5a58d] px-4 py-2">
          <button 
            className="hover:text-[#3f4238] transition-colors"
            onClick={() => {
              const blob = new Blob([JSON.stringify(recipes, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = 'wellness_recipes.json'; a.click();
            }}
          >
            {t.export}
          </button>
          <button 
            className="hover:text-[#3f4238] transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {t.import}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".json" 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                  try {
                    const json = JSON.parse(ev.target?.result as string);
                    if (Array.isArray(json)) setRecipes(json);
                  } catch { alert(t.importError); }
                };
                reader.readAsText(file);
              }
            }} 
          />
        </div>
        <div className="clay-chip flex gap-2 text-[10px] font-bold text-[#a5a58d] px-4 py-2">
          <button onClick={() => setLang('en')} className={lang === 'en' ? 'text-[#3f4238]' : ''}>EN</button>
          <span className="opacity-20">|</span>
          <button onClick={() => setLang('ru')} className={lang === 'ru' ? 'text-[#3f4238]' : ''}>RU</button>
        </div>
      </div>

      <header className="pt-14 md:pt-16 pb-8 text-center mb-6 px-4">
        <div className="mx-auto max-w-3xl clay-surface px-5 md:px-8 py-6 md:py-8">
          <h1 className="serif text-2xl md:text-3xl lg:text-4xl text-[#3f4238] tracking-tight">
            {t.title}
          </h1>
          <p className="mt-3 text-[9px] md:text-[10px] uppercase tracking-[0.55em] text-[#a5a58d] font-bold">
            {t.subtitle}
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mb-10 flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="relative w-full md:max-w-xs clay-inset px-5 py-4">
          <input 
            type="text" 
            placeholder={t.search} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[#3f4238] focus:outline-none placeholder:opacity-50 text-sm tracking-wide"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {['All', ...Object.values(Category)].map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat as any)} 
              className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 clay-chip ${
                activeCategory === cat ? 'bg-[#3f4238] text-white border-[#3f4238]' : 'text-[#a5a58d] hover:text-[#3f4238]'
              }`}
            >
              {cat === 'All' ? t.all : t[cat as Category]}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)} 
          className="px-10 py-4 text-white text-[11px] uppercase font-bold tracking-[0.25em] clay-press hover:brightness-110 transition-all active:scale-95"
        >
          {t.addRecipe}
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {filteredRecipes.map(r => (
          <RecipeCard 
            key={r.id} 
            recipe={r} 
            lang={lang} 
            onClick={setSelectedRecipe} 
            onEdit={setEditingRecipe} 
            onDelete={handleDeleteRecipe} 
          />
        ))}
        {filteredRecipes.length === 0 && (
          <div className="col-span-full py-32 text-center text-[#a5a58d] serif italic text-3xl opacity-40">
            {t.empty}
          </div>
        )}
      </main>

      {selectedRecipe && (
        <RecipeDetail 
          recipe={selectedRecipe} 
          lang={lang} 
          onClose={() => setSelectedRecipe(null)} 
          onEdit={setEditingRecipe} 
          onDelete={handleDeleteRecipe} 
        />
      )}
      {isAddModalOpen && (
        <AddRecipeModal 
          lang={lang} 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={handleAddRecipe} 
        />
      )}
      {editingRecipe && (
        <EditRecipeModal 
          recipe={editingRecipe} 
          lang={lang} 
          onClose={() => setEditingRecipe(null)} 
          onSave={handleUpdateRecipe} 
        />
      )}

      <footer className="mt-32 pt-20 px-6 max-w-7xl mx-auto text-center pb-20">
        <div className="clay-surface inline-flex flex-col items-center px-10 py-8">
          <div className="serif text-3xl md:text-4xl text-[#3f4238] mb-4 tracking-wide">{t.footerNote}</div>
          <div className="text-[9px] uppercase tracking-[0.6em] text-[#a5a58d] font-bold">{t.curated}</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
