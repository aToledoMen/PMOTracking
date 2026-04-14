// Map of country id -> ISO 2-letter code for corporate pill display
export const countryCode: Record<string, string> = {
  c1: 'US',  c2: 'UK',  c3: 'DE',  c4: 'FR',  c5: 'JP',
  c6: 'BR',  c7: 'AU',  c8: 'CA',  c9: 'MX',  c10: 'IN',
  c11: 'ES', c12: 'IT', c13: 'KR', c14: 'NL', c15: 'SG',
  c16: 'AR', c17: 'CL', c18: 'SE', c19: 'PL', c20: 'TH',
  c21: 'ZA', c22: 'AE', c23: 'CO', c24: 'NZ', c25: 'PT',
};

export function getCountryCode(id: string | undefined): string {
  if (!id) return '--';
  return countryCode[id] || id.slice(0, 2).toUpperCase();
}
