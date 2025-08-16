import { UserProfile, MatchSuggestion, ScoreComponents, MatchingWeights, DEFAULT_WEIGHTS } from '@/types/matching';

/**
 * Algorithme de matching hybride pour Live&Work
 */

// Utilitaires mathématiques
const jaccard = (setA: string[], setB: string[]): number => {
  const intersection = setA.filter(x => setB.includes(x)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
};

const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  if (vecA.length !== vecB.length) return 0;
  
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  
  return magnitudeA === 0 || magnitudeB === 0 ? 0 : dotProduct / (magnitudeA * magnitudeB);
};

const logistic = (x: number): number => 1 / (1 + Math.exp(-x));

const normalizeScore = (score: number): number => Math.max(0, Math.min(1, score));

// Calcul de distance géographique (formule de Haversine simplifiée)
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Calcul du score Big Five (similarité + complémentarité contextuelle)
 */
export const calculateBigFiveScore = (userA: UserProfile, userB: UserProfile): number => {
  const vecA = [
    userA.big_five.ouverture / 100,
    userA.big_five.consciencieuse / 100,
    userA.big_five.extraversion / 100,
    userA.big_five.agreabilite / 100,
    userA.big_five.stabilite_emotionnelle / 100
  ];
  
  const vecB = [
    userB.big_five.ouverture / 100,
    userB.big_five.consciencieuse / 100,
    userB.big_five.extraversion / 100,
    userB.big_five.agreabilite / 100,
    userB.big_five.stabilite_emotionnelle / 100
  ];

  // Similarité cosine de base
  const similarity = cosineSimilarity(vecA, vecB);
  
  // Complémentarité contextuelle pour certains traits
  const extraversionComplement = 1 - Math.abs(vecA[2] - vecB[2]);
  const agreabiliteComplement = 1 - Math.abs(vecA[3] - vecB[3]);
  
  // Mix similarité générale + complémentarité pour traits sociaux
  return normalizeScore(0.6 * similarity + 0.2 * extraversionComplement + 0.2 * agreabiliteComplement);
};

/**
 * Calcul du score de valeurs (Jaccard)
 */
export const calculateValuesScore = (userA: UserProfile, userB: UserProfile): number => {
  return jaccard(userA.valeurs, userB.valeurs);
};

/**
 * Calcul du score sectoriel
 */
export const calculateSectorScore = (userA: UserProfile, userB: UserProfile): number => {
  const commonSectors = userA.secteur.filter(s => userB.secteur.includes(s));
  if (commonSectors.length === 0) return 0;
  
  // Bonus pour secteurs de niche
  const nicheSectors = ['HealthTech', 'CleanTech', 'LegalTech'];
  const hasNicheOverlap = commonSectors.some(s => nicheSectors.includes(s));
  
  return hasNicheOverlap ? 1.0 : 0.8;
};

/**
 * Calcul du score de complémentarité des compétences
 */
export const calculateCompetenceScore = (userA: UserProfile, userB: UserProfile): number => {
  // Ce que A apporte correspond à ce que B recherche
  const supplyScoreAtoB = jaccard(userA.apporte, userB.recherche);
  
  // Ce que B apporte correspond à ce que A recherche
  const supplyScoreBtoA = jaccard(userB.apporte, userA.recherche);
  
  return (supplyScoreAtoB + supplyScoreBtoA) / 2;
};

/**
 * Calcul du score géographique
 */
export const calculateGeoScore = (userA: UserProfile, userB: UserProfile): number => {
  // Si l'un des deux accepte le remote
  if (userA.localisation.mobilite.remote || userB.localisation.mobilite.remote) {
    return 1.0;
  }
  
  const distance = calculateDistance(
    userA.localisation.lat, userA.localisation.lng,
    userB.localisation.lat, userB.localisation.lng
  );
  
  const maxRadius = Math.min(userA.localisation.mobilite.rayon_km, userB.localisation.mobilite.rayon_km);
  
  if (distance <= maxRadius) {
    return Math.exp(-distance / maxRadius);
  }
  
  return 0;
};

/**
 * Calcul du score de disponibilité
 */
export const calculateAvailabilityScore = (userA: UserProfile, userB: UserProfile): number => {
  const timeOverlap = jaccard(userA.disponibilite.plages_horaires, userB.disponibilite.plages_horaires);
  const formatOverlap = jaccard(userA.disponibilite.format, userB.disponibilite.format);
  
  return (timeOverlap + formatOverlap) / 2;
};

