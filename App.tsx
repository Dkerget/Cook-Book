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
    curated: "Recipes in New vision",
    // Categories
    Breakfast: "Breakfast",
    Lunch: "Lunch",
    Dinner: "Dinner",
    Snack: "Snack",
    Dessert: "Dessert",
    // Detail
    viewSource: "View Source",
    edit: "Edit",
    copyLink: "Copy Link",
    delete: "Delete",
    ingredients: "Ingredients",
    instructions: "Instructions",
    // Modals
    newRecipe: "New Recipe",
    editRecipe: "Edit Recipe",
    manualEntry: "Manual Entry",
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
    importError: "Failed to import recipes. Please check the file format."
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
    curated: "Рецепты в новом видении",
    // Categories
    Breakfast: "Завтрак",
    Lunch: "Обед",
    Dinner: "Ужин",
    Snack: "Перекус",
    Dessert: "Десерт",
    // Detail
    viewSource: "Источник",
    edit: "Правка",
    copyLink: "Копировать",
    delete: "Удалить",
    ingredients: "Ингредиенты",
    instructions: "Инструкции",
    // Modals
    newRecipe: "Новый рецепт",
    editRecipe: "Редактировать",
    manualEntry: "Вручную",
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
    importSuccess: "Рецепты успешно импортированы!",
    importError: "Ошибка импорта. Проверьте формат файла."
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
  },
  {
    id: '2',
    title: 'Grilled Lemon Salmon',
    url: 'https://example.com/salmon',
    category: Category.Dinner,
    ingredients: ['2 salmon fillets', '1 lemon, sliced', '2 cloves garlic', 'Fresh dill', 'Sea salt'],
    instructions: ['Season salmon with salt and garlic.', 'Place lemon slices on top.', 'Grill for 12-15 minutes.', 'Garnish with dill.'],
    thumbnail: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
    createdAt: Date.now() - 10000
  },
];

const App: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'ru'>(() => {
    return (localStorage.getItem(LANG_KEY) as 'en' | 'ru') || 'en';
  });

  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_RECIPES;
    } catch (e) {
      console.error("Failed to load recipes from storage", e);
      return INITIAL_RECIPES;
    }
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    } catch (e) {
      console.error("Failed to save to storage", e);
    }
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    let result = [...recipes];
    if (activeCategory !== 'All') {
      result = result.filter(r => r.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => r.title.toLowerCase().includes(q));
      return result.slice(0, 20); 
    }
    return result.sort((a, b) => b.createdAt - a.createdAt);
  }, [recipes, activeCategory, searchQuery]);

  const handleAddRecipe = (input: NewRecipeInput) => {
    const newRecipe: Recipe = {
      id: Math.random().toString(36).substr(2, 9),
      title: input.title,
      url: input.url || '#',
      category: input.category,
      ingredients: input.ingredients.filter(i => i.trim() !== ''),
      instructions: input.instructions.filter(i => i.trim() !== ''),
      thumbnail: input.thumbnail || `https://picsum.photos/seed/${encodeURIComponent(input.title)}/800/800`,
      createdAt: Date.now()
    };
    setRecipes(prev => [newRecipe, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleUpdateRecipe = (updatedRecipe: Recipe) => {
    setRecipes(prev => prev.map(r => r.id === updatedRecipe.id ? updatedRecipe : r));
    setEditingRecipe(null);
    if (selectedRecipe?.id === updatedRecipe.id) {
      setSelectedRecipe(updatedRecipe);
    }
  };

  const handleDeleteRecipe = (id: string) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
    if (selectedRecipe?.id === id) setSelectedRecipe(null);
    if (editingRecipe?.id === id) setEditingRecipe(null);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(recipes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wellness_cookbook_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          setRecipes(json);
          alert(t.importSuccess);
        } else {
          alert(t.importError);
        }
      } catch (err) {
        console.error("Import failed:", err);
        alert(t.importError);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-[#a5a58d] selection:text-white">
      {/* Top Bar with Language and Data Controls */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-6">
        <div className="flex gap-4 text-[9px] font-bold uppercase tracking-widest text-[#a5a58d]">
          <button 
            onClick={handleExport}
            className="hover:text-[#3f4238] transition-colors flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            {t.export}
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="hover:text-[#3f4238] transition-colors flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            {t.import}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            className="hidden" 
            accept=".json"
          />
        </div>

        <div className="flex gap-3 text-[10px] font-bold uppercase tracking-widest text-[#a5a58d]">
          <button 
            onClick={() => setLang('en')} 
            className={`hover:text-[#3f4238] transition-colors ${lang === 'en' ? 'text-[#3f4238] border-b border-[#3f4238]' : ''}`}
          >
            EN
          </button>
          <span className="opacity-30">|</span>
          <button 
            onClick={() => setLang('ru')} 
            className={`hover:text-[#3f4238] transition-colors ${lang === 'ru' ? 'text-[#3f4238] border-b border-[#3f4238]' : ''}`}
          >
            RU
          </button>
        </div>
      </div>

      <header className="pt-16 pb-12 px-6 max-w-7xl mx-auto text-center border-b border-[#e5e1d8] mb-12">
        <h1 className="serif text-7xl md:text-8xl text-[#3f4238] mb-4 tracking-tight">{t.title}</h1>
        <p className="text-xs uppercase tracking-[0.4em] text-[#a5a58d] font-bold">{t.subtitle}</p>
      </header>

      <div className="sticky top-0 z-40 bg-[#f4f1ea]/90 backdrop-blur-md py-6 px-6 border-b border-[#e5e1d8] mb-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:max-w-md group">
            <input 
              type="text" 
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-[#a5a58d] pb-2 pl-8 text-[#3f4238] placeholder:text-[#a5a58d]/60 focus:outline-none focus:border-[#3f4238] transition-colors"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-0 bottom-3 text-[#a5a58d] group-focus-within:text-[#3f4238] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {['All', ...Object.values(Category)].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as Category | 'All')}
                className={`px-5 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-bold transition-all border ${
                  activeCategory === cat 
                  ? 'bg-[#3f4238] text-[#f4f1ea] border-[#3f4238]' 
                  : 'bg-transparent text-[#a5a58d] border-[#e5e1d8] hover:border-[#a5a58d]'
                }`}
              >
                {cat === 'All' ? t.all : t[cat as Category]}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-8 py-3 bg-[#3f4238] text-[#f4f1ea] uppercase tracking-widest text-[10px] font-bold hover:bg-[#525547] transition-all shadow-sm rounded-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t.addRecipe}
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map(recipe => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                lang={lang}
                onClick={setSelectedRecipe}
                onEdit={setEditingRecipe}
                onDelete={handleDeleteRecipe}
              />
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
              <p className="serif text-3xl text-[#a5a58d] italic font-light opacity-50">
                {t.empty}
              </p>
            </div>
          )}
        </div>
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

      <footer className="mt-40 pt-16 border-t border-[#e5e1d8] px-6 max-w-7xl mx-auto text-center opacity-40">
        <div className="serif text-4xl text-[#3f4238] select-none mb-4">{t.footerNote}</div>
        <div className="text-[8px] uppercase tracking-[0.6em] text-[#a5a58d]">{t.curated}</div>
      </footer>
    </div>
  );
};

export default App;