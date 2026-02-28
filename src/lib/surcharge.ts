export const SURCHARGE_TIERS = [
  { threshold: 5000000, rate: 0.1 },
  { threshold: 10000000, rate: 0.15 },
  { threshold: 20000000, rate: 0.25 },
  { threshold: 50000000, rate: 0.37 }
] as const;

export const NEW_REGIME_SURCHARGE_CAP = 0.25;

export const getSurchargeRate = (taxableIncome: number, isNewRegime: boolean): number => {
  let rate = 0;
  for (const tier of SURCHARGE_TIERS) {
    if (taxableIncome > tier.threshold) rate = tier.rate;
  }
  return isNewRegime ? Math.min(rate, NEW_REGIME_SURCHARGE_CAP) : rate;
};
