// Types pour le système de matchmaking Live&Work

export interface UserIdentity {
  prenom: string;
  nom: string;
  headline: string;
  photo_url?: string;
  langues: string[];
}

export interface Localisation {
  ville: string;
  pays: string;
  lat: number;
  lng: number;
  mobilite: {
    rayon_km: number;
    remote: boolean;
  };
}

export interface Disponibilite {
  plages_horaires: PlageHoraire[];
  format: FormatRencontre[];
}

export type PlageHoraire = 
  | 'lun_matin' | 'lun_apm' | 'lun_soir'
  | 'mar_matin' | 'mar_apm' | 'mar_soir'
  | 'mer_matin' | 'mer_apm' | 'mer_soir'
  | 'jeu_matin' | 'jeu_apm' | 'jeu_soir'
  | 'ven_matin' | 'ven_apm' | 'ven_soir'
  | 'weekend';

export type FormatRencontre = 
  | 'coffee' | 'visio' | 'cowork' | 'mentorat' | 'projet_court' | 'cofondation';

export type Secteur = 
  | 'HealthTech' | 'Immobilier' | 'SaaS' | 'Public_sector' | 'FinTech' 
  | 'EdTech' | 'CleanTech' | 'RetailTech' | 'FoodTech' | 'LegalTech';

export interface Competences {
  hard: string[];
  soft: string[];
  seniorite: 'junior' | 'intermediate' | 'senior';
}

export interface Badges {
  communautaires: string[];
  sectoriels: string[];
  personnalite: string[];
}

export type Valeur = 
  | 'Impact_social' | 'Transparence' | 'Apprentissage_continu' | 'Fiabilite'
  | 'Innovation' | 'Collaboration' | 'Autonomie' | 'Excellence' | 'Diversite';

export interface BigFive {
  ouverture: number; // 0-100
  consciencieuse: number; // 0-100
  extraversion: number; // 0-100
  agreabilite: number; // 0-100
  stabilite_emotionnelle: number; // 0-100
  source: 'auto_eval' | 'test_externe';
  date: string; // ISO-8601
}

export interface PreferencesMatching {
  priorites: ('secteur' | 'localisation' | 'valeurs' | 'complementarite_competences')[];
  poids_personnalises?: {
    big5: number;
    valeurs: number;
    secteur: number;
    competences: number;
    localisation: number;
    disponibilite: number;
    comportement: number;
    fraicheur: number;
  };
  radius_km: number;
  visibilite_personnalite: 'prive' | 'amis' | 'public';
}

export interface Activite {
  derniere_connexion: string; // ISO-8601
  signals: {
    vues: number;
    likes: number;
    reponses: number;
    no_show: number;
    messages_envoyes: number;
  };
}

export interface EtatUtilisateur {
  ouvert_aux_matches: boolean;
  bloque_ids: string[];
}

export interface UserProfile {
  user_id: string;
  identite: UserIdentity;
  localisation: Localisation;
  disponibilite: Disponibilite;
  secteur: Secteur[];
  competences: Competences;
  badges: Badges;
  valeurs: Valeur[];
  mission_personnelle: string;
  projets_en_cours: string[];
  apporte: string[];
  recherche: string[];
  big_five: BigFive;
  preferences_matching: PreferencesMatching;
  activite: Activite;
  etat: EtatUtilisateur;
  version: number;
}

export interface MatchSuggestion {
  id: string;
  compatibility_score: number;
  reasons: string[];
  overlaps: {
    valeurs: string[];
    competences_supply: string[];
    competences_demand: string[];
  };
  next_best_action: string;
  profile_preview: {
    identite: UserIdentity;
    secteur: Secteur[];
    badges: Pick<Badges, 'communautaires' | 'sectoriels'>;
  };
}

export interface MatchingResponse {
  user_id: string;
  suggestions: MatchSuggestion[];
  diversity_stats: {
    unique_secteurs: number;
    nouveaux_profils: number;
  };
}

export interface FeedbackEvent {
  user_id: string;
  target_id: string;
  event: 'like' | 'pass' | 'message' | 'meeting_confirmed' | 'no_show';
  timestamp: string; // ISO-8601
}

export interface ScoreComponents {
  big5: number;
  valeurs: number;
  secteur: number;
  competences: number;
  localisation: number;
  disponibilite: number;
  comportement: number;
  fraicheur: number;
}

export interface MatchingWeights {
  big5: number;
  valeurs: number;
  secteur: number;
  competences: number;
  localisation: number;
  disponibilite: number;
  comportement: number;
  fraicheur: number;
}

export const DEFAULT_WEIGHTS: MatchingWeights = {
  big5: 0.20,
  valeurs: 0.20,
  secteur: 0.15,
  competences: 0.20,
  localisation: 0.10,
  disponibilite: 0.05,
  comportement: 0.05,
  fraicheur: 0.05,
};