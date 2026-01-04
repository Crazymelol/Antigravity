
// Real Supabase integration prep
// To enable real backend:
// 1. Install supabase-js if using bundler, or use CDN (already handled in index.html if we were using it there, but here we are ES modules)
// For now, we assume the user might need to inject keys.

// If we are in a pure ESM environment without build step, we might need to import from CDN url in the file itself 
// or assume a global `supabase` object if loaded via script tag. 
// However, the import shows `import { supabase } ...` so we are exporting it.

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// TODO: USER MUST REPLACE THESE WITH REAL KEYS
// Credentials provided by user
const SUPABASE_URL = "https://ifelmkxmbegztyjxlzfi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZWxta3htYmVnenR5anhsemZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NDQ4MjgsImV4cCI6MjA4MTQyMDgyOH0.y1aQe0Oq5uxCyf1VAM05qqhm-XvGb0K09uM0wFJGbgo";

const isMock = false;

let client;

if (isMock) {
    console.log("Supabase: Mock Client Active");
    client = createMockClient();
} else {
    // console.log("Supabase: Initializing Real Client");
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export const supabase = client;

// --- MULTIPLAYER HELPERS ---

export async function findMatch(wager) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("Must be logged in");

    // 1. Try to find an open match
    const { data: openMatches, error } = await supabase
        .from('matches')
        .select('*')
        .eq('status', 'searching')
        .eq('wager', wager)
        .neq('player1_id', user.id) // Don't join own match
        .limit(1);

    if (openMatches && openMatches.length > 0) {
        // JOIN EXISTING
        const match = openMatches[0];
        const { data: updated, error: joinError } = await supabase
            .from('matches')
            .update({
                player2_id: user.id,
                status: 'active'
            })
            .eq('id', match.id)
            .select()
            .single();

        if (joinError) throw joinError;
        return { role: 'player2', match: updated };
    } else {
        // CREATE NEW
        const { data: newMatch, error: createError } = await supabase
            .from('matches')
            .insert({
                player1_id: user.id,
                wager: wager,
                status: 'searching'
            })
            .select()
            .single();

        if (createError) throw createError;
        return { role: 'player1', match: newMatch };
    }
}

export async function submitMatchScore(matchId, score) {
    const user = (await supabase.auth.getUser()).data.user;

    // We need to know if we are p1 or p2. Fetch match first.
    const { data: match } = await supabase.from('matches').select('*').eq('id', matchId).single();
    if (!match) return;

    const updates = {};
    if (match.player1_id === user.id) updates.p1_score = score;
    else if (match.player2_id === user.id) updates.p2_score = score;

    // Check if finished (simple client-side check for now)
    // If we are the LAST one to submit (other score is not 0), then we finish it.
    // Note: This race condition is why server-side logic is better, but this works for proto.
    const otherScore = (match.player1_id === user.id) ? match.p2_score : match.p1_score;
    const isFinished = otherScore > 0;

    if (isFinished) {
        updates.status = 'finished';
        // Determine Winner
        const myScore = score;
        if (myScore > otherScore) updates.winner_id = user.id;
        else if (otherScore > myScore) updates.winner_id = (match.player1_id === user.id) ? match.player2_id : match.player1_id;
        else updates.status = 'draw'; // Handle draw?
    }

    const { data, error } = await supabase.from('matches').update(updates).eq('id', matchId).select().single();

    // If I won/finished, trigger payout locally immediately (optimistic)
    // In real app, listen to DB change.
    return { match: data, isFinished };
}

export function subscribeToMatch(matchId, onUpdate) {
    console.log("Subscribing to match updates:", matchId);
    return supabase
        .channel(`match_tracking:${matchId}`)
        .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'matches', filter: `id=eq.${matchId}` },
            (payload) => {
                console.log("Match Update Received:", payload.new);
                onUpdate(payload.new);
            }
        )
        .subscribe();
}


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