/**
 * Calcul du score comportemental (CTR, taux de réponse...)
 */
export const calculateBehaviorScore = (userA: UserProfile, userB: UserProfile): number => {
  const signalsA = userA.activite.signals;
  const signalsB = userB.activite.signals;
  
  // Calcul du taux d'engagement moyen
  const engagementA = signalsA.reponses > 0 ? signalsA.reponses / (signalsA.vues + 1) : 0.5;
  const engagementB = signalsB.reponses > 0 ? signalsB.reponses / (signalsB.vues + 1) : 0.5;
  
  // Pénalité pour no-show
  const reliabilityA = Math.max(0, 1 - signalsA.no_show * 0.1);
  const reliabilityB = Math.max(0, 1 - signalsB.no_show * 0.1);
  
  return ((engagementA + engagementB) / 2) * ((reliabilityA + reliabilityB) / 2);
};

/**
 * Calcul du score de fraîcheur
 */
export const calculateFreshnessScore = (userB: UserProfile): number => {
  const lastConnection = new Date(userB.activite.derniere_connexion);
  const now = new Date();
  const daysSinceLastConnection = (now.getTime() - lastConnection.getTime()) / (1000 * 60 * 60 * 24);
  
  // Décroissance exponentielle sur 30 jours
  return Math.exp(-daysSinceLastConnection / 30);
};

/**
 * Filtrage dur des candidats
 */
export const filterCandidates = (user: UserProfile, pool: UserProfile[]): UserProfile[] => {
  return pool.filter(candidate => {
    // Pas soi-même
    if (candidate.user_id === user.user_id) return false;
    
    // Utilisateur ouvert aux matches
    if (!candidate.etat.ouvert_aux_matches) return false;
    
    // Pas bloqué
    if (user.etat.bloque_ids.includes(candidate.user_id)) return false;
    if (candidate.etat.bloque_ids.includes(user.user_id)) return false;
    
    // Au moins une langue en commun
    const hasCommonLanguage = user.identite.langues.some(lang => 
      candidate.identite.langues.includes(lang)
    );
    if (!hasCommonLanguage) return false;
    
    // Respect rayon géographique si pas de remote
    if (!user.localisation.mobilite.remote && !candidate.localisation.mobilite.remote) {
      const distance = calculateDistance(
        user.localisation.lat, user.localisation.lng,
        candidate.localisation.lat, candidate.localisation.lng
      );
      const maxRadius = Math.max(user.localisation.mobilite.rayon_km, candidate.localisation.mobilite.rayon_km);
      if (distance > maxRadius) return false;
    }
    
    // Au moins un format ou créneau compatible
    const hasFormatOverlap = user.disponibilite.format.some(format => 
      candidate.disponibilite.format.includes(format)
    );
    const hasTimeOverlap = user.disponibilite.plages_horaires.some(time => 
      candidate.disponibilite.plages_horaires.includes(time)
    );
    
    if (!hasFormatOverlap && !hasTimeOverlap) return false;
    
    return true;
  });
};

/**
 * Calcul du score total de compatibilité
 */
export const calculateCompatibilityScore = (
  userA: UserProfile, 
  userB: UserProfile, 
  weights: MatchingWeights = DEFAULT_WEIGHTS
): { score: number; components: ScoreComponents } => {
  const components: ScoreComponents = {
    big5: calculateBigFiveScore(userA, userB),
    valeurs: calculateValuesScore(userA, userB),
    secteur: calculateSectorScore(userA, userB),
    competences: calculateCompetenceScore(userA, userB),
    localisation: calculateGeoScore(userA, userB),
    disponibilite: calculateAvailabilityScore(userA, userB),
    comportement: calculateBehaviorScore(userA, userB),
    fraicheur: calculateFreshnessScore(userB),
  };
  
  // Somme pondérée
  const weightedSum = Object.keys(components).reduce((sum, key) => {
    const componentKey = key as keyof ScoreComponents;
    return sum + weights[componentKey] * components[componentKey];
  }, 0);
  
  // Application de la fonction logistique et normalisation sur 0-100
  const score = Math.round(logistic(weightedSum * 4 - 2) * 100);
  
  return { score, components };
};

/**
 * Construction des raisons explicables
 */
