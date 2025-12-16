// Company sector detection utility
// Maps company names to sectors based on common patterns

const sectorKeywords: Record<string, string[]> = {
  'Technology': [
    'microsoft', 'google', 'apple', 'amazon', 'meta', 'facebook', 'netflix',
    'adobe', 'oracle', 'salesforce', 'ibm', 'intel', 'nvidia', 'cisco',
    'vmware', 'paypal', 'uber', 'lyft', 'airbnb', 'twitter', 'linkedin',
    'snapchat', 'tiktok', 'zoom', 'slack', 'dropbox', 'spotify', 'tesla',
    'nvidia', 'qualcomm', 'amd', 'samsung', 'sony', 'dell', 'hp', 'lenovo',
    'tech', 'software', 'digital', 'cloud', 'saas', 'platform', 'app',
    'system', 'solution', 'service', 'infrastructure', 'network', 'data',
    'analytics', 'ai', 'machine learning', 'artificial intelligence'
  ],
  'Finance': [
    'bank', 'financial', 'investment', 'capital', 'wealth', 'credit', 'loan',
    'mortgage', 'insurance', 'trading', 'brokerage', 'hedge fund', 'asset',
    'jpmorgan', 'goldman sachs', 'morgan stanley', 'citibank', 'wells fargo',
    'chase', 'american express', 'visa', 'mastercard', 'paypal', 'stripe',
    'square', 'fintech', 'crypto', 'blockchain', 'bitcoin', 'ethereum'
  ],
  'Consulting': [
    'consulting', 'consultant', 'mckinsey', 'bain', 'bcg', 'deloitte',
    'pwc', 'ey', 'ernst', 'kpmg', 'accenture', 'capgemini', 'cognizant',
    'tcs', 'infosys', 'wipro', 'hcl', 'strategy', 'advisory'
  ],
  'Healthcare': [
    'health', 'medical', 'pharma', 'pharmaceutical', 'hospital', 'clinic',
    'biotech', 'biotechnology', 'pfizer', 'johnson', 'merck', 'novartis',
    'roche', 'abbott', 'medtronic', 'baxter', 'bristol', 'lilly'
  ],
  'Manufacturing': [
    'manufacturing', 'production', 'factory', 'industrial', 'automotive',
    'ford', 'gm', 'toyota', 'honda', 'bmw', 'mercedes', 'volkswagen',
    'boeing', 'airbus', 'caterpillar', 'deere', 'ge', 'siemens'
  ],
  'Retail': [
    'retail', 'store', 'shop', 'walmart', 'target', 'costco', 'home depot',
    'lowes', 'best buy', 'macy', 'nordstrom', 'ecommerce', 'online store'
  ],
  'Energy': [
    'energy', 'oil', 'gas', 'petroleum', 'exxon', 'chevron', 'shell', 'bp',
    'renewable', 'solar', 'wind', 'power', 'electricity', 'utility'
  ],
  'Telecommunications': [
    'telecom', 'telecommunication', 'verizon', 'at&t', 't-mobile', 'sprint',
    'communication', 'wireless', 'mobile', 'network provider'
  ],
  'Media & Entertainment': [
    'media', 'entertainment', 'disney', 'warner', 'paramount', 'universal',
    'news', 'broadcast', 'television', 'radio', 'publishing', 'magazine'
  ],
  'Education': [
    'education', 'university', 'college', 'school', 'learning', 'academy',
    'training', 'edtech', 'online learning', 'course', 'tutoring'
  ],
  'Real Estate': [
    'real estate', 'property', 'construction', 'building', 'development',
    'housing', 'commercial', 'residential', 'realtor', 'brokerage'
  ],
  'Transportation & Logistics': [
    'transport', 'logistics', 'shipping', 'delivery', 'freight', 'supply chain',
    'fedex', 'ups', 'dhl', 'amazon logistics', 'railway', 'airline'
  ],
  'Aerospace & Defense': [
    'aerospace', 'defense', 'lockheed', 'raytheon', 'northrop', 'boeing',
    'military', 'aviation', 'space', 'satellite'
  ],
  'Consumer Goods': [
    'consumer', 'goods', 'procter', 'unilever', 'nestle', 'coca cola',
    'pepsi', 'p&g', 'johnson & johnson', 'philip morris'
  ]
};

export function detectCompanySector(companyName: string): string | null {
  if (!companyName) return null;
  
  const normalized = companyName.toLowerCase().trim();
  
  // Check each sector's keywords
  for (const [sector, keywords] of Object.entries(sectorKeywords)) {
    for (const keyword of keywords) {
      if (normalized.includes(keyword)) {
        return sector;
      }
    }
  }
  
  return 'Other';
}

export function getSectorOptions(): string[] {
  return Object.keys(sectorKeywords).concat(['Other']);
}

