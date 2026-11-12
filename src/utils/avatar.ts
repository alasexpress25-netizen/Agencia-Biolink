// La foto de perfil siempre se carga desde el repositorio: public/avatar.jpg
// (BASE_URL respeta la ruta base de GitHub Pages, ej. /Thays-biolink/)
export const AVATAR_URL: string = `${(import.meta as any).env?.BASE_URL || './'}avatar.jpg`;
