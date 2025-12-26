export default class EconomyManager {
    constructor() {
        this.realCash = parseFloat(localStorage.getItem("fs_cash_real") || "0.00");
        this.bonusCash = parseFloat(localStorage.getItem("fs_cash_bonus") || "10.00"); // Start with $10 Bonus
    }

    getBalance() {
        return {
            real: this.realCash,
            bonus: this.bonusCash,
            total: this.realCash + this.bonusCash
        };
    }

    // "Deposit" simulation
    deposit(amount) {
        this.realCash += amount;
        // Example Promo: 10% Match Bonus
        this.bonusCash += (amount * 0.10);
        this.save();
        return this.getBalance();
    }

    addBonus(amount) {
        this.bonusCash += amount;
        this.save();
        return this.getBalance();
    }

    canAfford(entryFee) {
        return (this.realCash + this.bonusCash) >= entryFee;
    }

    // Enter Tournament: Deduct fee (Use Bonus First? Or Real First? Skillz uses Real first usually, then Bonus. Let's use Bonus first for player happiness in this sim)
    // Skillz actually uses a mix: 90/10 split often. Let's keep it simple: Real First (Standard).
    enterTournament(entryFee) {
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

        this.save();
        return true;
    }

    // Win Payout: Prize is mostly Real Cash?
    // Standard: You get your Entry Fee back + Profit. 
    // If you entered with Bonus, you get Bonus back?
    // Simplified: Prize is Real Cash.
    awardPrize(amount) {
        this.realCash += amount;
        this.save();
    }

    save() {
        localStorage.setItem("fs_cash_real", this.realCash.toFixed(2));
        localStorage.setItem("fs_cash_bonus", this.bonusCash.toFixed(2));
    }
}
