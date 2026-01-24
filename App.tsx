import React, { useState, useEffect, useMemo, useRef } from 'react';
import { User } from "firebase/auth";
import {
  sendLoginLink,
  completeLoginIfLink,
  watchAuth,
} from "./src/auth/emailLink";
import { Category, Recipe, NewRecipeInput } from './types.ts';
import { RecipeCard } from './components/RecipeCard.tsx';
import { RecipeDetail } from './components/RecipeDetail.tsx';
import { AddRecipeModal } from './components/AddRecipeModal.tsx';
import { EditRecipeModal } from './components/EditRecipeModal.tsx';
import { translations, INITIAL_RECIPES } from './constants.ts';

const STORAGE_KEY = 'wellness_cookbook_data_v2';
const LANG_KEY = 'wellness_cookbook_lang';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  useEffect(() => {
    completeLoginIfLink();
    return watchAuth(setUser);
  }, []);

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

  const categoryIcons: Record<string, React.ReactNode> = {
    All: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M6 12h12M8 18h8" />
      </svg>
    ),
    Breakfast: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4h10l-1 10H8L7 4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 20h12" />
      </svg>
    ),
    Lunch: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h10" />
      </svg>
    ),
    Dinner: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m13.66-6.66-1.4 1.4M6.74 17.26l-1.4 1.4m0-12 1.4 1.4m9.92 9.92 1.4 1.4" />
      </svg>
    ),
    Snack: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 5h12v12H6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9h8M8 13h6" />
      </svg>
    ),
    Dessert: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16l-2 8H6l-2-8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10a4 4 0 018 0" />
      </svg>
    )
  };

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

  if (!user) {
    return (
      <div style={{ padding: 24, maxWidth: 420 }}>
        <h2>Sign in to Cookbook</h2>

        <input
          type="email"
          placeholder="your@email.com"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            fontSize: 16,
            background: "#ededed",
            border: "1px solid #d2d2d2",
            color: "#3f4238",
            borderRadius: 12
          }}
        />

        <button
          style={{
            marginTop: 14,
            padding: 12,
            width: "100%",
            background: "#3f4238",
            color: "#f5f5f5",
            border: "1px solid #2f312b",
            borderRadius: 999,
            fontWeight: 600,
            letterSpacing: "0.08em"
          }}
          onClick={async () => {
            await sendLoginLink(loginEmail);
            setLinkSent(true);
          }}
        >
          Send login link
        </button>

        {linkSent && <p>Check your email to finish signing in.</p>}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-20 selection:bg-[#3f4238] selection:text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="clay-float absolute -top-32 -left-16 h-72 w-72 rounded-[48px] bg-white/50 blur-2xl"></div>
        <div className="clay-float-slow absolute top-24 right-10 h-96 w-96 rounded-full bg-[#e8e2d8]/80 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-[64px] bg-white/40 blur-2xl"></div>
      </div>

      <div className="fixed top-6 right-6 z-50 flex items-center gap-6">
        <div className="clay-chip flex gap-4 text-[9px] font-bold uppercase tracking-widest text-[#8c9078] px-4 py-2">
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
        <div className="clay-chip flex gap-2 text-[10px] font-bold text-[#8c9078] px-4 py-2">
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
              className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 clay-chip flex items-center gap-2 ${activeCategory === cat ? 'bg-[#3f4238] text-white border-[#3f4238]' : 'text-[#5a5d50] hover:text-[#3f4238]'
                }`}
            >
              <span className="opacity-80">{categoryIcons[cat]}</span>
              <span>{cat === 'All' ? t.all : t[cat as Category]}</span>
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

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8">
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
          onUpdate={handleUpdateRecipe}
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
