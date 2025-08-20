import { pipeline } from '@huggingface/transformers';
import { UserProfile, MatchSuggestion } from '@/types/matching';

interface EmbeddingCache {
  [profileId: string]: Float32Array;
}

interface SentimentResult {
  label: string;
  score: number;
}

class AIMatchingOptimizer {
  private embedPipeline: any = null;
  private sentimentPipeline: any = null;
  private embeddingCache: EmbeddingCache = {};
  private initialized = false;

  /**
   * Initialise les modèles IA (une seule fois)
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('Initialisation des modèles IA pour le matching...');
      
      // Modèle d'embeddings pour l'analyse sémantique des profils
      this.embedPipeline = await pipeline(
        'feature-extraction',
        'mixedbread-ai/mxbai-embed-xsmall-v1',
        { device: 'webgpu' }
      );

      // Modèle d'analyse de sentiment pour les projets/bios
      this.sentimentPipeline = await pipeline(
        'sentiment-analysis',
        'cardiffnlp/twitter-roberta-base-sentiment-latest'
      );

      this.initialized = true;
      console.log('Modèles IA initialisés avec succès');
    } catch (error) {
      console.warn('Erreur lors de l\'initialisation des modèles IA:', error);
      // Fallback gracieux sans IA
    }
  }

  /**
   * Génère l'embedding d'un profil utilisateur
   */
  private async generateProfileEmbedding(profile: UserProfile): Promise<Float32Array | null> {
    if (!this.embedPipeline) return null;

    const cacheKey = `${profile.user_id}_${profile.version}`;
    if (this.embeddingCache[cacheKey]) {
      return this.embeddingCache[cacheKey];
    }

    try {
      // Construire le texte représentatif du profil
      const profileText = this.buildProfileText(profile);
      
      // Générer l'embedding
      const result = await this.embedPipeline(profileText, {
        pooling: 'mean',
        normalize: true
      });

      const embedding = new Float32Array(result.data);
      this.embeddingCache[cacheKey] = embedding;
      
      return embedding;
    } catch (error) {
      console.warn('Erreur lors de la génération d\'embedding:', error);
      return null;
    }
  }

  /**
   * Construit un texte représentatif du profil pour l'IA
   */
  private buildProfileText(profile: UserProfile): string {
    const parts = [
      profile.identite.headline,
      profile.mission_personnelle,
      profile.projets_en_cours.join(', '),
      profile.apporte.join(', '),
      profile.recherche.join(', '),
      profile.valeurs.join(', '),
      profile.secteur.join(', ')
    ].filter(Boolean);

    return parts.join('. ').substring(0, 512); // Limite pour les modèles
  }

  /**
   * Calcule la similarité sémantique entre deux profils
   */
  async calculateSemanticSimilarity(profileA: UserProfile, profileB: UserProfile): Promise<number> {
    try {
      const embeddingA = await this.generateProfileEmbedding(profileA);
      const embeddingB = await this.generateProfileEmbedding(profileB);

      if (!embeddingA || !embeddingB) {
        return 0.5; // Score neutre si pas d'embedding
      }

      // Similarité cosine entre les embeddings
      return this.cosineSimilarity(embeddingA, embeddingB);
    } catch (error) {
      console.warn('Erreur lors du calcul de similarité sémantique:', error);
      return 0.5;
    }
  }

  /**
   * Analyse le sentiment des projets pour détecter l'alignement émotionnel
   */
  async analyzeProjectSentiment(profile: UserProfile): Promise<SentimentResult | null> {
    if (!this.sentimentPipeline) return null;

    try {
      const projectText = [
        profile.mission_personnelle,
        ...profile.projets_en_cours
      ].join('. ');

      if (!projectText.trim()) return null;

      const result = await this.sentimentPipeline(projectText.substring(0, 512));
      return Array.isArray(result) ? result[0] : result;
    } catch (error) {
      console.warn('Erreur lors de l\'analyse de sentiment:', error);
      return null;
    }
  }

