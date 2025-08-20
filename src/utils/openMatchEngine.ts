import { UserProfile, MatchSuggestion } from "@/types/matching";

/**
 * Open Match inspired real-time matching system
 * Implémente les concepts d'Open Match pour un matching scalable et en temps réel
 */

export interface MatchTicket {
  id: string;
  userId: string;
  searchFields: {
    [key: string]: number | string | string[];
  };
  tags: string[];
  createdTime: Date;
  extensions?: {
    [key: string]: any;
  };
}

export interface MatchPool {
  name: string;
  filters: MatchFilter[];
  roster?: MatchRoster[];
}

export interface MatchFilter {
  field: string;
  operator: 'IN' | 'NOT_IN' | 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN';
  values: (string | number)[];
}

export interface MatchRoster {
  name: string;
  ticketIds: string[];
}

export interface MatchResult {
  tickets: MatchTicket[];
  rosters: MatchRoster[];
  properties?: {
    [key: string]: any;
  };
}

/**
 * Open Match Engine pour le matching en temps réel
 */
export class OpenMatchEngine {
  private tickets: Map<string, MatchTicket> = new Map();
  private pools: MatchPool[] = [];
  private activeMatches: Map<string, MatchResult> = new Map();

  /**
   * Crée un ticket de matching pour un utilisateur
   */
  createTicket(profile: UserProfile): MatchTicket {
    const ticket: MatchTicket = {
      id: `ticket_${profile.user_id}_${Date.now()}`,
      userId: profile.user_id,
      searchFields: {
        // Champs numériques pour filtrage rapide
        skill_level: this.mapExperienceToNumber(profile.competences.seniorite),
        geo_latitude: profile.localisation.lat,
        geo_longitude: profile.localisation.lng,
        mobility_radius: profile.localisation.mobilite.rayon_km,
        remote_ok: profile.localisation.mobilite.remote ? 1 : 0,
        last_active: this.daysSinceLastConnection(profile.activite.derniere_connexion),
        open_to_matches: profile.etat.ouvert_aux_matches ? 1 : 0,
        
        // Champs textuels pour matching
        sectors: profile.secteur,
        values: profile.valeurs,
        languages: profile.identite.langues,
        offers: profile.apporte,
        seeks: profile.recherche,
        availability_slots: profile.disponibilite.plages_horaires,
        meeting_formats: profile.disponibilite.format,
      },
      tags: [
        ...profile.secteur.map(s => `sector:${s}`),
        ...profile.valeurs.map(v => `value:${v}`),
        `seniority:${profile.competences.seniorite}`,
        `remote:${profile.localisation.mobilite.remote}`,
        `open_to_matches:${profile.etat.ouvert_aux_matches}`,
      ],
      createdTime: new Date(),
      extensions: {
        bigFive: profile.big_five,
        badges: profile.badges,
        preferences: profile.preferences_matching,
      }
    };

    this.tickets.set(ticket.id, ticket);
    return ticket;
  }

  /**
   * Définit les pools de matching (équivalent des MatchMaking pools d'Open Match)
   */
  setupMatchPools(): void {
    this.pools = [
      // Pool pour matching par secteur
      {
        name: "sector_based_pool",
        filters: [
          {
            field: "open_to_matches",
            operator: "EQUALS",
            values: [1]
          },
          {
            field: "last_active",
            operator: "LESS_THAN",
            values: [30] // Actif dans les 30 derniers jours
          }
        ]
      },
      
      // Pool pour matching géographique
      {
        name: "geo_proximity_pool",
        filters: [
          {
            field: "remote_ok",
            operator: "EQUALS",
            values: [0] // Pas de remote, nécessite proximité géo
          },
          {
            field: "open_to_matches",
            operator: "EQUALS",
            values: [1]
          }
        ]
      },

      // Pool pour matching compétences
      {
        name: "skills_complementarity_pool",
        filters: [
          {
            field: "open_to_matches",
            operator: "EQUALS",
            values: [1]
          }
        ]
      },

      // Pool premium pour matching haute qualité
      {
        name: "premium_pool",
        filters: [
          {
            field: "skill_level",
            operator: "GREATER_THAN",
            values: [2] // Senior+ uniquement
          },
          {
            field: "last_active",
            operator: "LESS_THAN",
            values: [7] // Très actifs
          }
        ]
      }
    ];
  }

