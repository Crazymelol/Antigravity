export const CATEGORIES = {
    U10: { label: 'U10 (Development)', minYear: 2016 },
    U13: { label: 'U13 (Pampaidon)', minYear: 2013 },
    U17: { label: 'Cadet (U17)', minYear: 2009 },
    U20: { label: 'Junior (U20)', minYear: 2006 },
    SENIOR: { label: 'Senior', minYear: 0 }, // Open
    VETERAN: { label: 'Veteran', maxYear: 1985 } // 40+ usually
};

// Based on 2025-2026 Season (Reference Year 2026)
export const getEligibleCategories = (birthYear) => {
    if (!birthYear) return ['Senior']; // Default fallback

    const eligible = [];
    const year = parseInt(birthYear);

    // Development
    if (year >= CATEGORIES.U10.minYear) eligible.push('U10');

    // U13 (10-12 usually, but simple check: born 2013 or later)
    if (year >= CATEGORIES.U13.minYear) eligible.push('U13');

    // Cadet (U17) - Born 2009 or later
    if (year >= CATEGORIES.U17.minYear) eligible.push('Cadet (U17)');

    // Junior (U20) - Born 2006 or later
    if (year >= CATEGORIES.U20.minYear) eligible.push('Junior (U20)');

    // Senior - Everyone usually eligible (min age rules exist, often 13+, so born <= 2013)
    if (year <= CATEGORIES.U13.minYear) eligible.push('Senior');

    // Veteran
    if (year <= CATEGORIES.VETERAN.maxYear) eligible.push('Veteran');

    return eligible;
};
