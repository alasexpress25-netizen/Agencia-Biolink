export interface AvatarPhotoPreset {
  id: string;
  name: string;
  profession: string;
  gesture: string;
  photoUrl: string;
}

export const AVATAR_PHOTO_PRESETS: AvatarPhotoPreset[] = [
  {
    id: 'avatar-teacher-notebook',
    name: 'Profesora con Cuaderno',
    profession: 'Educación / Cursos',
    gesture: 'Sosteniendo cuaderno de notas',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-barber-scissors',
    name: 'Estilista con Tijeras',
    profession: 'Belleza / Barbería',
    gesture: 'Gesto profesional de estilista',
    photoUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-tech-laptop',
    name: 'Tech / Programador',
    profession: 'Cursos Online / Software',
    gesture: 'Trabajando en laptop',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-photographer',
    name: 'Fotógrafo Profesional',
    profession: 'Fotografía & Video',
    gesture: 'Sosteniendo cámara',
    photoUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-podcaster',
    name: 'Podcaster con Micrófono',
    profession: 'Transmisión & Audio',
    gesture: 'Con auriculares de estudio',
    photoUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-fitness-trainer',
    name: 'Entrenador Fitness',
    profession: 'Salud & Deporte',
    gesture: 'Gesto motivacional activo',
    photoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-executive-consultant',
    name: 'Consultor de Negocios',
    profession: 'Asesorías / Finanzas',
    gesture: 'Gesto corporativo cordial',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-pastoral-leader',
    name: 'Líder de Comunidad',
    profession: 'Comunidad / Fe',
    gesture: 'Gesto cálido de bienvenida',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
  },
];
