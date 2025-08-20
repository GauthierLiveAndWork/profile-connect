import { ChatOpenAI } from "@langchain/openai";
import { UserProfile, MatchSuggestion } from "@/types/matching";

// Version simplifiée sans les imports LangChain complexes
interface CompatibilityResult {
  score: number;
  reasoning: string;
  strengths: string[];
  potential_collaboration: string;
}

/**
 * LangChain-powered intelligent matching system
 * Version simplifiée utilisant directement l'API OpenAI
 */
export class LangChainMatchingEngine {
  private llm: ChatOpenAI | null = null;
  private initialized = false;

  constructor(openaiApiKey?: string) {
    try {
      this.llm = new ChatOpenAI({
        modelName: "gpt-4o-mini",
        temperature: 0.3,
        openAIApiKey: openaiApiKey,
      });
      this.initialized = true;
    } catch (error) {
      console.warn("LangChain non disponible:", error);
    }
  }

  /**
   * Analyse sémantique simplifiée entre deux profils
   */
  async analyzeCompatibility(profileA: UserProfile, profileB: UserProfile): Promise<CompatibilityResult | null> {
    if (!this.initialized || !this.llm) return null;

    try {
      const prompt = `Analysez la compatibilité entre ces deux profils professionnels.
      
      PROFIL A:
      Nom: ${profileA.identite.prenom} ${profileA.identite.nom}
      Mission: ${profileA.mission_personnelle || "Non spécifié"}
      Secteur: ${profileA.secteur.join(", ")}
      Compétences offertes: ${profileA.apporte.join(", ")}
      Recherche: ${profileA.recherche.join(", ")}
      Valeurs: ${profileA.valeurs.join(", ")}
      
      PROFIL B:
      Nom: ${profileB.identite.prenom} ${profileB.identite.nom}
      Mission: ${profileB.mission_personnelle || "Non spécifié"}
      Secteur: ${profileB.secteur.join(", ")}
      Compétences offertes: ${profileB.apporte.join(", ")}
      Recherche: ${profileB.recherche.join(", ")}
      Valeurs: ${profileB.valeurs.join(", ")}
      
      Évaluez leur compatibilité sur une échelle de 0-100 et expliquez pourquoi.
      Répondez uniquement avec un JSON valide:
      {
        "score": <number>,
        "reasoning": "<explication courte>",
        "strengths": ["<point fort 1>", "<point fort 2>"],
        "potential_collaboration": "<type de collaboration recommandé>"
      }`;

      const result = await this.llm.invoke([{ role: "user", content: prompt }]);
      return JSON.parse(result.content as string);
    } catch (error) {
      console.warn("Erreur dans l'analyse LangChain:", error);
      return null;
    }
  }

  /**
   * Génère un insight personnalisé pour un match
   */
  async generatePersonalizedInsight(
    suggestion: MatchSuggestion,
    targetProfile: UserProfile
  ): Promise<string | null> {
    if (!this.initialized || !this.llm) return null;

    try {
      const prompt = `Générez un insight personnalisé pour expliquer pourquoi ces profils sont compatibles.
      
      Score de compatibilité: ${suggestion.compatibility_score}
      Raisons techniques: ${suggestion.reasons.join(", ")}
      Profil cible: ${targetProfile.identite.prenom} - ${targetProfile.identite.headline}
      
      Créez un insight personnalisé et actionnable en 1-2 phrases qui explique:
      1. Pourquoi ce match est intéressant
      2. Quelle action concrète prendre
      
      Répondez uniquement avec l'insight, sans formatage supplémentaire.`;

      const result = await this.llm.invoke([{ role: "user", content: prompt }]);
      return (result.content as string).trim();
    } catch (error) {
      console.warn("Erreur dans la génération d'insight:", error);
      return null;
    }
  }

  /**
   * Optimise une liste de suggestions avec l'IA LangChain
   */
  async optimizeMatches(
    user: UserProfile,
    suggestions: MatchSuggestion[],
    pool: UserProfile[]
  ): Promise<MatchSuggestion[]> {
    if (!this.initialized) return suggestions;

    console.log("Optimisation LangChain en cours...");
    const optimizedSuggestions: MatchSuggestion[] = [];

    // Traiter les suggestions par batch pour éviter la surcharge
    const batchSize = 3;
    for (let i = 0; i < Math.min(suggestions.length, batchSize); i++) {
      const suggestion = suggestions[i];
      const targetProfile = pool.find(p => p.user_id === suggestion.id);
      
      if (!targetProfile) {
        optimizedSuggestions.push(suggestion);
        continue;
      }

      try {
        // Analyse LangChain
        const [analysis, insight] = await Promise.all([
          this.analyzeCompatibility(user, targetProfile),
          this.generatePersonalizedInsight(suggestion, targetProfile)
        ]);

        if (analysis) {
          // Intégrer le score LangChain (pondération 30%)
          const enhancedScore = Math.round(
            0.7 * suggestion.compatibility_score + 0.3 * analysis.score
          );

          const enhancedReasons = [
            `LangChain: ${analysis.reasoning}`,
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
        console.warn(`Erreur LangChain pour ${suggestion.id}:`, error);
        optimizedSuggestions.push(suggestion);
      }
    }

    // Ajouter les suggestions restantes sans traitement LangChain
    optimizedSuggestions.push(...suggestions.slice(batchSize));

    console.log("Optimisation LangChain terminée");
    return optimizedSuggestions.sort((a, b) => b.compatibility_score - a.compatibility_score);
  }
}

// Instance singleton
export const langChainEngine = new LangChainMatchingEngine();