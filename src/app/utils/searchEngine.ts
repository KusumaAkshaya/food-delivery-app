// utils/searchEngine.ts

export type SearchableDish = {
    name: string;
    image: string;
    price: number;
    description: string;
    rating: number;
    quantity: number;
    restaurant: string;
    restaurantname: string;
    veg: boolean;
    offer: string;
    category: string;
};


/*
|--------------------------------------------------------------------------
| PIPELINE
|--------------------------------------------------------------------------
|
| normalize
| → tokenize
| → trigram index
| → candidate retrieval
| → Levenshtein fuzzy matching
| → scoring
| → ranking
| → return results
|
*/


/*
|--------------------------------------------------------------------------
| FUNCTION: normalizeText
|--------------------------------------------------------------------------
| Cleans text so different cases, spaces, and punctuation do not affect search.
|
*/

function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ");
}


/*
|--------------------------------------------------------------------------
| FUNCTION: tokenize
|--------------------------------------------------------------------------
| Splits normalized text into individual searchable words.
|
*/

function tokenize(text: string): string[] {
    const normalized = normalizeText(text);

    if (!normalized) {
        return [];
    }

    return normalized.split(" ");
}


/*
|--------------------------------------------------------------------------
| FUNCTION: getTrigrams
|--------------------------------------------------------------------------
| Breaks a word/string into 3-character pieces used for fuzzy candidate search.
|
| Example:
| chicken → chi, hic, ick, cke, ken
|
*/

function getTrigrams(text: string): string[] {
    const normalized = normalizeText(text).replace(/\s+/g, "");

    if (normalized.length < 3) {
        return [normalized];
    }

    const trigrams: string[] = [];

    for (let i = 0; i <= normalized.length - 3; i++) {
        trigrams.push(normalized.slice(i, i + 3));
    }

    return trigrams;
}


/*
|--------------------------------------------------------------------------
| TYPE: TrigramIndex
|--------------------------------------------------------------------------
| Maps every trigram to dish indexes containing that trigram.
|
*/

type TrigramIndex = Map<string, Set<number>>;


/*
|--------------------------------------------------------------------------
| FUNCTION: buildSearchableText
|--------------------------------------------------------------------------
| Combines important dish fields into one searchable text representation.
|
*/

function buildSearchableText(dish: SearchableDish): string {
    return normalizeText(
        `${dish.name} ${dish.restaurantname} ${dish.category}`
    );
}


/*
|--------------------------------------------------------------------------
| FUNCTION: buildTrigramIndex
|--------------------------------------------------------------------------
| Builds the inverted index: trigram → dishes that contain that trigram.
|
*/

function buildTrigramIndex<T extends SearchableDish>(
    dishes: T[]
): TrigramIndex {

    const index: TrigramIndex = new Map();

    dishes.forEach((dish, dishIndex) => {
        const searchableText = buildSearchableText(dish);

        const trigrams = new Set(
            getTrigrams(searchableText)
        );

        for (const trigram of trigrams) {

            if (!index.has(trigram)) {
                index.set(
                    trigram,
                    new Set()
                );
            }

            index.get(trigram)?.add(dishIndex);
        }
    });

    return index;
}


/*
|--------------------------------------------------------------------------
| FUNCTION: getCandidateIndexes
|--------------------------------------------------------------------------
| Uses query trigrams to quickly find only dishes likely to be relevant.
|
*/

function getCandidateIndexes(
    query: string,
    trigramIndex: TrigramIndex
): Set<number> {

    const queryTrigrams = getTrigrams(query);

    const candidateIndexes = new Set<number>();

    for (const trigram of queryTrigrams) {

        const matches = trigramIndex.get(trigram);

        if (!matches) {
            continue;
        }

        for (const dishIndex of matches) {
            candidateIndexes.add(dishIndex);
        }
    }

    return candidateIndexes;
}


/*
|--------------------------------------------------------------------------
| FUNCTION: levenshteinDistance
|--------------------------------------------------------------------------
| Finds minimum insertions, deletions, or replacements needed to change one word into another.
|
*/

