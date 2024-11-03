export enum CategoryCode {
	E = "E",
	L = "L",
	M = "M",
	I = "I",
}

export type CategoryCodeStrings = keyof typeof CategoryCode;

export const CategoryDescriptions: Record<CategoryCode, string> = {
	[CategoryCode.E]: "Eletrodoméstico",
	[CategoryCode.L]: "Limpeza",
	[CategoryCode.M]: "Móveis",
	[CategoryCode.I]: "Informática",
};

function isCategoryCode(code: string): code is CategoryCode {
  return Object.values(CategoryCode).includes(code as CategoryCode);
}

export function validateCategory(category: string): CategoryCode | null {
  return isCategoryCode(category) ? category : null;
}
