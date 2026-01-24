import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { Category, NewRecipeInput, Recipe } from "../../types.ts";

const recipesCollection = collection(db, "recipes");

const isCategory = (value: unknown): value is Category => {
  return Object.values(Category).includes(value as Category);
};

const toMillis = (value: any) => {
  if (!value) return Date.now();
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value === "number") return value;
  return Date.now();
};

const toRecipe = (id: string, data: any): Recipe => {
  return {
    id,
    title: data?.title ?? "",
    url: data?.url ?? "",
    category: isCategory(data?.category) ? data.category : Category.Breakfast,
    ingredients: Array.isArray(data?.ingredients) ? data.ingredients : [],
    instructions: Array.isArray(data?.instructions) ? data.instructions : [],
    thumbnailUrl: data?.thumbnailUrl ?? "",
    createdAt: toMillis(data?.createdAt ?? data?.updatedAt),
  };
};

export function listenRecipes(callback: (recipes: Recipe[]) => void) {
  const q = query(recipesCollection, orderBy("updatedAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((snap) => toRecipe(snap.id, snap.data()));
    callback(items);
  });
}

export async function createRecipe(recipe: NewRecipeInput) {
  const ownerEmail = auth.currentUser?.email ?? "";
  const docRef = await addDoc(recipesCollection, {
    ...recipe,
    ownerEmail,
    thumbnailUrl: recipe.thumbnailUrl ?? "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export function updateRecipe(id: string, patch: Partial<NewRecipeInput & { thumbnailUrl?: string }>) {
  const ref = doc(db, "recipes", id);
  return updateDoc(ref, {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export function deleteRecipe(id: string) {
  const ref = doc(db, "recipes", id);
  return deleteDoc(ref);
}