function levenshteinDistance(
    first: string,
    second: string
): number {

    const a = normalizeText(first);
    const b = normalizeText(second);

    const rows = a.length + 1;
    const cols = b.length + 1;

    const dp: number[][] = Array.from(
        { length: rows },
        () => Array(cols).fill(0)
    );


    for (let i = 0; i < rows; i++) {
        dp[i][0] = i;
    }


    for (let j = 0; j < cols; j++) {
        dp[0][j] = j;
    }


    for (let i = 1; i < rows; i++) {

        for (let j = 1; j < cols; j++) {

            if (a[i - 1] === b[j - 1]) {

                dp[i][j] = dp[i - 1][j - 1];

            } else {

                dp[i][j] = 1 + Math.min(
                    dp[i - 1][j],
                    dp[i][j - 1],
                    dp[i - 1][j - 1]
                );
            }
        }
    }

    return dp[a.length][b.length];
}


/*
|--------------------------------------------------------------------------
| FUNCTION: getFuzzySimilarity
|--------------------------------------------------------------------------
| Converts Levenshtein distance into a similarity score between 0 and 1.
|
*/

function getFuzzySimilarity(
    first: string,
    second: string
): number {

    const a = normalizeText(first);
    const b = normalizeText(second);

    const maxLength = Math.max(
        a.length,
        b.length
    );


    if (maxLength === 0) {
        return 1;
    }


    const distance = levenshteinDistance(
        a,
        b
    );


    return 1 - distance / maxLength;
}


/*
|--------------------------------------------------------------------------
| FUNCTION: getBestTokenSimilarity
|--------------------------------------------------------------------------
| Finds the dish token most similar to one query token.
|
*/

function getBestTokenSimilarity(
    queryToken: string,
    dishTokens: string[]
): number {

    let bestSimilarity = 0;

    for (const dishToken of dishTokens) {

        const similarity = getFuzzySimilarity(
            queryToken,
            dishToken
        );

        bestSimilarity = Math.max(
            bestSimilarity,
            similarity
        );
    }

    return bestSimilarity;
}


/*
|--------------------------------------------------------------------------
| FUNCTION: calculateFuzzyScore
|--------------------------------------------------------------------------
| Gives score when query tokens are close to dish tokens even with spelling mistakes.
|
*/

function calculateFuzzyScore(
    dish: SearchableDish,
    query: string
): number {

    const queryTokens = tokenize(query);

    const dishTokens = tokenize(
        buildSearchableText(dish)
    );

    let score = 0;


    for (const queryToken of queryTokens) {

        const similarity = getBestTokenSimilarity(
            queryToken,
            dishTokens
        );


        /*
        |--------------------------------------------------------------
        | Very strong typo match
        | Example: chiken → chicken
        |--------------------------------------------------------------
        */

        if (similarity >= 0.85) {
            score += 45;
        }


        /*
        |--------------------------------------------------------------
        | Moderate fuzzy match
        |--------------------------------------------------------------
        */

        else if (similarity >= 0.70) {
            score += 25;
        }
    }


    return score;
}


/*
|--------------------------------------------------------------------------
| FUNCTION: calculateExactPrefixTokenScore
|--------------------------------------------------------------------------
| Gives higher scores to exact, prefix, contains, and token matches.
|
*/

function calculateExactPrefixTokenScore(
    dish: SearchableDish,
    query: string
): number {

    const normalizedQuery = normalizeText(query);

    const dishName = normalizeText(dish.name);

    const restaurantName = normalizeText(
        dish.restaurantname
    );

    const category = normalizeText(
        dish.category
    );

    const queryTokens = tokenize(
        normalizedQuery
    );

    let score = 0;


    /*
    |--------------------------------------------------------------------------
    | EXACT MATCH
    |--------------------------------------------------------------------------
    */

    if (dishName === normalizedQuery) {
        score += 120;
    }

    if (restaurantName === normalizedQuery) {
        score += 90;
    }

    if (category === normalizedQuery) {
        score += 70;
    }


    /*
    |--------------------------------------------------------------------------
    | PREFIX MATCH
    |--------------------------------------------------------------------------
    */

    if (
        dishName.startsWith(normalizedQuery) &&
        dishName !== normalizedQuery
    ) {
        score += 80;
    }

    if (
        restaurantName.startsWith(normalizedQuery) &&
        restaurantName !== normalizedQuery
    ) {
        score += 60;
    }

    if (
        category.startsWith(normalizedQuery) &&
        category !== normalizedQuery
    ) {
        score += 45;
    }


    /*
    |--------------------------------------------------------------------------
    | CONTAINS MATCH
    |--------------------------------------------------------------------------
    */

    if (
        dishName.includes(normalizedQuery) &&
        !dishName.startsWith(normalizedQuery)
    ) {
        score += 60;
    }

    if (
        restaurantName.includes(normalizedQuery) &&
        !restaurantName.startsWith(normalizedQuery)
    ) {
        score += 40;
    }

    if (
        category.includes(normalizedQuery) &&
        !category.startsWith(normalizedQuery)
    ) {
        score += 35;
    }


    /*
    |--------------------------------------------------------------------------
    | TOKEN MATCH
    |--------------------------------------------------------------------------
    */

    for (const token of queryTokens) {

        if (dishName.includes(token)) {
            score += 25;
        }

        if (restaurantName.includes(token)) {
            score += 15;
        }

        if (category.includes(token)) {
            score += 12;
        }
    }


    return score;
}


