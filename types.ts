export enum Category {
  Breakfast = 'Breakfast',
  Lunch = 'Lunch',
  Dinner = 'Dinner',
  Snack = 'Snack',
  Dessert = 'Dessert'
}

export interface Recipe {
  id: string;
  title: string;
  url: string;
  category: Category;
  ingredients: string[];
  instructions: string[];
  thumbnailUrl?: string;
  createdAt: number;
}

export interface NewRecipeInput {
  title: string;
  url: string;
  category: Category;
  ingredients: string[];
  instructions: string[];
  thumbnailUrl?: string;
}
