/** Global declaration so TypeScript accepts CSS Module imports. */
declare module '*.module.css' {
  const styles: Record<string, string>;
  export default styles;
}

declare module '*.css' {
  const styles: Record<string, string>;
  export default styles;
}
