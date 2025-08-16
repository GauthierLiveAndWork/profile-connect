import { UserProfile } from '@/types/matching';

/**
 * Génération automatique de badges de personnalité basés sur Big Five et activité
 */

export interface BadgeRule {
  name: string;
  condition: (profile: UserProfile) => boolean;
  category: 'personnalite' | 'comportement' | 'expertise';
}

// Règles pour les badges de personnalité (Big Five)
const personalityBadgeRules: BadgeRule[] = [
  {
    name: 'Innovateur',
    condition: (p) => p.big_five.ouverture >= 80,
    category: 'personnalite'
  },
  {
    name: 'Créatif',
    condition: (p) => p.big_five.ouverture >= 70 && p.projets_en_cours.length >= 2,
    category: 'personnalite'
  },
  {
    name: 'Fiable & structuré',
    condition: (p) => p.big_five.consciencieuse >= 80,
    category: 'personnalite'
  },
  {
    name: 'Organisé',
    condition: (p) => p.big_five.consciencieuse >= 70 && p.activite.signals.no_show <= 1,
    category: 'personnalite'
  },
  {
    name: 'Connecteur',
    condition: (p) => p.big_five.extraversion >= 70 && 
                     p.badges.communautaires.some(b => b.includes('Organisateur')),
    category: 'personnalite'
  },
  {
    name: 'Leader naturel',
    condition: (p) => p.big_five.extraversion >= 75 && 
                     p.competences.soft.includes('Leadership'),
    category: 'personnalite'
  },
  {
    name: 'Collaboratif',
    condition: (p) => p.big_five.agreabilite >= 80,
    category: 'personnalite'
  },
  {
    name: 'Médiateur',
    condition: (p) => p.big_five.agreabilite >= 75 && 
                     p.competences.soft.includes('Résolution de conflits'),
    category: 'personnalite'
  },
  {
    name: 'Calme sous pression',
    condition: (p) => p.big_five.stabilite_emotionnelle >= 75 && 
                     p.activite.signals.no_show <= 1,
    category: 'personnalite'
  },
  {
    name: 'Résilient',
    condition: (p) => p.big_five.stabilite_emotionnelle >= 80,
    category: 'personnalite'
  },
  {
    name: 'Entrepreneur',
    condition: (p) => p.big_five.ouverture >= 70 && 
                     p.big_five.extraversion >= 70 &&
                     p.disponibilite.format.includes('cofondation'),
    category: 'personnalite'
  },
  {
    name: 'Mentor expérimenté',
    condition: (p) => p.competences.seniorite === 'senior' && 
                     p.disponibilite.format.includes('mentorat') &&
                     p.big_five.agreabilite >= 70,
    category: 'personnalite'
  }
];

