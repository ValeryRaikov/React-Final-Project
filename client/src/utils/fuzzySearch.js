/**
 * Fuzzy Search Utility
 * Implements Levenshtein distance and fuzzy matching for client-side search
 */

/**
 * Calculate Levenshtein distance between two strings
 * Represents the minimum number of edits needed to transform one string into another
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Levenshtein distance
 */
export const levenshteinDistance = (str1, str2) => {
    const a = str1.toLowerCase();
    const b = str2.toLowerCase();

    if (a === b) return 0;
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = Array(b.length + 1)
        .fill(null)
        .map(() => Array(a.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) {
        matrix[0][i] = i;
    }

    for (let j = 0; j <= b.length; j++) {
        matrix[j][0] = j;
    }

    for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
            const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,
                matrix[j - 1][i] + 1,
                matrix[j - 1][i - 1] + indicator
            );
        }
    }

    return matrix[b.length][a.length];
};

/**
 * Calculate fuzzy match score between a search query and a target string
 * Returns a score from 0 to 1 where 1 is a perfect match
 * @param {string} query - Search query
 * @param {string} target - Target string to match against
 * @param {number} maxDistance - Maximum allowed edit distance (default: 2, like Atlas maxEdits)
 * @returns {number} - Fuzzy match score (0-1)
 */
const getWords = (str) =>
    str.toLowerCase().split(/\s+/).filter(Boolean);

export const fuzzyMatchScore = (query, target, maxDistance = 2) => {
    if (!query || !target) 
        return 0;

    const queryWords = getWords(query);
    const targetWords = getWords(target);

    let totalScore = 0;

    for (const qWord of queryWords) {
        let bestScore = 0;

        for (const tWord of targetWords) {
            // Exact match
            if (tWord === qWord) {
                bestScore = 1;
                break;
            }

            // Prefix match
            if (tWord.startsWith(qWord)) {
                bestScore = Math.max(bestScore, 0.9);
                continue;
            }

            // Substring match
            if (tWord.includes(qWord)) {
                bestScore = Math.max(bestScore, 0.8);
                continue;
            }

            // 🔴 Key fix: dynamic tolerance instead of fixed maxDistance
            const dynamicMaxDist = Math.max(2, Math.floor(tWord.length * 0.3));

            const distance = levenshteinDistance(qWord, tWord);

            if (distance <= dynamicMaxDist) {
                const score = 1 - distance / tWord.length;
                bestScore = Math.max(bestScore, score * 0.7);
            }
        }

        totalScore += bestScore;
    }

    // Normalize score (important)
    return totalScore / queryWords.length;
};

/**
 * Perform fuzzy search on a list of products
 * @param {Array} products - Array of products to search
 * @param {string} query - Search query
 * @param {Array} searchFields - Fields to search in (e.g., ['name', 'description'])
 * @param {number} maxDistance - Maximum allowed edit distance (default: 2)
 * @returns {Array} - Sorted array of matching products with scores
 */
export const fuzzySearchProducts = (
    products,
    query,
    searchFields = ['name', 'description'],
    maxDistance = 2
) => {
    if (!query || query.trim().length === 0) {
        return products;
    }

    const queryTrimmed = query.trim();

    const scored = products
        .map(product => {
            let maxScore = 0;

            // Calculate best score across all search fields
            for (const field of searchFields) {
                const fieldValue = product[field];
                if (!fieldValue) continue;

                const score = fuzzyMatchScore(queryTrimmed, fieldValue, maxDistance);
                maxScore = Math.max(maxScore, score);
            }

            return { ...product, fuzzyScore: maxScore };
        })
        .filter(item => item.fuzzyScore > 0) // Only return matches
        .sort((a, b) => b.fuzzyScore - a.fuzzyScore); // Sort by score descending

    // Remove the fuzzyScore property before returning
    return scored.map(({ fuzzyScore, ...product }) => product);
};

/**
 * Get autocomplete suggestions with fuzzy matching
 * @param {Array} products - Array of products
 * @param {string} query - Search query
 * @param {number} limit - Maximum number of suggestions (default: 10)
 * @param {number} maxDistance - Maximum allowed edit distance (default: 2)
 * @returns {Array} - Array of suggested product names
 */
export const getAutocompleteSuggestions = (
    products,
    query,
    limit = 10,
    maxDistance = 2
) => {
    if (!query || query.trim().length < 2) {
        return [];
    }

    const queryLower = query.trim().toLowerCase();

    const scored = products
        .map(product => {
            // Prioritize prefix matches for autocomplete
            const name = (product.name || '').toLowerCase();
            
            let score = 0;
            if (name === queryLower) {
                score = 1;
            } else if (name.startsWith(queryLower)) {
                score = 0.95;
            } else {
                score = fuzzyMatchScore(query, product.name, maxDistance);
            }

            return { product, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => {
            // Sort by score, then by name length (shorter is better for autocomplete)
            if (b.score !== a.score) return b.score - a.score;
            return a.product.name.length - b.product.name.length;
        })
        .slice(0, limit)
        .map(item => ({
            id: item.product.id,
            name: item.product.name,
            category: item.product.category
        }));

    return scored;
};
