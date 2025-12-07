export const seedCompetitions = [
    // --- 2025 ---
    {
        id: 'fie-gp-seoul-2025',
        name: 'FIE Sabre Grand Prix',
        date: '2025-05-02',
        location: 'Seoul, South Korea',
        category: 'Senior',
        type: 'FIE',
        registrationCloses: '2025-04-20',
        organizer: 'Korea Fencing Federation',
        mapUrl: 'https://maps.google.com/?q=Seoul+Olympic+Park',
        events: [
            { id: 'gp-ms', name: 'Men\'s Sabre', fee: '100€', time: '09:00', entrants: 145 },
            { id: 'gp-ws', name: 'Women\'s Sabre', fee: '100€', time: '13:00', entrants: 128 }
        ],
        preregistrants: [
            { name: 'SZILAGYI Aron', country: 'HUN', rank: 1 },
            { name: 'OH Sanguk', country: 'KOR', rank: 2 },
            { name: 'APITHY Bolade', country: 'FRA', rank: 3 }
        ]
    },
    {
        id: 'inter-dortmund-2025',
        name: 'International Sabre Competition',
        date: '2025-06-14',
        location: 'Dortmund, Germany',
        category: 'Senior',
        type: 'International',
        registrationCloses: '2025-06-01',
        organizer: 'Dortmunder Fechtclub',
        events: [
            { id: 'int-ms', name: 'Senior Men\'s Sabre', fee: '35€', time: '10:00', entrants: 64 },
            { id: 'int-ws', name: 'Senior Women\'s Sabre', fee: '35€', time: '14:00', entrants: 52 }
        ]
    },
    {
        id: 'nat-u17-ioannina-2025',
        name: 'U17 & U13 Sabre Cup',
        date: '2025-10-04',
        location: 'Ioannina, Greece',
        category: 'Cadet/Education',
        type: 'National',
        registrationCloses: '2025-09-30',
        events: [
            { id: 'u17-ms', name: 'U17 Men\'s Sabre', fee: '20€', time: '09:00', entrants: 34 },
            { id: 'u17-ws', name: 'U17 Women\'s Sabre', fee: '20€', time: '12:00', entrants: 28 },
            { id: 'u13-mix', name: 'U13 Mixed Sabre', fee: '15€', time: '15:00', entrants: 20 }
        ]
    },
    {
        id: 'efc-u17-istanbul-2025',
        name: 'EFC Cadet Circuit',
        date: '2025-10-11',
        location: 'Istanbul, Turkey',
        category: 'Cadet',
        type: 'EFC',
        registrationCloses: '2025-10-01',
        events: [
            { id: 'efc-ms', name: 'Cadet Men\'s Sabre', fee: '50€', time: '09:00', entrants: 190 },
            { id: 'efc-ws', name: 'Cadet Women\'s Sabre', fee: '50€', time: '09:00', entrants: 160 },
            { id: 'efc-team', name: 'Cadet Team', fee: '100€', time: '12:00', entrants: 25 }
        ]
    },
    {
        id: 'nat-senior-paiania-2025',
        name: 'Senior Sabre Cup',
        date: '2025-10-18',
        location: 'Paiania, Greece',
        category: 'Senior',
        type: 'National',
        events: [
            { id: 'nat-sm', name: 'Senior Men', fee: '25€', time: '09:00', entrants: 45 },
            { id: 'nat-sw', name: 'Senior Women', fee: '25€', time: '13:00', entrants: 32 }
        ]
    },
    {
        id: 'fie-jwc-busan-2025',
        name: 'Junior World Cup',
        date: '2025-10-31',
        location: 'Busan, South Korea',
        category: 'Junior',
        type: 'FIE',
        registrationCloses: '2025-10-15',
        events: [{ id: 'jwc-ms', name: 'Junior Men\'s Sabre', fee: '60€', time: '09:00', entrants: 110 }]

    },
    {
        id: 'fie-swc-algiers-2025',
        name: 'Senior World Cup',
        date: '2025-11-07',
        location: 'Algiers, Algeria',
        category: 'Senior',
        type: 'FIE',
        events: [
            { id: 'swc-ms', name: 'Men\'s Sabre Individual', fee: '80€', time: '09:00', entrants: 156 },
            { id: 'swc-mt', name: 'Men\'s Sabre Team', fee: '140€', time: '09:00', entrants: 24 }
        ]
    },
    {
        id: 'nat-u20-crete-2025',
        name: 'U20 Sabre Cup',
        date: '2025-11-08',
        location: 'Crete, Greece',
        category: 'Junior',
        type: 'National',
        events: [
            { id: 'u20-ms', name: 'U20 Men', fee: '20€', time: '10:00', entrants: 22 },
            { id: 'u20-ws', name: 'U20 Women', fee: '20€', time: '13:00', entrants: 18 }
        ]
    },
    {
        id: 'fie-swc-hongkong-2025',
        name: 'Senior World Cup',
        date: '2025-11-16',
        location: 'Hong Kong',
        category: 'Senior',
        type: 'FIE',
        events: [
            { id: 'swc-ws', name: 'Women\'s Sabre Individual', fee: '80€', time: '09:00', entrants: 140 }
        ]
    },
    {
        id: 'fie-gp-orleans-2025',
        name: 'Grand Prix Nuoma',
        date: '2025-12-04',
        location: 'Orleans, France',
        category: 'Senior',
        type: 'FIE',
        events: [
            { id: 'gp-ms', name: 'Men\'s Sabre', fee: '100€', time: '09:00', entrants: 180 },
            { id: 'gp-ws', name: 'Women\'s Sabre', fee: '100€', time: '13:00', entrants: 160 }
        ]
    },
    {
        id: 'efc-u17-eislingen-2025',
        name: 'EFC Cadet Circuit (Eislingen)',
        date: '2025-12-06',
        location: 'Eislingen, Germany',
        category: 'Cadet',
        type: 'EFC',
        events: [
            { id: 'efc-ms', name: 'Cadet Men\'s Sabre', fee: '50€', time: '08:00', entrants: 220 },
            { id: 'efc-ws', name: 'Cadet Women\'s Sabre', fee: '50€', time: '08:00', entrants: 190 }
        ]
    },
    {
        id: 'fie-jwc-budapest-2025',
        name: 'Junior World Cup',
        date: '2025-12-13',
        location: 'Budapest, Hungary',
        category: 'Junior',
        type: 'FIE',
        events: [{ id: 'jwc-ms', name: 'Junior Men', fee: '40€', time: '09:00', entrants: 155 }]
    },

    // --- 2026 ---
    {
        id: 'fie-jwc-udine-2026',
        name: 'Junior World Cup',
        date: '2026-01-05',
        location: 'Udine, Italy',
        category: 'Junior',
        type: 'FIE'
    },
    {
        id: 'fie-gp-tunis-2026',
        name: 'Grand Prix Tunis',
        date: '2026-01-08',
        location: 'Tunis, Tunisia',
        category: 'Senior',
        type: 'FIE'
    },
    {
        id: 'fie-swc-slc-2026',
        name: 'Senior World Cup',
        date: '2026-01-22',
        location: 'Salt Lake City, USA',
        category: 'Senior',
        type: 'FIE'
    },
    {
        id: 'fie-swc-athens-2026',
        name: 'Coupe Acropolis (Senior WC)',
        date: '2026-03-07',
        location: 'Athens, Greece',
        category: 'Senior',
        type: 'FIE'
    },
    {
        id: 'nat-champs-2026',
        name: 'Greek National Championships (Est)',
        date: '2026-04-15',
        location: 'Athens, Greece',
        category: 'All',
        type: 'National'
    },
    {
        id: 'fie-gp-seoul-2026',
        name: 'Grand Prix Seoul',
        date: '2026-05-01',
        location: 'Seoul, South Korea',
        category: 'Senior',
        type: 'FIE'
    },
    {
        id: 'fie-swc-lima-2026',
        name: 'Senior World Cup',
        date: '2026-05-22',
        location: 'Lima, Peru',
        category: 'Senior',
        type: 'FIE'
    },
    // --- Greek Sabre Circuit 2024-2025 ---
    {
        id: 'gre-u20-oaka-2024',
        name: 'U20 Sabre Cup',
        date: '2024-09-14',
        location: 'OAKA, Athens',
        category: 'Junior',
        type: 'National',
        registrationCloses: '2024-09-10',
        organizer: 'Hellenic Fencing Federation',
        mapUrl: 'https://maps.google.com/?q=OAKA+Olympic+Indoor+Hall',
        events: [
            { id: 'u20-ms', name: 'Junior Men Sabre', fee: '15€', time: '09:00', entrants: 42 },
            { id: 'u20-ws', name: 'Junior Women Sabre', fee: '15€', time: '13:00', entrants: 35 }
        ],
        preregistrants: []
    },
    {
        id: 'gre-u13-ioannina-2024',
        name: 'U13 & Development Cup (Ioannina)',
        date: '2024-10-05',
        location: 'Ioannina',
        category: 'U13',
        type: 'National',
        registrationCloses: '2024-10-01',
        organizer: 'E.A.S. Ioanninon',
        events: [
            { id: 'u13-ms', name: 'U13 Men Sabre', fee: '15€', time: '09:00', entrants: 28 },
            { id: 'u13-ws', name: 'U13 Women Sabre', fee: '15€', time: '09:00', entrants: 24 },
            { id: 'dev-ms', name: 'Development Men', fee: '10€', time: '14:00', entrants: 15 }
        ],
        preregistrants: []
    },
    {
        id: 'gre-u17-ioannina-2024',
        name: 'U17 Sabre Cup (Ioannina)',
        date: '2024-10-06',
        location: 'Ioannina',
        category: 'Cadet',
        type: 'National',
        registrationCloses: '2024-10-02',
        organizer: 'E.A.S. Ioanninon',
        events: [
            { id: 'u17-ms', name: 'Cadet Men Sabre', fee: '20€', time: '09:00', entrants: 55 },
            { id: 'u17-ws', name: 'Cadet Women Sabre', fee: '20€', time: '12:30', entrants: 48 }
        ],
        preregistrants: []
    },
    {
        id: 'gre-crete-cup-2024',
        name: 'Messara Cup & Veterans',
        date: '2024-10-19',
        location: 'Heraklion, Crete',
        category: 'Senior',
        type: 'National',
        registrationCloses: '2024-10-15',
        organizer: 'A.L. Messaras',
        events: [
            { id: 'sen-ms', name: 'Senior Men Sabre', fee: '20€', time: '10:00', entrants: 30 },
            { id: 'vet-mix', name: 'Veterans Mixed', fee: '20€', time: '14:00', entrants: 12 }
        ],
        preregistrants: []
    },
    {
        id: 'fie-acropolis-2025',
        name: 'Acropolis Cup (FIE World Cup)',
        date: '2025-03-07',
        location: 'Heraklion, Crete',
        category: 'Senior',
        type: 'FIE',
        registrationCloses: '2025-02-28',
        organizer: 'FIE / Hellenic Fed',
        mapUrl: 'https://maps.google.com/?q=Heraklion+Arena',
        events: [
            { id: 'wc-ws', name: 'Senior Women Sabre', fee: 'FIE Lic', time: '09:00', entrants: 180 },
            { id: 'wc-team', name: 'Team Women Sabre', fee: 'FIE Lic', time: '09:00', entrants: 24 }
        ],
        preregistrants: [
            { name: 'GKOUNTOURA Theodora', country: 'GRE', rank: 3 },
            { name: 'GEORGIADOU Despina', country: 'GRE', rank: 5 },
            { name: 'USNAT Dinara', country: 'UZB', rank: 11 }
        ]
    },
    {
        id: 'gre-nationals-2025',
        name: 'Hellenic National Championship',
        date: '2025-05-17',
        location: 'Paiania, Athens',
        category: 'Senior',
        type: 'National',
        registrationCloses: '2025-05-10',
        organizer: 'Hellenic Fencing Federation',
        mapUrl: 'https://maps.google.com/?q=Paiania+Indoor+Hall',
        events: [
            { id: 'nat-ms', name: 'Senior Men Sabre', fee: '25€', time: '09:00', entrants: 64 },
            { id: 'nat-ws', name: 'Senior Women Sabre', fee: '25€', time: '13:00', entrants: 48 },
            { id: 'nat-team', name: 'Team Events', fee: '50€', time: 'Next Day', entrants: 12 }
        ],
        preregistrants: []
    }
];