/*
|--------------------------------------------------------------------------
| FUNCTION: calculateFinalScore
|--------------------------------------------------------------------------
| Combines exact/prefix/token score, fuzzy score, and a small rating boost.
|
*/

function calculateFinalScore(
    dish: SearchableDish,
    query: string
): number {

    const normalScore =
        calculateExactPrefixTokenScore(
            dish,
            query
        );

    const fuzzyScore =
        calculateFuzzyScore(
            dish,
            query
        );


    let finalScore =
        normalScore +
        fuzzyScore;


    /*
    |--------------------------------------------------------------------------
    | SMALL POPULARITY SIGNAL
    |--------------------------------------------------------------------------
    | Rating only breaks close ties; relevance remains more important.
    |--------------------------------------------------------------------------
    */

    if (finalScore > 0) {
        finalScore += dish.rating;
    }


    return finalScore;
}


/*
|--------------------------------------------------------------------------
| CLASS: SearchEngine
|--------------------------------------------------------------------------
| Builds the trigram index once and reuses it for every query.
|
*/

export class SearchEngine<T extends SearchableDish> {

    private dishes: T[];

    private trigramIndex: TrigramIndex;


    constructor(dishes: T[]) {

        this.dishes = dishes;

        this.trigramIndex =
            buildTrigramIndex(dishes);
    }


    /*
    |--------------------------------------------------------------------------
    | FUNCTION: search
    |--------------------------------------------------------------------------
    | Takes a query, finds fuzzy candidates, ranks them, and returns Dish[].
    |--------------------------------------------------------------------------
    */

    search(query: string): T[] {

        const normalizedQuery =
            normalizeText(query);


        /*
        |--------------------------------------------------------------------------
        | EMPTY QUERY
        |--------------------------------------------------------------------------
        */

        if (!normalizedQuery) {
            return this.dishes;
        }


        /*
        |--------------------------------------------------------------------------
        | STEP 1: GET CANDIDATES USING TRIGRAM INDEX
        |--------------------------------------------------------------------------
        */

        let candidateIndexes =
            getCandidateIndexes(
                normalizedQuery,
                this.trigramIndex
            );


        /*
        |--------------------------------------------------------------------------
        | FALLBACK
        |--------------------------------------------------------------------------
        |
        | Short queries like "pi" may not give good trigram candidates,
        | so we allow all dishes and let scoring decide.
        |
        */

        if (candidateIndexes.size === 0) {

            candidateIndexes =
                new Set(
                    this.dishes.map(
                        (_, index) => index
                    )
                );
        }


        /*
        |--------------------------------------------------------------------------
        | STEP 2: SCORE CANDIDATES
        |--------------------------------------------------------------------------
        */

        const scoredResults = Array.from(
            candidateIndexes
        ).map((dishIndex) => {

            const dish =
                this.dishes[dishIndex];

            const score =
                calculateFinalScore(
                    dish,
                    normalizedQuery
                );


            return {
                dish,
                score
            };
        });


        /*
        |--------------------------------------------------------------------------
        | STEP 3: REMOVE WEAK / IRRELEVANT RESULTS
        |--------------------------------------------------------------------------
        */

        const validResults =
            scoredResults.filter(
                result => result.score > 0
            );


        /*
        |--------------------------------------------------------------------------
        | STEP 4: RANK RESULTS
        |--------------------------------------------------------------------------
        */

        validResults.sort(
            (a, b) =>
                b.score - a.score
        );


        /*
        |--------------------------------------------------------------------------
        | STEP 5: RETURN ONLY DISHES
        |--------------------------------------------------------------------------
        */

        return validResults.map(
            result => result.dish
        );
    }
}