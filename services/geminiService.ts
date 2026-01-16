// This service has been deactivated as per user request to remove AI features and API dependencies.
export const generateRecipeImage = async (title: string, _category: string): Promise<string> => {
  return `https://picsum.photos/seed/${encodeURIComponent(title)}/800/800`;
};

export const enrichRecipeText = async (_title: string, _category: any): Promise<any> => {
  return {
    ingredients: [],
    instructions: []
  };
};