export const buildReasons = (userA: UserProfile, userB: UserProfile, components: ScoreComponents): string[] => {
  const reasons: string[] = [];
  
  // Valeurs communes
  const commonValues = userA.valeurs.filter(v => userB.valeurs.includes(v));
  if (commonValues.length >= 2) {
    reasons.push(`${commonValues.length} valeurs en commun : ${commonValues.slice(0, 3).join(', ')}`);
  }
  
  // Complémentarité compétences
  const supplyOverlap = userA.apporte.filter(a => userB.recherche.includes(a));
  const demandOverlap = userB.apporte.filter(a => userA.recherche.includes(a));
  if (supplyOverlap.length > 0 || demandOverlap.length > 0) {
    const bestMatch = supplyOverlap[0] || demandOverlap[0];
    reasons.push(`Complémentarité : ${bestMatch}`);
  }
  
  // Proximité géographique
  if (components.localisation > 0.8) {
    const distance = calculateDistance(
      userA.localisation.lat, userA.localisation.lng,
      userB.localisation.lat, userB.localisation.lng
    );
    if (distance < 10) {
      reasons.push(`À ${Math.round(distance)} km`);
    } else if (userA.localisation.mobilite.remote || userB.localisation.mobilite.remote) {
      reasons.push('Compatible avec le télétravail');
    }
  }
  
  // Disponibilités communes
  const commonTimeSlots = userA.disponibilite.plages_horaires.filter(t => 
    userB.disponibilite.plages_horaires.includes(t)
  );
  if (commonTimeSlots.length > 0) {
    const timeSlot = commonTimeSlots[0].replace('_', ' ');
    reasons.push(`Disponible ${timeSlot}`);
  }
  
  // Secteur commun
  const commonSectors = userA.secteur.filter(s => userB.secteur.includes(s));
  if (commonSectors.length > 0) {
    reasons.push(`Secteur ${commonSectors[0]}`);
  }
  
  // Compatibilité personnalité
  if (components.big5 > 0.7) {
    reasons.push('Personnalités complémentaires');
  }
  
  return reasons.slice(0, 4); // Max 4 raisons
};

/**
 * Ré-ordonnancement avec MMR (Maximal Marginal Relevance)
 */
export const rerankWithMMR = (
  candidates: MatchSuggestion[], 
  lambda: number = 0.7
): MatchSuggestion[] => {
  if (candidates.length <= 1) return candidates;
  
  const reranked: MatchSuggestion[] = [];
  const remaining = [...candidates];
  
  // Commencer par le meilleur score
  const best = remaining.reduce((prev, current) => 
    prev.compatibility_score > current.compatibility_score ? prev : current
  );
  reranked.push(best);
  remaining.splice(remaining.indexOf(best), 1);
  
  // Sélection itérative avec MMR
  while (remaining.length > 0 && reranked.length < 12) {
    let bestCandidate = remaining[0];
    let bestMMRScore = -1;
    
    for (const candidate of remaining) {
      // Score de pertinence (normalisé)
      const relevance = candidate.compatibility_score / 100;
      
      // Score de diversité (secteurs différents)
      const diversity = Math.min(
        ...reranked.map(selected => {
          const sectorsA = candidate.profile_preview.secteur;
          const sectorsB = selected.profile_preview.secteur;
          return 1 - jaccard(sectorsA, sectorsB);
        })
      );
      
      const mmrScore = lambda * relevance + (1 - lambda) * diversity;
      
      if (mmrScore > bestMMRScore) {
        bestMMRScore = mmrScore;
        bestCandidate = candidate;
      }
    }
    
    reranked.push(bestCandidate);
    remaining.splice(remaining.indexOf(bestCandidate), 1);
  }
  
  return reranked;
};

/**
 * Injection d'exploration (ε-greedy)
 */
export const injectExploration = (
  ranked: MatchSuggestion[], 
  epsilon: number = 0.2
): MatchSuggestion[] => {
  const explorationCount = Math.floor(ranked.length * epsilon);
  const exploitation = ranked.slice(0, ranked.length - explorationCount);
  const exploration = ranked.slice(-explorationCount);
  
  // Mélanger les suggestions d'exploration
  for (let i = exploration.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [exploration[i], exploration[j]] = [exploration[j], exploration[i]];
  }
  
  return [...exploitation, ...exploration];
};