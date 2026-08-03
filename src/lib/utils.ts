import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeProjectCategory(cat?: string): "Websites" | "Graphic Designs" {
  if (!cat) return "Websites";
  const lower = cat.toLowerCase();
  if (
    lower.includes("graphic") || 
    lower.includes("brand") || 
    lower.includes("design") || 
    lower.includes("identity") || 
    lower.includes("mobile") || 
    lower.includes("logo") ||
    lower.includes("vector")
  ) {
    return "Graphic Designs";
  }
  return "Websites";
}

