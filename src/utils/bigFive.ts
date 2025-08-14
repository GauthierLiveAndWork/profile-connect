import { BIG_FIVE_QUESTIONS, BigFiveScores } from '@/types/profile';

export function calculateBigFiveScores(responses: number[]): BigFiveScores {
  if (responses.length !== 10) {
    throw new Error('Big Five responses must contain exactly 10 answers');
  }

  const dimensions = {
    openness: [],
    conscientiousness: [],
    extraversion: [],
    agreeableness: [],
    emotional_stability: []
  } as Record<string, number[]>;

  // Group responses by dimension and apply reversals
  BIG_FIVE_QUESTIONS.forEach((question, index) => {
    const response = responses[index];
    const score = question.reversed ? 6 - response : response;
    dimensions[question.dimension].push(score);
  });

  // Calculate averages for each dimension
  const scores: BigFiveScores = {
    openness: dimensions.openness.reduce((a, b) => a + b, 0) / dimensions.openness.length,
    conscientiousness: dimensions.conscientiousness.reduce((a, b) => a + b, 0) / dimensions.conscientiousness.length,
    extraversion: dimensions.extraversion.reduce((a, b) => a + b, 0) / dimensions.extraversion.length,
    agreeableness: dimensions.agreeableness.reduce((a, b) => a + b, 0) / dimensions.agreeableness.length,
    emotional_stability: dimensions.emotional_stability.reduce((a, b) => a + b, 0) / dimensions.emotional_stability.length
  };

  // Round to 2 decimal places
  Object.keys(scores).forEach(key => {
    scores[key as keyof BigFiveScores] = Math.round(scores[key as keyof BigFiveScores] * 100) / 100;
  });

  return scores;
}

export function getDimensionLabel(dimension: keyof BigFiveScores): string {
  const labels = {
    openness: 'Ouverture',
    conscientiousness: 'Conscienciosité',
    extraversion: 'Extraversion',
    agreeableness: 'Agréabilité',
    emotional_stability: 'Stabilité émotionnelle'
  };
  
  return labels[dimension];
}