
// Real Supabase integration prep
// To enable real backend:
// 1. Install supabase-js if using bundler, or use CDN (already handled in index.html if we were using it there, but here we are ES modules)
// For now, we assume the user might need to inject keys.

// If we are in a pure ESM environment without build step, we might need to import from CDN url in the file itself 
// or assume a global `supabase` object if loaded via script tag. 
// However, the import shows `import { supabase } ...` so we are exporting it.

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// TODO: USER MUST REPLACE THESE WITH REAL KEYS
const SUPABASE_URL = "https://ifelmkxmbegztyjxlzfi.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_nYNL4ip03cy8DVZ7FDjfNg_3pjxXTdL";

const isMock = SUPABASE_URL === "YOUR_SUPABASE_URL";

let client;

if (isMock) {
    console.log("Supabase: Missing Keys - Using Mock Client");
    client = createMockClient();
} else {
    console.log("Supabase: Initializing Real Client");
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export const supabase = client;


function createMockClient() {
    const MOCK_LEADERBOARD = [
        { name: "CyberNinja", score: 2450 },
        { name: "FocusGod", score: 2100 },
        { name: "SpeedDemon", score: 1950 },
        { name: "NeuralLink", score: 1800 },
        { name: "User123", score: 1500 },
    ];

    return {
        auth: {
            signUp: async ({ email, password }) => {
                console.log("Mock SignUp:", email);
                return { data: { user: { email, id: 'mock-id' } }, error: null };
            },
            signInWithPassword: async ({ email, password }) => {
                console.log("Mock SignIn:", email);
                localStorage.setItem("fs_user_email", email);
                return { data: { user: { email, id: 'mock-id' } }, error: null };
            },
            signOut: async () => {
                console.log("Mock SignOut");
                localStorage.removeItem("fs_user_email");
                return { error: null };
            },
            getUser: async () => {
                const email = localStorage.getItem("fs_user_email");
                return { data: { user: email ? { email, id: 'mock-id' } : null } };
            }
        },
        from: (table) => {
            return {
                select: () => ({
                    order: () => ({
                        limit: async () => ({ data: MOCK_LEADERBOARD, error: null })
                    })
                }),
                insert: async (data) => {
                    console.log("Mock Insert:", data);
                    MOCK_LEADERBOARD.push({ name: data.name || "Agent", score: data.score });
                    MOCK_LEADERBOARD.sort((a, b) => b.score - a.score);
                    return { error: null };
                }
            };
        }
    };
}
