import { UserProfile, MatchSuggestion } from '@/types/matching';

/**
 * Données de démonstration pour le système de matchmaking
 */

export const mockProfiles: UserProfile[] = [
  {
    user_id: 'user_1',
    identite: {
      prenom: 'Marie',
      nom: 'Dubois',
      headline: 'Product Designer • HealthTech passionnée',
      photo_url: '',
      langues: ['fr', 'en']
    },
    localisation: {
      ville: 'Paris',
      pays: 'France',
      lat: 48.8566,
      lng: 2.3522,
      mobilite: {
        rayon_km: 25,
        remote: true
      }
    },
    disponibilite: {
      plages_horaires: ['mar_matin', 'mer_apm', 'jeu_matin'],
      format: ['coffee', 'visio', 'mentorat']
    },
    secteur: ['HealthTech'],
    competences: {
      hard: ['Figma', 'UX Research', 'Prototyping', 'Design System'],
      soft: ['Empathie', 'Communication', 'Créativité'],
      seniorite: 'senior'
    },
    badges: {
      communautaires: ['Organisatrice d\'événements', 'Mentor startups', 'Ladies of Product'],
      sectoriels: ['HealthTech certified', 'HIPAA compliant'],
      personnalite: ['Innovatrice', 'Collaboratrice', 'Mentor expérimenté']
    },
    valeurs: ['Impact_social', 'Transparence', 'Apprentissage_continu', 'Innovation'],
    mission_personnelle: 'Rendre la santé accessible à tous grâce au design',
    projets_en_cours: ['App de téléconsultation', 'Design system médical'],
    apporte: ['Design UX/UI', 'Recherche utilisateur', 'Prototypage rapide'],
    recherche: ['Développeur backend', 'Expert réglementaire santé', 'Co-fondateur technique'],
    big_five: {
      ouverture: 85,
      consciencieuse: 75,
      extraversion: 70,
      agreabilite: 80,
      stabilite_emotionnelle: 78,
      source: 'test_externe',
      date: '2024-01-15T10:00:00Z'
    },
    preferences_matching: {
      priorites: ['valeurs', 'secteur', 'complementarite_competences'],
      radius_km: 25,
      visibilite_personnalite: 'public'
    },
    activite: {
      derniere_connexion: '2024-01-20T09:30:00Z',
      signals: {
        vues: 45,
        likes: 23,
        reponses: 18,
        no_show: 0,
        messages_envoyes: 12
      }
    },
    etat: {
      ouvert_aux_matches: true,
      bloque_ids: []
    },
    version: 1
  },
  {
    user_id: 'user_2',
    identite: {
      prenom: 'Thomas',
      nom: 'Martin',
      headline: 'CTO & Entrepreneur • SaaS B2B Expert',
      photo_url: '',
      langues: ['fr', 'en']
    },
    localisation: {
      ville: 'Lyon',
      pays: 'France',
      lat: 45.7640,
      lng: 4.8357,
      mobilite: {
        rayon_km: 50,
        remote: true
      }
    },
    disponibilite: {
      plages_horaires: ['lun_apm', 'mar_matin', 'ven_apm'],
      format: ['visio', 'mentorat', 'cofondation']
    },
    secteur: ['SaaS', 'FinTech'],
    competences: {
      hard: ['React', 'Node.js', 'Python', 'AWS', 'DevOps'],
      soft: ['Leadership', 'Vision stratégique', 'Résolution de problèmes'],
      seniorite: 'senior'
    },
    badges: {
      communautaires: ['Mentor technique', 'Speaker conférences'],
      sectoriels: ['Y Combinator Alumni', 'AWS Certified'],
      personnalite: ['Leader naturel', 'Innovateur', 'Mentor expérimenté']
    },
    valeurs: ['Innovation', 'Excellence', 'Transparence', 'Collaboration'],
    mission_personnelle: 'Aider les entrepreneurs à construire des produits qui comptent',
    projets_en_cours: ['Plateforme FinTech', 'Programme de mentorat tech'],
    apporte: ['Architecture technique', 'Stratégie produit', 'Levée de fonds'],
    recherche: ['Designer UX/UI', 'Growth marketer', 'Partenaires commerciaux'],
    big_five: {
      ouverture: 90,
      consciencieuse: 85,
      extraversion: 75,
      agreabilite: 70,
      stabilite_emotionnelle: 82,
      source: 'auto_eval',
      date: '2024-01-10T14:00:00Z'
    },
    preferences_matching: {
      priorites: ['complementarite_competences', 'valeurs', 'secteur'],
      radius_km: 50,
      visibilite_personnalite: 'public'
    },
    activite: {
      derniere_connexion: '2024-01-21T11:15:00Z',
      signals: {
        vues: 32,
        likes: 19,
        reponses: 15,
        no_show: 1,
        messages_envoyes: 8
      }
    },
    etat: {
      ouvert_aux_matches: true,
      bloque_ids: []
    },
    version: 1
  },
  {
    user_id: 'user_3',
    identite: {
      prenom: 'Sophie',
      nom: 'Chen',
      headline: 'Data Scientist • IA pour la Sustainability',
      photo_url: '',
      langues: ['fr', 'en', 'zh']
    },
    localisation: {
      ville: 'Bordeaux',
      pays: 'France',
      lat: 44.8378,
      lng: -0.5792,
      mobilite: {
        rayon_km: 30,
        remote: true
      }
    },
    disponibilite: {
      plages_horaires: ['lun_matin', 'mer_matin', 'ven_apm', 'weekend'],
      format: ['coffee', 'cowork', 'projet_court']
    },
    secteur: ['CleanTech', 'SaaS'],
    competences: {
      hard: ['Python', 'Machine Learning', 'TensorFlow', 'Data Visualization', 'SQL'],
      soft: ['Analyse critique', 'Curiosité', 'Persévérance'],
      seniorite: 'intermediate'
    },
    badges: {
      communautaires: ['Kaggle Expert', 'Climate Tech Advocate'],
      sectoriels: ['Google AI Certified', 'Carbon footprint specialist'],
      personnalite: ['Innovatrice', 'Calme sous pression', 'Data Expert']
    },
    valeurs: ['Impact_social', 'Apprentissage_continu', 'Innovation', 'Diversite'],
    mission_personnelle: 'Utiliser l\'IA pour résoudre les défis environnementaux',
    projets_en_cours: ['Modèle prédictif carbone', 'Startup CleanTech'],
    apporte: ['Analyses de données', 'Modèles ML', 'Expertise climat'],
    recherche: ['Business developer', 'Expert réglementaire', 'Investisseurs'],
    big_five: {
      ouverture: 88,
      consciencieuse: 90,
      extraversion: 45,
      agreabilite: 75,
      stabilite_emotionnelle: 85,
      source: 'test_externe',
      date: '2024-01-12T16:30:00Z'
    },
    preferences_matching: {
      priorites: ['valeurs', 'complementarite_competences', 'secteur'],
      radius_km: 30,
      visibilite_personnalite: 'amis'
    },
    activite: {
      derniere_connexion: '2024-01-21T08:45:00Z',
      signals: {
        vues: 28,
        likes: 14,
        reponses: 12,
        no_show: 0,
        messages_envoyes: 6
      }
    },
    etat: {
      ouvert_aux_matches: true,
      bloque_ids: []
    },
    version: 1
  }
];