  /**
   * Filtre les tickets selon les pools (équivalent MatchFunction d'Open Match)
   */
  private filterTicketsForPool(pool: MatchPool, allTickets: MatchTicket[]): MatchTicket[] {
    return allTickets.filter(ticket => {
      return pool.filters.every(filter => {
        const fieldValue = ticket.searchFields[filter.field];
        
        switch (filter.operator) {
          case 'EQUALS':
            return filter.values.includes(fieldValue as string | number);
          case 'NOT_EQUALS':
            return !filter.values.includes(fieldValue as string | number);
          case 'IN':
            if (Array.isArray(fieldValue)) {
              return fieldValue.some(v => filter.values.includes(v));
            }
            return filter.values.includes(fieldValue as string | number);
          case 'GREATER_THAN':
            return (fieldValue as number) > (filter.values[0] as number);
          case 'LESS_THAN':
            return (fieldValue as number) < (filter.values[0] as number);
          default:
            return true;
        }
      });
    });
  }

  /**
   * Génère des matches en temps réel (équivalent Director d'Open Match)
   */
  async generateMatches(targetTicket: MatchTicket): Promise<MatchResult[]> {
    const allTickets = Array.from(this.tickets.values())
      .filter(t => t.userId !== targetTicket.userId); // Exclure soi-même

    const matchResults: MatchResult[] = [];

    for (const pool of this.pools) {
      const poolTickets = this.filterTicketsForPool(pool, allTickets);
      
      if (poolTickets.length === 0) continue;

      // Calculer les affinités pour ce pool
      const scoredTickets = poolTickets.map(ticket => ({
        ticket,
        score: this.calculateOpenMatchScore(targetTicket, ticket, pool.name)
      }))
      .filter(item => item.score > 0.3) // Seuil de qualité
      .sort((a, b) => b.score - a.score)
      .slice(0, 20); // Limiter à 20 par pool

      if (scoredTickets.length > 0) {
        const matchResult: MatchResult = {
          tickets: [targetTicket, ...scoredTickets.map(item => item.ticket)],
          rosters: [
            {
              name: `${pool.name}_roster`,
              ticketIds: scoredTickets.map(item => item.ticket.id)
            }
          ],
          properties: {
            poolName: pool.name,
            averageScore: scoredTickets.reduce((sum, item) => sum + item.score, 0) / scoredTickets.length,
            timestamp: Date.now()
          }
        };

        matchResults.push(matchResult);
      }
    }

    return matchResults;
  }

