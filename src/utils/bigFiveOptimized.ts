import { BigFiveScores } from '@/types/profile';

// Configuration des couleurs pour chaque dimension
export const BIG_FIVE_COLORS = {
  openness: '#8b5cf6', // Violet - Créativité
  conscientiousness: '#06b6d4', // Cyan - Fiabilité
  extraversion: '#10b981', // Vert - Énergie sociale
  agreeableness: '#f59e0b', // Orange - Chaleur humaine
  emotional_stability: '#ef4444', // Rouge - Force émotionnelle
} as const;

// Interprétations personnalisées basées sur les scores
export function getBigFiveInterpretation(dimension: keyof BigFiveScores, score: number): string {
  const normalizedScore = (score / 5) * 100; // Convertir en pourcentage
  
  const interpretations = {
    openness: {
      high: "Esprit très curieux et créatif, ouvert aux nouvelles expériences",
      medium_high: "Créatif et ouvert au changement, apprécie la nouveauté",
      medium: "Équilibre entre tradition et innovation",
      medium_low: "Préfère les approches éprouvées et la stabilité",
      low: "Valorise la tradition et les méthodes conventionnelles"
    },
    conscientiousness: {
      high: "Extrêmement organisé, fiable et orienté objectifs",
      medium_high: "Discipliné et méthodique dans ses approches",
      medium: "Équilibre entre spontanéité et organisation",
      medium_low: "Préfère la flexibilité à la planification rigide",
      low: "Spontané et adaptable, moins porté sur la planification"
    },
    extraversion: {
      high: "Très sociable, énergique et à l'aise en groupe",
      medium_high: "Sociable et expressif, aime les interactions",
      medium: "Sociable mais apprécie aussi la réflexion individuelle",
      medium_low: "Préfère les interactions en petit comité",
      low: "Introverti, préfère la réflexion solitaire"
    },
    agreeableness: {
      high: "Extrêmement bienveillant, coopératif et empathique",
      medium_high: "Collaboratif et soucieux du bien-être d'autrui",
      medium: "Équilibre entre coopération et affirmation de soi",
      medium_low: "Direct dans ses communications, moins influençable",
      low: "Franc et indépendant, privilégie l'efficacité"
    },
    emotional_stability: {
      high: "Très calme et résilient face au stress et aux défis",
      medium_high: "Géré les situations difficiles avec sérénité",
      medium: "Équilibre émotionnel avec des réactions naturelles",
      medium_low: "Sensible aux changements et au stress",
      low: "Réactif émotionnellement, expressif dans ses ressentis"
    }
  };

  let level: 'high' | 'medium_high' | 'medium' | 'medium_low' | 'low';
  
  if (normalizedScore >= 80) level = 'high';
  else if (normalizedScore >= 65) level = 'medium_high';
  else if (normalizedScore >= 35) level = 'medium';
  else if (normalizedScore >= 20) level = 'medium_low';
  else level = 'low';

  return interpretations[dimension][level];
}

// Génération automatique de badges basés sur le profil Big Five
export function generateBigFiveBadges(scores: BigFiveScores): string[] {
  const badges: string[] = [];
  const normalizedScores = {
    openness: (scores.openness / 5) * 100,
    conscientiousness: (scores.conscientiousness / 5) * 100,
    extraversion: (scores.extraversion / 5) * 100,
    agreeableness: (scores.agreeableness / 5) * 100,
    emotional_stability: (scores.emotional_stability / 5) * 100,
  };

  // Badges basés sur les scores élevés (>= 75%)
  if (normalizedScores.openness >= 75) {
    badges.push(normalizedScores.conscientiousness >= 75 ? "Innovateur Structuré" : "Innovateur");
  }
  
  if (normalizedScores.extraversion >= 75 && normalizedScores.agreeableness >= 75) {
    badges.push("Leader Bienveillant");
  } else if (normalizedScores.extraversion >= 75) {
    badges.push("Énergiseur");
  }
  
  if (normalizedScores.agreeableness >= 75) {
    badges.push("Collaboratif");
  }
  
  if (normalizedScores.emotional_stability >= 75) {
    badges.push("Calme sous pression");
  }
  
  if (normalizedScores.conscientiousness >= 75) {
    badges.push(normalizedScores.emotional_stability >= 75 ? "Pilier de confiance" : "Organisateur");
  }

  // Badges pour combinaisons spéciales
  if (normalizedScores.openness >= 70 && normalizedScores.extraversion >= 70) {
    badges.push("Catalyseur d'idées");
  }
  
  if (normalizedScores.conscientiousness >= 70 && normalizedScores.agreeableness >= 70) {
    badges.push("Coordinateur fiable");
  }

  // Badge par défaut si aucun score élevé
  if (badges.length === 0) {
    const highest = Math.max(...Object.values(normalizedScores));
    const highestDimension = Object.keys(normalizedScores).find(
      key => normalizedScores[key as keyof typeof normalizedScores] === highest
    ) as keyof typeof normalizedScores;
    
    const defaultBadges = {
      openness: "Esprit ouvert",
      conscientiousness: "Méthodique",
      extraversion: "Sociable",
      agreeableness: "Bienveillant",
      emotional_stability: "Équilibré"
    };
    
    badges.push(defaultBadges[highestDimension]);
  }

  return badges.slice(0, 3); // Limiter à 3 badges maximum
}

