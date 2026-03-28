export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const isRequired = (v: string) => v.trim().length > 0;
export const minLength = (min: number) => (v: string) => v.length >= min;
export const maxLength = (max: number) => (v: string) => v.length <= max;
