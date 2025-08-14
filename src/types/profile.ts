export interface ProfileFormData {
  // Section A: Profil
  first_name: string;
  last_name: string;
  email: string;
  photo_url?: string;
  sector: string;
  job_role: string;
  years_experience: string;
  languages: { language: string; level: string }[];

  // Section B: Compétences & Offre
  top_skills: string;
  training_domains: string;
  value_proposition: string;

  // Section C: Besoins & Objectifs
  current_search: string;
  collaboration_type: string;
  main_objectives: string[];

  // Section D: Préférences de collaboration
  work_mode: string;
  work_speed: string;
  favorite_tools: string[];

  // Section E: Big Five (scores 1-5)
  big_five_responses: number[];

  // Section F: Réseau & Confiance
  linkedin_profile?: string;
  professional_references?: string;
}

export interface BigFiveScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  emotional_stability: number;
}

export interface ProfileData extends ProfileFormData, BigFiveScores {
  id: string;
  created_at: string;
  updated_at: string;
}

export const SECTORS = [
  'Tech',
  'Marketing',
  'Finance', 
  'Santé',
  'Industrie',
  'Éducation',
  'Autre'
] as const;

export const EXPERIENCE_LEVELS = [
  '0-1',
  '2-4',
  '5-9',
  '10+'
] as const;

export const LANGUAGES = [
  'Français',
  'Anglais', 
  'Espagnol',
  'Allemand',
  'Italien',
  'Portugais',
  'Chinois',
  'Japonais',
  'Arabe',
  'Autre'
] as const;

export const LANGUAGE_LEVELS = [
  'Débutant',
  'Intermédiaire',
  'Avancé',
  'Courant',
  'Natif'
] as const;

export const COLLABORATION_TYPES = [
  'One-shot',
  'Projet court',
  'Long terme',
  'Partenariat stratégique'
] as const;

export const MAIN_OBJECTIVES = [
  'Trouver un partenaire de projet',
  'Élargir mon réseau ciblé',
  'Trouver des clients',
  'Trouver un mentor/conseiller',
  'Tester une idée/produit'
] as const;

export const WORK_MODES = [
  'Synchrone',
  'Asynchrone',
  'Mixte'
] as const;

export const WORK_SPEEDS = [
  'Rapide',
  'Structuré',
  'Flexible'
] as const;

export const FAVORITE_TOOLS = [
  'Zoom',
  'Slack',
  'Notion',
  'Google Meet',
  'Trello',
  'Autre'
] as const;

export const BIG_FIVE_QUESTIONS = [
  { id: 1, text: "J'ai une imagination vive", dimension: 'openness', reversed: false },
  { id: 2, text: "J'ai du mal à comprendre des idées abstraites", dimension: 'openness', reversed: true },
  { id: 3, text: "J'accomplis les tâches avec soin", dimension: 'conscientiousness', reversed: false },
  { id: 4, text: "J'ai tendance à être négligent(e)", dimension: 'conscientiousness', reversed: true },
  { id: 5, text: "Je suis extraverti(e), sociable", dimension: 'extraversion', reversed: false },
  { id: 6, text: "Je suis réservé(e)", dimension: 'extraversion', reversed: true },
  { id: 7, text: "Je suis serviable et généreux(se)", dimension: 'agreeableness', reversed: false },
  { id: 8, text: "J'ai tendance à critiquer les autres", dimension: 'agreeableness', reversed: true },
  { id: 9, text: "Je reste calme dans les situations stressantes", dimension: 'emotional_stability', reversed: false },
  { id: 10, text: "Je me sens facilement stressé(e)", dimension: 'emotional_stability', reversed: true }
] as const;