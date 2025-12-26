export default class CampaignManager {
    constructor() {
        this.levels = [
            { id: 1, name: "Calibration", targets: 10, speed: 2000, distractors: 0, description: "Hit 10 Green Targets. No Distractors.", minScore: 3000 },
            { id: 2, name: "Focus Test", targets: 15, speed: 1800, distractors: 0, description: "Speed increased. Stay sharp.", minScore: 4500 },
            { id: 3, name: "Interference", targets: 20, speed: 1600, distractors: 1, description: "Red Targets appear. Do NOT hit them.", minScore: 6000 },
            { id: 4, name: "Acceleration", targets: 25, speed: 1400, distractors: 1, description: "Targets move faster.", minScore: 8000 },
            { id: 5, name: "Cognitive Load", targets: 30, speed: 1200, distractors: 2, description: "More distractions. Maintain focus.", minScore: 10000 },
            { id: 6, name: "Deep Sector", targets: 40, speed: 1000, distractors: 2, description: "Entering Deep Sector. High speed.", minScore: 14000 },
            { id: 7, name: "Chaos Theory", targets: 50, speed: 900, distractors: 3, description: "Maximum interference.", minScore: 18000 },
            { id: 8, name: "The Void", targets: 60, speed: 800, distractors: 4, description: "Survive the void.", minScore: 22000 },
            // Phase 2: Hyper Sector
            { id: 9, name: "Hyper Drive", targets: 60, speed: 750, distractors: 3, description: "Speed increasing. Don't blink.", minScore: 24000 },
            { id: 10, name: "Neural Link", targets: 70, speed: 700, distractors: 4, description: "Sync your reflexes.", minScore: 28000 },
            { id: 11, name: "Overload", targets: 80, speed: 650, distractors: 5, description: "Heavy distractor density.", minScore: 32000 },
            { id: 12, name: "Velocity", targets: 80, speed: 600, distractors: 3, description: "Pure speed test.", minScore: 34000 },
            { id: 13, name: "Glitch Storm", targets: 90, speed: 550, distractors: 6, description: "Visual noise high.", minScore: 38000 },
            { id: 14, name: "Core Breach", targets: 100, speed: 500, distractors: 5, description: "Critical reaction speeds needed.", minScore: 42000 },
            // Phase 3: Omega Sector
            { id: 15, name: "Omega Entry", targets: 100, speed: 480, distractors: 4, description: "Entering Omega Sector.", minScore: 45000 },
            { id: 16, name: "Flux State", targets: 110, speed: 460, distractors: 6, description: "Unpredictable patterns.", minScore: 50000 },
            { id: 17, name: "Singularity", targets: 120, speed: 440, distractors: 7, description: "Focus is absolute.", minScore: 55000 },
            { id: 18, name: "Event Horizon", targets: 130, speed: 420, distractors: 8, description: "No margin for error.", minScore: 60000 },
            { id: 19, name: "Ascension", targets: 140, speed: 400, distractors: 5, description: "Near human limit.", minScore: 65000 },
            { id: 20, name: "Force Master", targets: 150, speed: 380, distractors: 10, description: "Prove your mastery.", minScore: 75000 }
        ];
    }

    getCurrentLevel() {
        const lvl = parseInt(localStorage.getItem("forcesector_campaign_level") || "1");
        return this.levels.find(l => l.id === lvl) || this.levels[0];
    }

    getAllLevels() {
        return this.levels;
    }

    unlockNextLevel(currentLevelId) {
        const current = parseInt(localStorage.getItem("forcesector_campaign_level") || "1");
        if (currentLevelId === current && current < this.levels.length) {
            localStorage.setItem("forcesector_campaign_level", current + 1);
            return true;
        }
        return false;
    }

    isComplete() {
        const current = parseInt(localStorage.getItem("forcesector_campaign_level") || "1");
        return current > this.levels.length;
    }

    resetProgress() {
        localStorage.setItem("forcesector_campaign_level", "1");
    }
}