export const generateMockSuggestions = (userId: string): MatchSuggestion[] => {
  const userProfile = mockProfiles.find(p => p.user_id === userId);
  if (!userProfile) return [];

  const otherProfiles = mockProfiles.filter(p => p.user_id !== userId);

  return otherProfiles.map((profile, index) => ({
    id: profile.user_id,
    compatibility_score: 90 - (index * 15), // Scores décroissants pour la démo
    reasons: generateReasons(userProfile, profile),
    overlaps: {
      valeurs: userProfile.valeurs.filter(v => profile.valeurs.includes(v)),
      competences_supply: profile.apporte.filter(a => userProfile.recherche.some(r => 
        r.toLowerCase().includes(a.toLowerCase())
      )),
      competences_demand: userProfile.apporte.filter(a => profile.recherche.some(r => 
        r.toLowerCase().includes(a.toLowerCase())
      ))
    },
    next_best_action: generateNextAction(userProfile, profile),
    profile_preview: {
      identite: profile.identite,
      secteur: profile.secteur,
      badges: {
        communautaires: profile.badges.communautaires,
        sectoriels: profile.badges.sectoriels
      }
    }
  }));
};

const generateReasons = (userA: UserProfile, userB: UserProfile): string[] => {
  const reasons: string[] = [];
  
  // Valeurs communes
  const commonValues = userA.valeurs.filter(v => userB.valeurs.includes(v));
  if (commonValues.length >= 2) {
    reasons.push(`${commonValues.length} valeurs en commun : ${commonValues.slice(0, 3).join(', ')}`);
  }
  
  // Secteurs
  const commonSectors = userA.secteur.filter(s => userB.secteur.includes(s));
  if (commonSectors.length > 0) {
    reasons.push(`Secteur ${commonSectors[0]} en commun`);
  }
  
  // Complémentarité
  const hasComplementarity = userA.recherche.some(r => 
    userB.apporte.some(a => a.toLowerCase().includes(r.toLowerCase()))
  );
  if (hasComplementarity) {
    reasons.push('Complémentarité compétences forte');
  }
  
  // Localisation
  if (userA.localisation.mobilite.remote || userB.localisation.mobilite.remote) {
    reasons.push('Compatible télétravail');
  } else {
    reasons.push(`Région ${userB.localisation.ville}`);
  }
  
  return reasons.slice(0, 4);
};

const generateNextAction = (userA: UserProfile, userB: UserProfile): string => {
  const commonFormats = userA.disponibilite.format.filter(f => 
    userB.disponibilite.format.includes(f)
  );
  
  if (commonFormats.includes('coffee')) {
    return 'Proposer un café cette semaine';
  } else if (commonFormats.includes('visio')) {
    return 'Planifier un appel vidéo';
  } else if (commonFormats.includes('mentorat')) {
    return 'Demander une session de mentorat';
  } else {
    return 'Envoyer un message d\'introduction';
  }
};