  /**
   * Score IA qui combine similarité sémantique et alignement émotionnel
   */
  async calculateAIScore(userA: UserProfile, userB: UserProfile): Promise<number> {
    try {
      // Similarité sémantique des profils
      const semanticSimilarity = await this.calculateSemanticSimilarity(userA, userB);
      
      // Analyse des sentiments pour alignement émotionnel
      const sentimentA = await this.analyzeProjectSentiment(userA);
      const sentimentB = await this.analyzeProjectSentiment(userB);
      
      let emotionalAlignment = 0.5; // Score neutre par défaut
      
      if (sentimentA && sentimentB) {
        // Alignement si même polarité émotionnelle
        const bothPositive = sentimentA.label === 'positive' && sentimentB.label === 'positive';
        const bothNeutral = sentimentA.label === 'neutral' && sentimentB.label === 'neutral';
        
        if (bothPositive || bothNeutral) {
          emotionalAlignment = Math.min(sentimentA.score, sentimentB.score);
        } else {
          emotionalAlignment = 0.3; // Pénalité pour désalignement
        }
      }

      // Combinaison pondérée
      return 0.7 * semanticSimilarity + 0.3 * emotionalAlignment;
    } catch (error) {
      console.warn('Erreur lors du calcul du score IA:', error);
      return 0.5;
    }
  }

  /**
   * Optimise les suggestions de matching avec l'IA
   */
  async optimizeMatches(
    user: UserProfile,
    suggestions: MatchSuggestion[],
    pool: UserProfile[]
  ): Promise<MatchSuggestion[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      console.log('Optimisation IA des matches en cours...');
      
      // Calculer les scores IA pour chaque suggestion
      const optimizedSuggestions = await Promise.all(
        suggestions.map(async (suggestion) => {
          const targetProfile = pool.find(p => p.user_id === suggestion.id);
          if (!targetProfile) return suggestion;

          const aiScore = await this.calculateAIScore(user, targetProfile);
          
          // Intégrer le score IA dans le score de compatibilité
          const enhancedScore = Math.round(
            0.7 * suggestion.compatibility_score + 0.3 * (aiScore * 100)
          );

          // Ajouter une raison IA si le score est élevé
          const enhancedReasons = [...suggestion.reasons];
          if (aiScore > 0.8) {
            enhancedReasons.unshift('IA : Forte compatibilité détectée');
          } else if (aiScore > 0.6) {
            enhancedReasons.push('IA : Bon alignement sémantique');
          }

          return {
            ...suggestion,
            compatibility_score: enhancedScore,
            reasons: enhancedReasons.slice(0, 4) // Garder max 4 raisons
          };
        })
      );

      // Re-trier par score optimisé
      const reranked = optimizedSuggestions.sort(
        (a, b) => b.compatibility_score - a.compatibility_score
      );

      console.log('Optimisation IA terminée');
      return reranked;
    } catch (error) {
      console.warn('Erreur lors de l\'optimisation IA:', error);
      return suggestions; // Fallback vers suggestions originales
    }
  }

  /**
   * Détecte les profils potentiellement intéressants ignorés par l'algorithme classique
   */
  async discoverHiddenGems(
    user: UserProfile,
    pool: UserProfile[],
    existingSuggestions: MatchSuggestion[]
  ): Promise<UserProfile[]> {
    if (!this.initialized) return [];

    try {
      const existingIds = new Set(existingSuggestions.map(s => s.id));
      const unmatched = pool.filter(p => 
        !existingIds.has(p.user_id) && 
        p.user_id !== user.user_id &&
        p.etat.ouvert_aux_matches
      );

      const hiddenGems: { profile: UserProfile; score: number }[] = [];

      // Tester un échantillon pour éviter la surcharge
      const sample = unmatched.slice(0, 20);
      
      for (const profile of sample) {
        const aiScore = await this.calculateAIScore(user, profile);
        if (aiScore > 0.75) {
          hiddenGems.push({ profile, score: aiScore });
        }
      }

      return hiddenGems
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(gem => gem.profile);
    } catch (error) {
      console.warn('Erreur lors de la découverte de profils cachés:', error);
      return [];
    }
  }

  /**
   * Calcul de similarité cosine
   */
  private cosineSimilarity(vecA: Float32Array, vecB: Float32Array): number {
    if (vecA.length !== vecB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (normA * normB);
  }

  /**
   * Nettoie le cache pour libérer la mémoire
   */
  clearCache(): void {
    this.embeddingCache = {};
  }
}

// Instance singleton
export const aiMatchingOptimizer = new AIMatchingOptimizer();