  /**
   * Calcule le score de matching inspiré d'Open Match
   */
  private calculateOpenMatchScore(ticketA: MatchTicket, ticketB: MatchTicket, poolType: string): number {
    let score = 0;

    switch (poolType) {
      case "sector_based_pool":
        // Similarité sectorielle
        const sectorsA = ticketA.searchFields.sectors as string[];
        const sectorsB = ticketB.searchFields.sectors as string[];
        const sectorOverlap = sectorsA.filter(s => sectorsB.includes(s)).length;
        score = sectorOverlap / Math.max(sectorsA.length, sectorsB.length);
        break;

      case "geo_proximity_pool":
        // Distance géographique
        const latA = ticketA.searchFields.geo_latitude as number;
        const lngA = ticketA.searchFields.geo_longitude as number;
        const latB = ticketB.searchFields.geo_latitude as number;
        const lngB = ticketB.searchFields.geo_longitude as number;
        const distance = this.calculateDistance(latA, lngA, latB, lngB);
        const maxRadius = Math.min(
          ticketA.searchFields.mobility_radius as number,
          ticketB.searchFields.mobility_radius as number
        );
        score = distance <= maxRadius ? Math.exp(-distance / maxRadius) : 0;
        break;

      case "skills_complementarity_pool":
        // Complémentarité des compétences
        const offersA = ticketA.searchFields.offers as string[];
        const seeksA = ticketA.searchFields.seeks as string[];
        const offersB = ticketB.searchFields.offers as string[];
        const seeksB = ticketB.searchFields.seeks as string[];
        
        const supplyScoreAtoB = this.jaccard(offersA, seeksB);
        const supplyScoreBtoA = this.jaccard(offersB, seeksA);
        score = (supplyScoreAtoB + supplyScoreBtoA) / 2;
        break;

      case "premium_pool":
        // Score composite pour profils premium
        const valueOverlap = this.jaccard(
          ticketA.searchFields.values as string[],
          ticketB.searchFields.values as string[]
        );
        const langOverlap = this.jaccard(
          ticketA.searchFields.languages as string[],
          ticketB.searchFields.languages as string[]
        );
        score = (valueOverlap + langOverlap) / 2;
        break;
    }

    // Bonus pour activité récente
    const recentnessA = Math.max(0, 1 - (ticketA.searchFields.last_active as number) / 30);
    const recentnessB = Math.max(0, 1 - (ticketB.searchFields.last_active as number) / 30);
    const recentnessBonus = (recentnessA + recentnessB) / 2;

    return Math.min(1, score * (0.8 + 0.2 * recentnessBonus));
  }

  /**
   * Convertit les résultats Open Match vers le format MatchSuggestion
   */
  convertToMatchSuggestions(
    matchResults: MatchResult[],
    userProfiles: UserProfile[]
  ): MatchSuggestion[] {
    const suggestions: MatchSuggestion[] = [];
    const seenUserIds = new Set<string>();

    for (const result of matchResults) {
      for (const roster of result.rosters || []) {
        for (const ticketId of roster.ticketIds) {
          const ticket = this.tickets.get(ticketId);
          if (!ticket || seenUserIds.has(ticket.userId)) continue;

          const profile = userProfiles.find(p => p.user_id === ticket.userId);
          if (!profile) continue;

          seenUserIds.add(ticket.userId);

          // Calculer un score de compatibilité basé sur Open Match
          const baseScore = (result.properties?.averageScore || 0.5) * 100;
          
          suggestions.push({
            id: ticket.userId,
            compatibility_score: Math.round(baseScore),
            reasons: [
              `Open Match: Pool ${result.properties?.poolName}`,
              `Score technique: ${Math.round((result.properties?.averageScore || 0) * 100)}/100`
            ],
            overlaps: {
              valeurs: [],
              competences_supply: [],
              competences_demand: []
            },
            next_best_action: baseScore > 80 ? 'Match haute qualité - Contactez rapidement' : 'Explorer ce profil',
            profile_preview: {
              identite: profile.identite,
              secteur: profile.secteur,
              badges: profile.badges
            }
          });
        }
      }
    }

    return suggestions.sort((a, b) => b.compatibility_score - a.compatibility_score);
  }

  // Utilitaires
  private mapExperienceToNumber(experience: string): number {
    switch (experience) {
      case 'junior': return 1;
      case 'intermediate': return 2;
      case 'senior': return 3;
      default: return 1;
    }
  }

  private daysSinceLastConnection(lastConnection: string): number {
    const last = new Date(lastConnection);
    const now = new Date();
    return Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private jaccard(setA: string[], setB: string[]): number {
    const intersection = setA.filter(x => setB.includes(x)).length;
    const union = new Set([...setA, ...setB]).size;
    return union === 0 ? 0 : intersection / union;
  }

  // Nettoyage
  cleanupExpiredTickets(): void {
    const expireTime = 24 * 60 * 60 * 1000; // 24 heures
    const now = Date.now();
    
    for (const [ticketId, ticket] of this.tickets) {
      if (now - ticket.createdTime.getTime() > expireTime) {
        this.tickets.delete(ticketId);
      }
    }
  }
}

// Instance singleton
export const openMatchEngine = new OpenMatchEngine();