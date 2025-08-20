import { ChatOpenAI } from "@langchain/openai";
import { UserProfile, MatchSuggestion } from "@/types/matching";

// Version simplifiée sans les imports LangChain complexes
interface CompatibilityResult {
  score: number;
  reasoning: string;
  strengths: string[];
  potential_collaboration: string;
}
import { UserProfile, MatchSuggestion } from "@/types/matching";

/**
 * LangChain-powered intelligent matching system
 * Utilise des LLMs pour une analyse sémantique avancée des profils
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

  private initializeChains() {
    // Chaîne pour l'analyse de compatibilité sémantique
    const compatibilityPrompt = PromptTemplate.fromTemplate(`
      Analysez la compatibilité entre ces deux profils professionnels.
      
      PROFIL A:
      Nom: {profileA_name}
      Mission: {profileA_mission}
      Secteur: {profileA_sector}
      Compétences offertes: {profileA_offers}
      Recherche: {profileA_seeks}
      Valeurs: {profileA_values}
      
      PROFIL B:
      Nom: {profileB_name}
      Mission: {profileB_mission}
      Secteur: {profileB_sector}
      Compétences offertes: {profileB_offers}
      Recherche: {profileB_seeks}
      Valeurs: {profileB_values}
      
      Évaluez leur compatibilité sur une échelle de 0-100 et expliquez pourquoi.
      Répondez uniquement avec un JSON valide:
      {{
        "score": <number>,
        "reasoning": "<explication courte>",
        "strengths": ["<point fort 1>", "<point fort 2>"],
        "potential_collaboration": "<type de collaboration recommandé>"
      }}
    `);

    // Chaîne pour générer des insights personnalisés
    const insightPrompt = PromptTemplate.fromTemplate(`
      Générez des insights personnalisés pour expliquer pourquoi ces profils sont compatibles.
      
      Données du match:
      Score de compatibilité: {compatibility_score}
      Raisons techniques: {technical_reasons}
      Profil cible: {target_profile}
      
      Créez un insight personnalisé et actionnable en 1-2 phrases qui explique:
      1. Pourquoi ce match est intéressant
      2. Quelle action concrète prendre
      
      Répondez uniquement avec l'insight, sans formatage supplémentaire.
    `);

    this.compatibilityChain = RunnableSequence.from([
      compatibilityPrompt,
      this.llm,
      new StringOutputParser(),
    ]);

    this.insightChain = RunnableSequence.from([
      insightPrompt,
      this.llm,
      new StringOutputParser(),
    ]);

    this.initialized = true;
  }

  /**
   * Analyse sémantique approfondie entre deux profils
   */
  async analyzeCompatibility(profileA: UserProfile, profileB: UserProfile): Promise<{
    score: number;
    reasoning: string;
    strengths: string[];
    potential_collaboration: string;
  } | null> {
    if (!this.initialized) return null;

    try {
      const result = await this.compatibilityChain.invoke({
        profileA_name: `${profileA.identite.prenom} ${profileA.identite.nom}`,
        profileA_mission: profileA.mission_personnelle || "Non spécifié",
        profileA_sector: profileA.secteur.join(", "),
        profileA_offers: profileA.apporte.join(", "),
        profileA_seeks: profileA.recherche.join(", "),
        profileA_values: profileA.valeurs.join(", "),
        profileB_name: `${profileB.identite.prenom} ${profileB.identite.nom}`,
        profileB_mission: profileB.mission_personnelle || "Non spécifié",
        profileB_sector: profileB.secteur.join(", "),
        profileB_offers: profileB.apporte.join(", "),
        profileB_seeks: profileB.recherche.join(", "),
        profileB_values: profileB.valeurs.join(", "),
      });

      return JSON.parse(result);
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
    if (!this.initialized) return null;

    try {
      const insight = await this.insightChain.invoke({
        compatibility_score: suggestion.compatibility_score,
        technical_reasons: suggestion.reasons.join(", "),
        target_profile: `${targetProfile.identite.prenom} - ${targetProfile.identite.headline}`,
      });

      return insight.trim();
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