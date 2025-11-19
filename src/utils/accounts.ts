// Tipos de cuenta que son activos
export const ASSET_ACCOUNT_TYPES = [
  "cash",
  "checking",
  "savings",
  "investment",
] as const;

// Tipos de cuenta que son pasivos
export const LIABILITY_ACCOUNT_TYPES = [
  "credit_card",
  "loan",
] as const;

// Mapeo de icono a tipo de cuenta
export const ICON_TO_ACCOUNT_TYPE: Record<string, "cash" | "checking" | "savings" | "investment" | "credit_card" | "loan"> = {
  cash: "cash",
  checking: "checking",
  savings: "savings",
  investment: "investment",
  credit: "credit_card",
  loan: "loan",
};

// Verificar si un tipo de cuenta es activo
export function isAssetAccount(accountType: string): boolean {
  return ASSET_ACCOUNT_TYPES.includes(accountType as any);
}

// Verificar si un tipo de cuenta es pasivo
export function isLiabilityAccount(accountType: string): boolean {
  return LIABILITY_ACCOUNT_TYPES.includes(accountType as any);
}

