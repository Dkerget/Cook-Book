import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Category, Recipe, NewRecipeInput } from './types';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetail } from './components/RecipeDetail';
import { AddRecipeModal } from './components/AddRecipeModal';
import { EditRecipeModal } from './components/EditRecipeModal';

const STORAGE_KEY = 'wellness_cookbook_data_v2';
const LANG_KEY = 'wellness_cookbook_lang';

export const translations = {
  en: {
    title: "Cookbook",
    subtitle: "The Art of Mindful Nourishment",
    search: "Filter your collection...",
    addRecipe: "Add Recipe",
    export: "Export",
    import: "Import",
    all: "All",
    empty: "Your collection is currently empty.",
    footerNote: "Patience • Presence • Plate",
    curated: "Personal Recipe Collection",
    Breakfast: "Breakfast",
    Lunch: "Lunch",
    Dinner: "Dinner",
    Snack: "Snack",
    Dessert: "Dessert",
    viewSource: "View Source",
    edit: "Edit",
    copyLink: "Copy Link",
    delete: "Delete",
    ingredients: "Ingredients",
    instructions: "Instructions",
    newRecipe: "New Recipe",
    editRecipe: "Edit Recipe",
    recipeTitle: "Title",
    category: "Category",
    sourceUrl: "Source URL (Optional)",
    uploadPhoto: "Upload Photo",
    changePhoto: "Change Photo",
    add: "+ Add",
    addToCollection: "Add to Collection",
    saveRecipe: "Save Recipe",
    copied: "Source link copied to clipboard!",
    placeholderTitle: "e.g. Heirloom Tomato Tart",
    placeholderStep: "Describe step...",
    placeholderIng: "e.g. 2 ripe avocados",
    importSuccess: "Recipes imported successfully!",
    importError: "Failed to import recipes."
  },
  ru: {
    title: "Книга рецептов",
    subtitle: "Искусство осознанного питания",
    search: "Фильтр коллекции...",
    addRecipe: "Добавить рецепт",
    export: "Экспорт",
    import: "Импорт",
    all: "Все",
    empty: "Ваша коллекция пока пуста.",
    footerNote: "Терпение • Присутствие • Блюдо",
    curated: "Личная коллекция рецептов",
    Breakfast: "Завтрак",
    Lunch: "Обед",
    Dinner: "Ужин",
    Snack: "Перекус",
    Dessert: "Десерт",
    viewSource: "Источник",
    edit: "Правка",
    copyLink: "Копировать",
    delete: "Удалить",
    ingredients: "Ингредиенты",
    instructions: "Инструкции",
    newRecipe: "Новый рецепт",
    editRecipe: "Редактировать",
    recipeTitle: "Название",
    category: "Категория",
    sourceUrl: "URL источника (опц.)",
    uploadPhoto: "Загрузить фото",
    changePhoto: "Изменить фото",
    add: "+ Добавить",
    addToCollection: "Добавить в коллекцию",
    saveRecipe: "Сохранить",
    copied: "Ссылка скопирована!",
    placeholderTitle: "напр. Тарт с томатами",
    placeholderStep: "Опишите шаг...",
    placeholderIng: "напр. 2 спелых авокадо",
    importSuccess: "Успешно импортировано!",
    importError: "Ошибка импорта."
  }
};

const INITIAL_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Whipped Matcha Bowl',
    url: 'https://example.com/matcha',
    category: Category.Breakfast,
    ingredients: ['1 tsp ceremonial matcha', '1/2 cup hot water', '1 tbsp honey', 'Greek yogurt', 'Blackberries'],
    instructions: ['Whisk matcha with water until frothy.', 'Layer yogurt in bowl.', 'Drizzle matcha over yogurt.', 'Top with berries.'],
    thumbnail: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=800&q=80',
    createdAt: Date.now()
  }
];

const App: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'ru'>(() => (localStorage.getItem(LANG_KEY) as 'en' | 'ru') || 'en');
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_RECIPES;
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
    setRecipes(prev => prev.filter(r => r.id !== id));
    if (selectedRecipe?.id === id) setSelectedRecipe(null);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="absolute top-6 right-6 z-50 flex items-center gap-6">
        <div className="flex gap-4 text-[9px] font-bold uppercase tracking-widest text-[#a5a58d]">
          <button onClick={() => {
            const blob = new Blob([JSON.stringify(recipes, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'recipes.json'; a.click();
          }}>{t.export}</button>
          <button onClick={() => fileInputRef.current?.click()}>{t.import}</button>
          <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={(e) => {
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
          }} />
        </div>
        <div className="flex gap-2 text-[10px] font-bold text-[#a5a58d]">
          <button onClick={() => setLang('en')} className={lang === 'en' ? 'text-[#3f4238]' : ''}>EN</button>
          <button onClick={() => setLang('ru')} className={lang === 'ru' ? 'text-[#3f4238]' : ''}>RU</button>
        </div>
      </div>

      <header className="pt-16 pb-12 text-center border-b border-[#e5e1d8] mb-12">
        <h1 className="serif text-7xl text-[#3f4238] mb-2">{t.title}</h1>
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#a5a58d]">{t.subtitle}</p>
      </header>

      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row gap-6 justify-between items-center">
        <input 
          type="text" placeholder={t.search} value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-b border-[#a5a58d] pb-2 text-[#3f4238] w-full md:max-w-xs focus:outline-none"
        />
        <div className="flex gap-2">
          {['All', ...Object.values(Category)].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat as any)} className={`px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${activeCategory === cat ? 'bg-[#3f4238] text-white' : 'text-[#a5a58d]'}`}>
              {cat === 'All' ? t.all : t[cat as Category]}
            </button>
          ))}
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="px-8 py-3 bg-[#3f4238] text-white text-[10px] uppercase font-bold tracking-widest rounded-sm">
          {t.addRecipe}
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredRecipes.map(r => (
          <RecipeCard key={r.id} recipe={r} lang={lang} onClick={setSelectedRecipe} onEdit={setEditingRecipe} onDelete={handleDeleteRecipe} />
        ))}
      </main>

      {selectedRecipe && <RecipeDetail recipe={selectedRecipe} lang={lang} onClose={() => setSelectedRecipe(null)} onEdit={setEditingRecipe} onDelete={handleDeleteRecipe} />}
      {isAddModalOpen && <AddRecipeModal lang={lang} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddRecipe} />}
      {editingRecipe && <EditRecipeModal recipe={editingRecipe} lang={lang} onClose={() => setEditingRecipe(null)} onSave={handleUpdateRecipe} />}
    </div>
  );
};
export default App;