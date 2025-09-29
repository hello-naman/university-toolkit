// Skill categories and related terms for intelligent matching
export const skillCategories = {
  frontend: ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'sass', 'tailwind', 'bootstrap', 'jquery', 'next.js', 'nuxt', 'svelte'],
  backend: ['node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'ruby on rails', 'asp.net', 'php', 'python', 'java', 'c#', 'go', 'rust'],
  mobile: ['react native', 'flutter', 'swift', 'kotlin', 'ionic', 'xamarin', 'android', 'ios'],
  database: ['mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'sql server', 'firestore', 'dynamodb'],
  cloud: ['aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'terraform', 'jenkins', 'ci/cd'],
  ai: ['machine learning', 'deep learning', 'tensorflow', 'pytorch', 'opencv', 'nlp', 'computer vision', 'data science', 'pandas', 'numpy'],
  design: ['figma', 'adobe', 'photoshop', 'illustrator', 'sketch', 'ui/ux', 'user experience', 'user interface'],
  devops: ['docker', 'kubernetes', 'jenkins', 'gitlab', 'github actions', 'terraform', 'ansible', 'monitoring'],
  testing: ['jest', 'cypress', 'selenium', 'unit testing', 'integration testing', 'test automation'],
  web: ['html', 'css', 'javascript', 'web development', 'responsive design', 'seo', 'accessibility']
};

// Skill synonyms for better matching
export const skillSynonyms: Record<string, string[]> = {
  'javascript': ['js', 'ecmascript', 'es6', 'es2015'],
  'typescript': ['ts'],
  'react.js': ['react', 'reactjs'],
  'vue.js': ['vue', 'vuejs'],
  'node.js': ['node', 'nodejs'],
  'python': ['py'],
  'machine learning': ['ml', 'ai', 'artificial intelligence'],
  'deep learning': ['dl', 'neural networks'],
  'ui/ux': ['user interface', 'user experience', 'design'],
  'css': ['cascading style sheets', 'styling'],
  'html': ['hypertext markup language', 'markup'],
  'aws': ['amazon web services', 'amazon cloud'],
  'gcp': ['google cloud platform', 'google cloud'],
  'c++': ['cpp', 'c plus plus'],
  'c#': ['csharp', 'c sharp'],
  'postgresql': ['postgres'],
  'mongodb': ['mongo'],
  'github': ['git'],
  'figma': ['design tool'],
  'photoshop': ['ps', 'adobe photoshop']
};

// Levenshtein distance for fuzzy matching
export function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Calculate similarity score (0-1, higher is better)
export function calculateSimilarity(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1;
  
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return 1 - distance / maxLength;
}

// Find related skills based on categories
export function findRelatedSkills(searchTerm: string, allSkills: string[]): string[] {
  const relatedSkills = new Set<string>();
  const searchLower = searchTerm.toLowerCase();
  
  // Find category matches
  Object.entries(skillCategories).forEach(([category, categorySkills]) => {
    if (category.includes(searchLower) || categorySkills.some(skill => 
      skill.includes(searchLower) || searchLower.includes(skill)
    )) {
      categorySkills.forEach(skill => {
        const matchingSkills = allSkills.filter(s => 
          s.toLowerCase().includes(skill.toLowerCase()) || 
          skill.toLowerCase().includes(s.toLowerCase())
        );
        matchingSkills.forEach(s => relatedSkills.add(s));
      });
    }
  });
  
  return Array.from(relatedSkills);
}

// Enhanced skill search with fuzzy matching and related skills
export function enhancedSkillSearch(searchTerm: string, allSkills: string[]): {
  exactMatches: string[];
  fuzzyMatches: string[];
  relatedSkills: string[];
  synonymMatches: string[];
} {
  if (!searchTerm.trim()) {
    return {
      exactMatches: allSkills,
      fuzzyMatches: [],
      relatedSkills: [],
      synonymMatches: []
    };
  }
  
  const searchLower = searchTerm.toLowerCase();
  const exactMatches: string[] = [];
  const fuzzyMatches: string[] = [];
  const synonymMatches: string[] = [];
  
  // Find exact and fuzzy matches
  allSkills.forEach(skill => {
    const skillLower = skill.toLowerCase();
    
    // Exact substring match
    if (skillLower.includes(searchLower) || searchLower.includes(skillLower)) {
      exactMatches.push(skill);
      return;
    }
    
    // Fuzzy match with similarity threshold
    const similarity = calculateSimilarity(searchLower, skillLower);
    if (similarity > 0.6) { // 60% similarity threshold
      fuzzyMatches.push(skill);
      return;
    }
    
    // Word boundary matches (for multi-word skills)
    const skillWords = skillLower.split(/[\s\-\._]/);
    const searchWords = searchLower.split(/[\s\-\._]/);
    
    const hasWordMatch = skillWords.some(word => 
      searchWords.some(searchWord => 
        word.includes(searchWord) || searchWord.includes(word) ||
        calculateSimilarity(word, searchWord) > 0.7
      )
    );
    
    if (hasWordMatch) {
      fuzzyMatches.push(skill);
    }
  });
  
  // Find synonym matches
  Object.entries(skillSynonyms).forEach(([mainSkill, synonyms]) => {
    synonyms.forEach(synonym => {
      if (synonym.toLowerCase().includes(searchLower) || searchLower.includes(synonym.toLowerCase())) {
        const matchingSkills = allSkills.filter(skill => 
          skill.toLowerCase().includes(mainSkill.toLowerCase()) ||
          mainSkill.toLowerCase().includes(skill.toLowerCase())
        );
        matchingSkills.forEach(skill => {
          if (!exactMatches.includes(skill) && !fuzzyMatches.includes(skill)) {
            synonymMatches.push(skill);
          }
        });
      }
    });
  });
  
  // Find related skills by category
  const relatedSkills = findRelatedSkills(searchTerm, allSkills)
    .filter(skill => 
      !exactMatches.includes(skill) && 
      !fuzzyMatches.includes(skill) && 
      !synonymMatches.includes(skill)
    );
  
  return {
    exactMatches: [...new Set(exactMatches)],
    fuzzyMatches: [...new Set(fuzzyMatches)],
    relatedSkills: [...new Set(relatedSkills)].slice(0, 10), // Limit related skills
    synonymMatches: [...new Set(synonymMatches)]
  };
}