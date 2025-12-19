export type SecurityEvent =
  | "NEW_DEVICE_LOGIN"
  | "NEW_IP_LOGIN"
  | "BAD_IP"
  | "RAPID_LOGIN"
  | "PASSWORD_RESET"
  | "ACCOUNT_LOCKED"
  | "NON_INDIA_ACCESS";

const eventWeights: Record<SecurityEvent, number> = {
  NEW_DEVICE_LOGIN: 30,
  NEW_IP_LOGIN: 25,
  BAD_IP: 40,
  RAPID_LOGIN: 20,
  PASSWORD_RESET: 15,
  ACCOUNT_LOCKED: 0, // This is a result, not an input signal
  NON_INDIA_ACCESS: 100, // Immediate high risk
};

/**
 * Calculates a risk score based on a series of security events.
 * @param events - An array of security event types.
 * @returns A numerical risk score.
 */
export function calculateRisk(events: SecurityEvent[]): number {
  let score = 0;
  const uniqueEvents = [...new Set(events)]; // Count each type of event only once per calculation

  for (const event of uniqueEvents) {
    score += eventWeights[event] || 0;
  }

  return score;
}

/**
 * Determines the risk level based on a score.
 * @param score - The numerical risk score.
 * @returns A risk level category.
 */
export function getRiskLevel(
  score: number
): "low" | "medium" | "high" | "critical" {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}
