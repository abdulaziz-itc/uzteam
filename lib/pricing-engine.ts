import { db } from './db';
import { pricingMatrix } from './db/schema';

export interface ParsedRequirements {
  complexity: 'Low' | 'Medium' | 'High';
  features: string[];
  integrations: string[];
  isRealtime: boolean;
  needsHighSecurity: boolean;
}

export interface Estimate {
  minPrice: number;
  maxPrice: number;
  estimatedDays: number;
}

export async function calculateEstimate(req: ParsedRequirements): Promise<Estimate> {
  // Fetch pricing matrix from DB
  const matrix = await db.select().from(pricingMatrix);

  const getVal = (key: string, fallback: number) => {
    const row = matrix.find((r) => r.key === key);
    return row ? Number(row.value) : fallback;
  };

  // Base price based on complexity
  let baseKey = 'base_low';
  if (req.complexity === 'Medium') baseKey = 'base_medium';
  if (req.complexity === 'High') baseKey = 'base_high';
  
  let total = getVal(baseKey, req.complexity === 'High' ? 25000 : req.complexity === 'Medium' ? 12000 : 5000);
  
  const hourlyRate = getVal('hourly_rate', 50);

  // Add feature costs (we mock feature match logic here based on standard keys)
  // In a full implementation, we might map detected generic features to specific paid modules
  let featureHours = 0;
  for (const feature of req.features) {
    const fLowerCase = feature.toLowerCase();
    if (fLowerCase.includes('auth') || fLowerCase.includes('login') || fLowerCase.includes('sign in')) {
      featureHours += getVal('feature_auth', 40);
    } else if (fLowerCase.includes('admin') || fLowerCase.includes('dashboard')) {
      featureHours += getVal('feature_admin', 80);
    } else {
      // Generic feature estimation: ~20 hours per generic feature
      featureHours += 20; 
    }
  }

  // Integrations cost (assume ~30 hours per integration)
  let integrationHours = req.integrations.length * 30;

  let developmentCost = (featureHours + integrationHours) * hourlyRate;
  total += developmentCost;

  // Multipliers
  if (req.isRealtime) {
    total *= getVal('multiplier_realtime', 1.3);
  }
  if (req.needsHighSecurity) {
    total *= getVal('multiplier_high_security', 1.5);
  }

  // Round to nearest 100
  total = Math.round(total / 100) * 100;

  // Calculate range (min - max is usually -15% to +30%)
  const minPrice = Math.round((total * 0.85) / 100) * 100;
  const maxPrice = Math.round((total * 1.30) / 100) * 100;

  // Timeline estimate: Roughly 1 day per 6 hours of development time (assuming 1 dev), but we have a team so divide by 2 devs
  const totalHours = featureHours + integrationHours + (req.complexity === 'High' ? 120 : req.complexity === 'Medium' ? 80 : 40);
  const estimatedDays = Math.ceil(totalHours / 12); 

  return { minPrice, maxPrice, estimatedDays };
}
