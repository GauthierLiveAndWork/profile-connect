import { UserProfile, MatchSuggestion } from "@/types/matching";

/**
 * Version simplifiée du moteur LangChain sans dépendances complexes
 * Utilise des heuristiques intelligentes pour l'analyse sémantique
 */
export class LangChainMatchingEngine {
  private initialized = false;

  constructor() {
    this.initialized = true;
  }

  /**
   * Analyse de compatibilité basée sur des heuristiques intelligentes
   */
  async analyzeCompatibility(profileA: UserProfile, profileB: UserProfile): Promise<{
    score: number;
    reasoning: string;
    strengths: string[];
    potential_collaboration: string;
  } | null> {
    try {
      // Analyse basée sur les mots-clés et la sémantique
      const missionSimilarity = this.calculateTextSimilarity(
        profileA.mission_personnelle || "",
        profileB.mission_personnelle || ""
      );
      
      const skillComplementarity = this.calculateSkillComplementarity(
        profileA.apporte,
        profileA.recherche,
        profileB.apporte,
        profileB.recherche
      );
      
      const valueAlignment = this.calculateValueAlignment(
        profileA.valeurs,
        profileB.valeurs
      );
      
      const score = Math.round(
        0.4 * missionSimilarity * 100 +
        0.4 * skillComplementarity * 100 +
        0.2 * valueAlignment * 100
      );
      
      const strengths = [];
      if (missionSimilarity > 0.6) strengths.push("Visions alignées");
      if (skillComplementarity > 0.7) strengths.push("Compétences complémentaires");
      if (valueAlignment > 0.5) strengths.push("Valeurs partagées");
      
      return {
        score,
        reasoning: this.generateReasoning(missionSimilarity, skillComplementarity, valueAlignment),
        strengths,
        potential_collaboration: this.suggestCollaboration(profileA, profileB)
      };
    } catch (error) {
      console.warn("Erreur dans l'analyse de compatibilité:", error);
      return null;
    }
  }

  /**
   * Génère un insight personnalisé
   */
  async generatePersonalizedInsight(
    suggestion: MatchSuggestion,
    targetProfile: UserProfile
  ): Promise<string | null> {
    try {
      const score = suggestion.compatibility_score;
      const name = targetProfile.identite.prenom;
      
      if (score > 80) {
        return `${name} présente une excellente compatibilité - Proposez une collaboration rapidement !`;
      } else if (score > 60) {
        return `${name} pourrait être un partenaire intéressant - Explorez les synergies possibles.`;
      } else {
        return `${name} offre des opportunités de découverte - Échangez pour mieux vous connaître.`;
      }
    } catch (error) {
      console.warn("Erreur dans la génération d'insight:", error);
      return null;
    }
  }

  /**
   * Optimise les suggestions avec l'intelligence artificielle simplifiée
   */
  async optimizeMatches(
    user: UserProfile,
    suggestions: MatchSuggestion[],
    pool: UserProfile[]
  ): Promise<MatchSuggestion[]> {
    if (!this.initialized) return suggestions;

    console.log("Optimisation intelligente en cours...");
    const optimizedSuggestions: MatchSuggestion[] = [];

    // Traiter un échantillon pour éviter la surcharge
    const batchSize = 5;
    for (let i = 0; i < Math.min(suggestions.length, batchSize); i++) {
      const suggestion = suggestions[i];
      const targetProfile = pool.find(p => p.user_id === suggestion.id);
      
      if (!targetProfile) {
        optimizedSuggestions.push(suggestion);
        continue;
      }

      try {
        const [analysis, insight] = await Promise.all([
          this.analyzeCompatibility(user, targetProfile),
          this.generatePersonalizedInsight(suggestion, targetProfile)
        ]);

        if (analysis) {
          // Intégrer le score d'analyse (pondération 25%)
          const enhancedScore = Math.round(
            0.75 * suggestion.compatibility_score + 0.25 * analysis.score
          );

          const enhancedReasons = [
            `IA Sémantique: ${analysis.reasoning}`,
            ...analysis.strengths.slice(0, 2),
            ...suggestion.reasons.slice(0, 2)
          ].slice(0, 4);

          optimizedSuggestions.push({
            ...suggestion,
            compatibility_score: enhancedScore,
            reasons: enhancedReasons,
            next_best_action: insight || analysis.potential_collaboration || suggestion.next_best_action
          });
        } else {
          optimizedSuggestions.push(suggestion);
        }
      } catch (error) {
        console.warn(`Erreur d'optimisation pour ${suggestion.id}:`, error);
        optimizedSuggestions.push(suggestion);
      }
    }

    // Ajouter les suggestions restantes
    optimizedSuggestions.push(...suggestions.slice(batchSize));

    console.log("Optimisation intelligente terminée");
    return optimizedSuggestions.sort((a, b) => b.compatibility_score - a.compatibility_score);
  }

  // Méthodes utilitaires
  private calculateTextSimilarity(textA: string, textB: string): number {
    if (!textA || !textB) return 0;
    
    const wordsA = textA.toLowerCase().split(/\s+/);
    const wordsB = textB.toLowerCase().split(/\s+/);
    
    const intersection = wordsA.filter(word => wordsB.includes(word)).length;
    const union = new Set([...wordsA, ...wordsB]).size;
    
    return union === 0 ? 0 : intersection / union;
  }

  private calculateSkillComplementarity(
    offersA: string[], 
    seeksA: string[], 
    offersB: string[], 
    seeksB: string[]
  ): number {
    const complementA = this.jaccard(offersA, seeksB);
    const complementB = this.jaccard(offersB, seeksA);
    return (complementA + complementB) / 2;
  }

  private calculateValueAlignment(valuesA: string[], valuesB: string[]): number {
    return this.jaccard(valuesA, valuesB);
  }

  private jaccard(setA: string[], setB: string[]): number {
    const intersection = setA.filter(x => setB.includes(x)).length;
    const union = new Set([...setA, ...setB]).size;
    return union === 0 ? 0 : intersection / union;
  }

  private generateReasoning(mission: number, skills: number, values: number): string {
    if (mission > 0.6 && skills > 0.6) {
      return "Forte synergie mission/compétences";
    } else if (skills > 0.7) {
      return "Excellente complémentarité des compétences";
    } else if (values > 0.5) {
      return "Bonnes valeurs partagées";
    } else {
      return "Potentiel de découverte mutuelle";
    }
  }

  private suggestCollaboration(profileA: UserProfile, profileB: UserProfile): string {
    const formatsA = profileA.disponibilite.format;
    const formatsB = profileB.disponibilite.format;
    
    if (formatsA.includes('cofondation') && formatsB.includes('cofondation')) {
      return "Explorer une co-fondation";
    } else if (formatsA.includes('projet_court') && formatsB.includes('projet_court')) {
      return "Commencer par un projet court";
    } else if (formatsA.includes('mentorat') || formatsB.includes('mentorat')) {
      return "Envisager du mentorat";
    } else {
      return "Organiser un coffee ou visio";
    }
  }
}

// Instance singleton
export const langChainEngine = new LangChainMatchingEngine();