// Calcul de compatibilité pour le matching
export function calculateCompatibility(userScores: BigFiveScores, targetScores: BigFiveScores): number {
  const weights = {
    openness: 0.2,
    conscientiousness: 0.15,
    extraversion: 0.25,
    agreeableness: 0.25,
    emotional_stability: 0.15
  };

  let totalCompatibility = 0;
  let totalWeight = 0;

  Object.keys(userScores).forEach(dimension => {
    const key = dimension as keyof BigFiveScores;
    const userScore = userScores[key];
    const targetScore = targetScores[key];
    
    // Calcul de similarité (plus les scores sont proches, plus la compatibilité est élevée)
    const similarity = 1 - Math.abs(userScore - targetScore) / 5;
    const weightedSimilarity = similarity * weights[key];
    
    totalCompatibility += weightedSimilarity;
    totalWeight += weights[key];
  });

  return Math.round((totalCompatibility / totalWeight) * 100);
}

// Recommandations d'événements basées sur le profil
export function getEventRecommendations(scores: BigFiveScores): string[] {
  const recommendations: string[] = [];
  const normalizedScores = {
    openness: (scores.openness / 5) * 100,
    conscientiousness: (scores.conscientiousness / 5) * 100,
    extraversion: (scores.extraversion / 5) * 100,
    agreeableness: (scores.agreeableness / 5) * 100,
    emotional_stability: (scores.emotional_stability / 5) * 100,
  };

  // Recommandations basées sur l'ouverture
  if (normalizedScores.openness >= 70) {
    recommendations.push("Atelier créatif", "Conférence innovation", "Workshop design thinking");
  }

  // Recommandations basées sur l'extraversion
  if (normalizedScores.extraversion >= 70) {
    recommendations.push("Networking Startups", "Soirée communautaire", "Pitch session");
  } else if (normalizedScores.extraversion <= 40) {
    recommendations.push("Groupe de lecture", "Session coworking silencieux", "Mentoring 1-to-1");
  }

  // Recommandations basées sur l'agréabilité
  if (normalizedScores.agreeableness >= 70) {
    recommendations.push("Projet collaboratif", "Initiative solidaire", "Team building");
  }

  // Recommandations basées sur la conscienciosité
  if (normalizedScores.conscientiousness >= 70) {
    recommendations.push("Formation productivité", "Atelier planification", "Groupe de travail structuré");
  }

  // Éliminer les doublons et limiter à 4 recommandations
  return [...new Set(recommendations)].slice(0, 4);
}

// Export du profil Big Five complet au format JSON demandé
export function exportBigFiveProfile(
  scores: BigFiveScores, 
  confidentiality: 'public' | 'visible_amis' | 'prive' = 'visible_amis'
) {
  const profile = {
    big_five: {
      ouverture: {
        score: Math.round((scores.openness / 5) * 100),
        interpretation: getBigFiveInterpretation('openness', scores.openness)
      },
      consciencieuse: {
        score: Math.round((scores.conscientiousness / 5) * 100),
        interpretation: getBigFiveInterpretation('conscientiousness', scores.conscientiousness)
      },
      extraversion: {
        score: Math.round((scores.extraversion / 5) * 100),
        interpretation: getBigFiveInterpretation('extraversion', scores.extraversion)
      },
      agreabilite: {
        score: Math.round((scores.agreeableness / 5) * 100),
        interpretation: getBigFiveInterpretation('agreeableness', scores.agreeableness)
      },
      stabilite_emotionnelle: {
        score: Math.round((scores.emotional_stability / 5) * 100),
        interpretation: getBigFiveInterpretation('emotional_stability', scores.emotional_stability)
      }
    },
    badges: generateBigFiveBadges(scores),
    matchmaking: {
      compatibilite_membres: "En cours de calcul...", // Sera calculé dynamiquement
      recommandations_evenements: getEventRecommendations(scores)
    },
    confidentialite: confidentiality
  };

  return profile;
}