// Règles pour les badges comportementaux
const behaviorBadgeRules: BadgeRule[] = [
  {
    name: 'Super actif',
    condition: (p) => {
      const lastConnection = new Date(p.activite.derniere_connexion);
      const daysSince = (Date.now() - lastConnection.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 3 && p.activite.signals.messages_envoyes >= 10;
    },
    category: 'comportement'
  },
  {
    name: 'Généreux en conseil',
    condition: (p) => p.activite.signals.reponses >= 15 && 
                     p.disponibilite.format.includes('mentorat'),
    category: 'comportement'
  },
  {
    name: 'Ponctuel',
    condition: (p) => p.activite.signals.no_show === 0 && 
                     p.activite.signals.reponses >= 5,
    category: 'comportement'
  },
  {
    name: 'Très sollicité',
    condition: (p) => p.activite.signals.likes >= 20,
    category: 'comportement'
  },
  {
    name: 'Ambassadeur',
    condition: (p) => p.activite.signals.messages_envoyes >= 20 && 
                     p.activite.signals.reponses >= 15,
    category: 'comportement'
  }
];

// Règles pour les badges d'expertise
const expertiseBadgeRules: BadgeRule[] = [
  {
    name: 'Expert Tech',
    condition: (p) => p.competences.hard.filter(skill => 
      ['React', 'Python', 'Node.js', 'TypeScript', 'Go', 'Kubernetes'].includes(skill)
    ).length >= 3,
    category: 'expertise'
  },
  {
    name: 'Design Thinking',
    condition: (p) => p.competences.hard.includes('UX Research') && 
                     p.competences.hard.includes('Design'),
    category: 'expertise'
  },
  {
    name: 'Data Expert',
    condition: (p) => p.competences.hard.filter(skill => 
      ['DataViz', 'Machine Learning', 'Analytics', 'SQL'].includes(skill)
    ).length >= 2,
    category: 'expertise'
  },
  {
    name: 'Fundraising Pro',
    condition: (p) => p.apporte.some(item => 
      item.toLowerCase().includes('fundraising') || 
      item.toLowerCase().includes('levée de fonds')
    ),
    category: 'expertise'
  },
  {
    name: 'Growth Hacker',
    condition: (p) => p.competences.hard.filter(skill => 
      ['Growth', 'Marketing', 'Analytics', 'A/B Testing'].includes(skill)
    ).length >= 2,
    category: 'expertise'
  }
];

/**
 * Génère automatiquement les badges pour un profil
 */
export const generateBadges = (profile: UserProfile): {
  personnalite: string[];
  comportement: string[];
  expertise: string[];
} => {
  const badges = {
    personnalite: [] as string[],
    comportement: [] as string[],
    expertise: [] as string[]
  };

  // Appliquer les règles de personnalité
  personalityBadgeRules.forEach(rule => {
    if (rule.condition(profile)) {
      badges.personnalite.push(rule.name);
    }
  });

  // Appliquer les règles comportementales
  behaviorBadgeRules.forEach(rule => {
    if (rule.condition(profile)) {
      badges.comportement.push(rule.name);
    }
  });

  // Appliquer les règles d'expertise
  expertiseBadgeRules.forEach(rule => {
    if (rule.condition(profile)) {
      badges.expertise.push(rule.name);
    }
  });

  // Limiter à 3 badges par catégorie pour éviter la surcharge
  badges.personnalite = badges.personnalite.slice(0, 3);
  badges.comportement = badges.comportement.slice(0, 3);
  badges.expertise = badges.expertise.slice(0, 3);

  return badges;
};

/**
 * Met à jour les badges de personnalité d'un profil
 */
export const updateProfileBadges = (profile: UserProfile): UserProfile => {
  const generatedBadges = generateBadges(profile);
  
  return {
    ...profile,
    badges: {
      ...profile.badges,
      personnalite: generatedBadges.personnalite
    }
  };
};

/**
 * Explique pourquoi un badge a été attribué
 */
export const explainBadge = (badgeName: string, profile: UserProfile): string => {
  const allRules = [...personalityBadgeRules, ...behaviorBadgeRules, ...expertiseBadgeRules];
  const rule = allRules.find(r => r.name === badgeName);
  
  if (!rule) return 'Badge non reconnu';

  // Explications personnalisées pour certains badges
  const explanations: Record<string, (p: UserProfile) => string> = {
    'Innovateur': (p) => `Score d'ouverture élevé (${p.big_five.ouverture}/100)`,
    'Fiable & structuré': (p) => `Score de consciencieusité élevé (${p.big_five.consciencieuse}/100)`,
    'Connecteur': (p) => `Extraversion élevée et organisation d'événements`,
    'Collaboratif': (p) => `Score d'agréabilité élevé (${p.big_five.agreabilite}/100)`,
    'Calme sous pression': (p) => `Stabilité émotionnelle élevée et ponctualité`,
    'Super actif': (p) => `${p.activite.signals.messages_envoyes} messages envoyés récemment`,
    'Ponctuel': (p) => `Aucun no-show et ${p.activite.signals.reponses} réponses`,
    'Expert Tech': (p) => `${p.competences.hard.filter(s => ['React', 'Python', 'Node.js'].includes(s)).length} compétences techniques avancées`
  };

  return explanations[badgeName]?.(profile) || 'Basé sur votre profil et activité';
};