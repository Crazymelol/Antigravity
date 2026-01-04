import { supabase } from './supabaseClient.js';

export default class AuthManager {
    constructor() {
        this.user = null;
        this.init();
    }

    async init() {
        // Check session silently
        const { data } = await supabase.auth.getUser();
        this.user = data?.user;
        // Don't auto-show UI
    }

    createOverlay() {
        if (document.getElementById('auth-overlay')) return;

        const div = document.createElement('div');
        div.id = 'auth-overlay';
        div.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.9); z-index: 2000; display: none;
            justify-content: center; align-items: center; color: white;
            font-family: Arial, sans-serif;
        `;

        div.innerHTML = `
            <div style="background: #1a1a1a; padding: 40px; border-radius: 8px; width: 300px; text-align: center; border: 1px solid #333;">
                <h2 style="margin-top: 0; margin-bottom: 20px; color: #00CCFF;">IDENTIFY YOURSELF</h2>
                <div style="margin-bottom: 20px; color: #888; font-size: 14px;">Enter details to archive your score.</div>
                
                <input type="text" id="auth-name" placeholder="Agent Codename" style="width: 100%; padding: 10px; margin-bottom: 10px; background: #333; border: 1px solid #444; color: white; box-sizing: border-box; font-weight: bold;">
                <input type="email" id="auth-email" placeholder="Email" style="width: 100%; padding: 10px; margin-bottom: 10px; background: #333; border: none; color: white; box-sizing: border-box;">
                <input type="password" id="auth-password" placeholder="Password" style="width: 100%; padding: 10px; margin-bottom: 20px; background: #333; border: none; color: white; box-sizing: border-box;">
                
                <button id="auth-login-btn" style="width: 100%; padding: 10px; background: #00CCFF; border: none; font-weight: bold; cursor: pointer; margin-bottom: 10px;">SUBMIT RECORD</button>
                <div id="auth-msg" style="color: #ff3333; font-size: 12px; height: 15px;"></div>
                <div style="margin-top: 20px; font-size: 12px; color: #888; cursor: pointer;" id="auth-close-btn">Cancel</div>
            </div>
        `;

        document.body.appendChild(div);

        div.querySelector('#auth-login-btn').onclick = () => this.handleLogin();
        div.querySelector('#auth-close-btn').onclick = () => {
            div.style.display = 'none';
            if (this.loginResolve) this.loginResolve(null); // Resolve null if cancelled
        };
    }

    requireUser() {
        return new Promise((resolve) => {
            if (this.user) {
                resolve(this.user);
                return;
            }
            this.loginResolve = resolve;
            this.showLogin();
        });
    }

    isAuthenticated() {
        return !!this.user;
    }

    async handleLogin() {
        const name = document.getElementById('auth-name').value;
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        const msg = document.getElementById('auth-msg');

        if (!email || !password || !name) {
            msg.innerText = "All fields required for identification.";
            return;
        }

        const btn = document.getElementById('auth-login-btn');
        const setBtnState = (busy) => {
            if (!btn) return;
            if (busy) {
                btn.disabled = true;
                btn.style.opacity = "0.5";
                btn.innerText = "VERIFYING...";
            } else {
                btn.disabled = false;
                btn.style.opacity = "1";
                btn.innerText = "SUBMIT RECORD";
            }
        };

        msg.innerText = "Authenticating...";
        setBtnState(true);

        try {
            // Try Login
            let { data, error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                // Try Signup
                const res = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { name } }
                });

                if (res.error) {
                    msg.innerText = res.error.message;
                    setBtnState(false);
                    return;
                }

                // Check if email confirmation is required (session is null)
                if (res.data.user && !res.data.session) {
                    msg.innerText = "Confirmation link sent to email.";
                    setBtnState(false);
                    return;
                }

                data = res.data;
            }

            if (!data.user) {
                msg.innerText = "Authentication failed.";
                setBtnState(false);
                return;
            }

            this.user = data.user;
            // Mock saving name to user metadata if it was a login update
            this.user.user_metadata = this.user.user_metadata || {};
            this.user.user_metadata.name = name;

            document.getElementById('auth-overlay').style.display = 'none';

            if (this.loginResolve) {
                // Determine user ID
                if (window.economyManager) {
                    window.economyManager.user_id = this.user.id;
                    window.economyManager.syncProfile();
                }
                this.loginResolve(this.user);
                this.loginResolve = null;
            }
        } catch (e) {
            console.error("Login Error:", e);
            msg.innerText = "Connection Error. Try again.";
            setBtnState(false);
        }

        showLogin() {
            this.createOverlay();
            document.getElementById('auth-overlay').style.display = 'flex';
        }

    async signOut() {
            await supabase.auth.signOut();
            this.user = null;
        }

    // The updateUI method is no longer used or needed with the new requireUser flow.
    // It has been removed as per the implicit instruction of the diff.

    async submitScore(score, mode) {
            const user = await this.requireUser();
            if (!user) return; // User cancelled

            await supabase.from('scores').insert({
                user_id: user.id,
                email: user.email,
                name: user.user_metadata?.name || 'Agent', // Use the name!
                score: score,
                mode: mode,
                created_at: new Date()
            });

            alert("Score Archived Successfully.");
        }

    async getLeaderboard() {
            const { data } = await supabase.from('scores').select('name, score').order('score', { ascending: false }).limit(10);
            return data || [];
        }
    }

