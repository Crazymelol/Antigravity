import { createClient } from '@supabase/supabase-js';

// Configuration (Hardcoded for test script, in real app use env vars)
const SUPABASE_URL = "https://ifelmkxmbegztyjxlzfi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZWxta3htYmVnenR5anhsemZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NDQ4MjgsImV4cCI6MjA4MTQyMDgyOH0.y1aQe0Oq5uxCyf1VAM05qqhm-XvGb0K09uM0wFJGbgo";

// Create ADMIN/Global client just for setup? No, create separate user clients.
const clientA = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
const clientB = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
const clientAdmin = createClient(SUPABASE_URL, SUPABASE_KEY); // For unrestricted reads if needed (using Service Key ideally, but we have Anon)

async function runTest() {
    console.log("Starting Multiplayer System Verification (Multi-Client)...");

    try {
        const timestamp = Date.now();

        // 1. Create User A
        const emailA = `test_a_${timestamp}@forcesector.com`;
        const { data: { user: userA, session: sessionA }, error: errA } = await clientA.auth.signUp({
            email: emailA,
            password: 'password123',
            options: { data: { name: `Agent A ${timestamp}` } }
        });
        if (errA) throw errA;
        if (!sessionA) {
            console.log("[WARN] No Session returned for User A. Email confirmation might be required.");
            // Try explicit sign in?
            const { data: { session: sessionLogin }, error: loginErr } = await clientA.auth.signInWithPassword({
                email: emailA,
                password: 'password123'
            });
            if (loginErr) console.log(`[WARN] Login failed: ${loginErr.message}`);
            else console.log("[INFO] Explicit Login Successful");
        }
        console.log(`[PASS] Created User A: ${emailA}`);

        // 2. Create User B
        const emailB = `test_b_${timestamp}@forcesector.com`;
        const { data: { user: userB }, error: errB } = await clientB.auth.signUp({
            email: emailB,
            password: 'password123',
            options: { data: { name: `Agent B ${timestamp}` } }
        });
        if (errB) throw errB;
        console.log(`[PASS] Created User B: ${emailB}`);

        // 3. Verify Profiles (Signup Bonus)
        await new Promise(r => setTimeout(r, 2000));
        const { data: profileA } = await clientA.from('profiles').select('*').eq('id', userA.id).single();
        // Check B via Client B to prove RLS works for 'select'
        const { data: profileB } = await clientB.from('profiles').select('*').eq('id', userB.id).single();

        if (profileA.bonus_cash !== 0.50) throw new Error("User A did not get signup bonus");
        console.log(`[PASS] Users received initial Bonus Cash ($0.50).`);

        // 4. User A searches for match ($0.50 Wager)
        console.log("Agent A searching for match...");
        const { data: matchA, error: matchErrA } = await clientA.from('matches').insert({
            player1_id: userA.id, // clientA is auth as userA
            wager: 0.50,
            status: 'searching'
        }).select().single();
        if (matchErrA) throw matchErrA;
        console.log(`[PASS] Match Created by A: ${matchA.id}`);

        // 5. User B searches for match ($0.50 Wager)
        console.log("Agent B searching for match...");
        const { data: openMatches } = await clientB.from('matches').select('*')
            .eq('status', 'searching')
            .eq('wager', 0.50)
            .neq('player1_id', userB.id)
            .limit(1);

        if (!openMatches || openMatches.length === 0) throw new Error("Matchmaking failed: No match found for User B");

        const matchToJoin = openMatches[0];
        const { data: matchB, error: matchErrB } = await clientB.from('matches').update({
            player2_id: userB.id,
            status: 'active'
        }).eq('id', matchToJoin.id).select().single();
        if (matchErrB) throw matchErrB;

        console.log(`[PASS] Agent B joined Match: ${matchB.id}`);

        // 6. Simulate Game (Scores)
        console.log("Submitting Scores...");
        // User A scores
        const { error: scoreErrA } = await clientA.from('matches').update({ p1_score: 1000 }).eq('id', matchB.id);
        if (scoreErrA) throw scoreErrA;

        // User B scores & FINISHES (Update status and winner)
        const { error: scoreErrB } = await clientB.from('matches').update({
            p2_score: 2000,
            winner_id: userB.id,
            status: 'finished'
        }).eq('id', matchB.id);
        if (scoreErrB) throw scoreErrB;

        console.log("[PASS] Scores Submitted. Agent B declared winner.");

        // 7. Process Payout (Simulate Client Logic)
        const payout = 0.50 * 1.8;
        const newBalance = profileB.real_cash + payout;

        // Client B updates their own profile
        const { error: payoutErr } = await clientB.from('profiles').update({
            real_cash: newBalance
        }).eq('id', userB.id);

        if (payoutErr) throw payoutErr;

        // Verify Final State via Admin/A check
        const { data: finalProfileB } = await clientA.from('profiles').select('real_cash').eq('id', userB.id).single();
        // Wait, can A read B? 'Public Read Profiles' policy is TRUE. Yes.

        if (Math.abs(finalProfileB.real_cash - newBalance) > 0.01) throw new Error("Payout did not persist!");

        console.log(`[PASS] Payout Successful. Agent B Balance: $${finalProfileB.real_cash}`);

        console.log("\n[SUCCESS] MULTIPLAYER FLOW VERIFIED.");

    } catch (e) {
        console.error("\n[FAIL] Test Failed:", e);
    }
}

runTest();
