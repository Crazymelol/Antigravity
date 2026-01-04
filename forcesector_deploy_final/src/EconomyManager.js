import { supabase } from './supabaseClient.js';

export default class EconomyManager {
    constructor() {
        this.realCash = 0.00;
        this.bonusCash = 0.00;
        this.user_id = null;
        this.init();
    }

    async init() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            this.user_id = user.id;
            await this.syncProfile();
        } else {
            // Fallback for guests (local only)
            this.realCash = parseFloat(localStorage.getItem("fs_cash_real") || "0.00");
            this.bonusCash = parseFloat(localStorage.getItem("fs_cash_bonus") || "10.00");
        }
    }

    async syncProfile() {
        if (!this.user_id) return;
        const { data, error } = await supabase.from('profiles').select('real_cash, bonus_cash').eq('id', this.user_id).single();
        if (data) {
            this.realCash = parseFloat(data.real_cash);
            this.bonusCash = parseFloat(data.bonus_cash);
        }
    }

    getBalance() {
        return {
            real: this.realCash,
            bonus: this.bonusCash,
            total: this.realCash + this.bonusCash
        };
    }

    // "Deposit" simulation
    async deposit(amount) {
        this.realCash += amount;
        this.bonusCash += (amount * 0.10);
        await this.save();
        return this.getBalance();
    }

    async addBonus(amount) {
        this.bonusCash += amount;
        await this.save();
        return this.getBalance();
    }

    canAfford(entryFee) {
        return (this.realCash + this.bonusCash) >= entryFee;
    }

    async enterTournament(entryFee) {
        if (!this.canAfford(entryFee)) return false;

        let remaining = entryFee;

        // Deduct from Real Cash first
        if (this.realCash >= remaining) {
            this.realCash -= remaining;
            remaining = 0;
        } else {
            remaining -= this.realCash;
            this.realCash = 0;
        }

        // Deduct rest from Bonus
        if (remaining > 0) {
            this.bonusCash -= remaining;
        }

        await this.save();
        return true;
    }

    async awardPrize(amount) {
        this.realCash += amount;
        await this.save();
    }

    async save() {
        // Always save local for immediate UI feedback / guest mode
        localStorage.setItem("fs_cash_real", this.realCash.toFixed(2));
        localStorage.setItem("fs_cash_bonus", this.bonusCash.toFixed(2));

        // Sync to cloud
        if (this.user_id) {
            await supabase.from('profiles').update({
                real_cash: this.realCash,
                bonus_cash: this.bonusCash
            }).eq('id', this.user_id);
        }
    }
}
