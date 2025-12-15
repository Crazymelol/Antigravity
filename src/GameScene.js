const DAILY_LIMIT = 1;

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // No external assets required for now, using Phaser Graphics
    }

    create() {
        // --- Access Control Logic ---
        this.sessionRegistered = false;
        this.isProUser = localStorage.getItem("forcesector_pro") === "true";

        const today = new Date().toDateString();
        const lastPlayDate = localStorage.getItem("forcesector_last_date");
        let sessionsToday = parseInt(localStorage.getItem("forcesector_sessions") || "0");

        if (lastPlayDate !== today) {
            sessionsToday = 0;
            localStorage.setItem("forcesector_sessions", "0");
            localStorage.setItem("forcesector_last_date", today);
        }

        if (!this.isProUser && sessionsToday >= DAILY_LIMIT) {
            this.showLockedScreen();
            return;
        }

        // Session increment removed from here. Moved to registerSession() called in startGame().

        // --- Game State ---
        this.score = 0;
        this.totalStimuli = 0;
        this.correctHits = 0;
        this.reactionTimes = [];
        this.isGameActive = false;
        this.sessionDuration = 120; // 2 minutes in seconds
        this.timeLeft = this.sessionDuration;
        this.currentDifficulty = 1;
        this.stimulusDisplayTime = 2000; // ms to tap

        // Colors & Styles
        this.colors = {
            bg: 0x111111,
            target: 0x00FF88, // Neon Green
            distractor: 0xFF3333, // Red
            text: '#ffffff',
            accent: 0x00CCFF // Blue
        };

        // --- UI Layers ---
        this.createUI();

        // --- Input ---
        this.input.topOnly = true;

        // --- Start Screen ---
        this.showStartScreen();
    }

    createUI() {
        const width = this.scale.width;

        // Header Background
        this.add.rectangle(width / 2, 60, width, 120, 0x000000, 0.8).setDepth(10);

        // Title
        this.add.text(width / 2, 40, 'FORCESECTOR', {
            fontSize: '32px',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            color: this.colors.text
        }).setOrigin(0.5).setDepth(11);

        // HUD Container
        this.hudContainer = this.add.container(0, 0).setDepth(10);

        // Timer
        this.timerText = this.add.text(40, 90, 'TIME: 120', {
            fontSize: '24px',
            fontFamily: 'monospace',
            color: this.colors.text
        }).setOrigin(0, 0.5);

        // Score
        this.scoreText = this.add.text(width - 40, 90, 'SCORE: 0', {
            fontSize: '24px',
            fontFamily: 'monospace',
            color: this.colors.text
        }).setOrigin(1, 0.5);

        this.hudContainer.add([this.timerText, this.scoreText]);
        this.hudContainer.setVisible(false);
    }

    showStartScreen() {
        const width = this.scale.width;
        const height = this.scale.height;

        this.startContainer = this.add.container(0, 0).setDepth(20);

        const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.9);
        const title = this.add.text(width / 2, height * 0.3, 'FOCUS UNDER PRESSURE', {
            fontSize: '48px',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            color: '#FFFFFF',
            align: 'center',
            wordWrap: { width: width * 0.8 }
        }).setOrigin(0.5);

        const bestScore = localStorage.getItem('fs_best_score') || 0;
        const subtext = this.add.text(width / 2, height * 0.45, `Best Score: ${bestScore}\n\nTap the GREEN targets.\nIgnore the RED ones.\nSpeed increases over time.`, {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#CCCCCC',
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5);

        const startBtn = this.add.rectangle(width / 2, height * 0.7, 300, 100, this.colors.accent).setInteractive();
        const startText = this.add.text(width / 2, height * 0.7, 'START SESSION', {
            fontSize: '36px',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            color: '#000000'
        }).setOrigin(0.5);

        startBtn.on('pointerdown', () => {
            this.startGame();
        });

        this.startContainer.add([bg, title, subtext, startBtn, startText]);
    }

    startGame() {
        this.registerSession(); // Count session only when actually starting
        this.startContainer.setVisible(false);
        this.hudContainer.setVisible(true);
        this.isGameActive = true;

        // Reset Stats
        this.score = 0;
        this.timeLeft = this.sessionDuration;
        this.reactionTimes = [];
        this.correctHits = 0;
        this.totalStimuli = 0;
        this.currentDifficulty = 1;

        // Start Timer
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.onSecondElapsed,
            callbackScope: this,
            loop: true
        });

        // Start Spawning
        this.nextTurn();
    }

    onSecondElapsed() {
        this.timeLeft--;
        this.timerText.setText(`TIME: ${this.timeLeft}`);

        // Increase difficulty every 20 seconds
        if (this.sessionDuration - this.timeLeft > 20 * this.currentDifficulty) {
            this.currentDifficulty++;
            // Speed up
            this.stimulusDisplayTime = Math.max(600, 2000 - (this.currentDifficulty * 200));
        }

        if (this.timeLeft <= 0) {
            this.endGame();
        }
    }

    nextTurn() {
        if (!this.isGameActive) return;

        // Clear existing targets
        if (this.activeTargets) {
            this.activeTargets.forEach(t => t.destroy());
        }
        this.activeTargets = [];

        // Logic: Spawn 1 Target (Green) and 0-3 Distractors (Red)
        // Ensure they don't overlap too much (simple check)
        const positions = [];
        const numDistractors = Phaser.Math.Between(0, Math.min(3, this.currentDifficulty));

        // Create Target
        this.spawnStimulus(true, positions);

        // Create Distractors
        for (let i = 0; i < numDistractors; i++) {
            this.spawnStimulus(false, positions);
        }

        // Auto-fail if not clicked in time?
        // Let's implement a timeout for the next turn to keep pacing
        // If user doesn't click, the target disappears and we count it as a miss? 
        // For "Focus" tasks, typically you Wait for the user. 
        // BUT "Pressure" implies time limit.
        // Let's make the stimuli fade out.

        this.turnTimer = this.time.delayedCall(this.stimulusDisplayTime, () => {
            if (this.isGameActive) {
                // If this timer triggers, it means player missed the window
                // If they clicked nothing, it's a "Miss"
                // However, handling "Missed Target" logic can be complex with multiple objects.
                // Let's simplify: Clean up and spawn next.
                this.nextTurn();
            }
        });
    }

    spawnStimulus(isTarget, positions) {
        const padding = 100;
        const width = this.scale.width;
        const height = this.scale.height;
        const topMargin = 200; // avoid HUD

        let x, y, safe;
        let attempts = 0;

        // Find safe position
        do {
            x = Phaser.Math.Between(padding, width - padding);
            y = Phaser.Math.Between(topMargin, height - padding);
            safe = true;
            for (let p of positions) {
                if (Phaser.Math.Distance.Between(x, y, p.x, p.y) < 150) {
                    safe = false;
                    break;
                }
            }
            attempts++;
        } while (!safe && attempts < 20);

        positions.push({ x, y });

        const color = isTarget ? this.colors.target : this.colors.distractor;

        // Visual
        const circle = this.add.circle(x, y, 60, color).setInteractive();

        // Pulse animation
        this.tweens.add({
            targets: circle,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 400,
            yoyo: true,
            repeat: -1
        });

        // Store spawn time for reaction calc
        const spawnTime = this.time.now;

        circle.on('pointerdown', () => {
            if (!this.isGameActive) return;

            if (isTarget) {
                this.handleSuccess(spawnTime);
            } else {
                this.handleFailure();
            }

            // Clean up this turn immediately on interaction?
            // Yes, fast pacing.
            if (this.turnTimer) this.turnTimer.remove();
            this.nextTurn();
        });

        this.activeTargets.push(circle);
    }

    handleSuccess(spawnTime) {
        // reaction time
        const rt = this.time.now - spawnTime;
        this.reactionTimes.push(rt);
        this.correctHits++;
        this.totalStimuli++; // We count 'turns' where they acted

        // Score formula: Base points + Speed bonus
        const speedBonus = Math.max(0, 1000 - rt);
        const points = 100 + Math.floor(speedBonus / 2);
        this.score += points;

        this.scoreText.setText(`SCORE: ${this.score}`);
        this.showFloatText(this.currX, this.currY, `+${points}`, 0x00FF00); // Need coords? handled below...
    }

    handleFailure() {
        this.totalStimuli++;
        // Penalty?
        this.score = Math.max(0, this.score - 50);
        this.scoreText.setText(`SCORE: ${this.score}`);

        // Camera shake or flash
        this.cameras.main.shake(200, 0.01);
    }

    showFloatText(x, y, msg, color) {
        // Simple visual feedback could go here, but omitted for brevity/cleanliness
    }

    endGame() {
        this.isGameActive = false;
        if (this.gameTimer) this.gameTimer.remove();
        if (this.turnTimer) this.turnTimer.remove();
        if (this.activeTargets) this.activeTargets.forEach(t => t.destroy());

        // Calculate Stats
        const avgRT = this.reactionTimes.length > 0
            ? Math.floor(this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length)
            : 0;

        const accuracy = this.totalStimuli > 0
            ? Math.floor((this.correctHits / this.totalStimuli) * 100)
            : 0;

        const finalScore = this.score; // Using the accumulated score as the main metric

        // Storage
        const savedBest = parseInt(localStorage.getItem('fs_best_score') || '0');
        const isNewBest = finalScore > savedBest;
        if (isNewBest) {
            localStorage.setItem('fs_best_score', finalScore);
            localStorage.setItem('fs_best_rt', avgRT);
        }

        // Show Summary
        this.showSummary(finalScore, avgRT, accuracy, isNewBest);
    }

    showSummary(score, rt, acc, isBest) {
        const width = this.scale.width;
        const height = this.scale.height;

        const container = this.add.container(0, 0).setDepth(30);
        const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.95);

        const title = this.add.text(width / 2, height * 0.2, 'SESSION COMPLETE', {
            fontSize: '48px', fontFamily: 'Arial', fontWeight: 'bold', color: '#fff'
        }).setOrigin(0.5);

        const scoreLabel = this.add.text(width / 2, height * 0.35, `${score}`, {
            fontSize: '80px', fontFamily: 'Arial', fontWeight: 'bold', color: this.colors.target
        }).setOrigin(0.5);

        const scoreSub = this.add.text(width / 2, height * 0.42, isBest ? 'NEW PERSONAL BEST!' : 'FINAL SCORE', {
            fontSize: '24px', fontFamily: 'Arial', color: '#aaa'
        }).setOrigin(0.5);

        const statsText = `Avg Reaction: ${rt}ms\nAccuracy: ${acc}%`;
        const stats = this.add.text(width / 2, height * 0.55, statsText, {
            fontSize: '32px', fontFamily: 'Arial', color: '#fff', align: 'center', lineSpacing: 10
        }).setOrigin(0.5);

        const restartBtn = this.add.rectangle(width / 2, height * 0.75, 300, 80, 0xffffff).setInteractive();
        const restartText = this.add.text(width / 2, height * 0.75, 'TRAIN AGAIN', {
            fontSize: '32px', fontFamily: 'Arial', fontWeight: 'bold', color: '#000000'
        }).setOrigin(0.5);

        restartBtn.on('pointerdown', () => {
            this.scene.restart();
        });

        container.add([bg, title, scoreLabel, scoreSub, stats, restartBtn, restartText]);
    }

    showLockedScreen() {
        const { width, height } = this.scale;

        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85);

        this.add.text(width / 2, height / 2 - 40,
            "DAILY TRAINING COMPLETE",
            { fontSize: "24px", color: "#ffffff" }
        ).setOrigin(0.5);

        const upgrade = this.add.text(width / 2, height / 2 + 20,
            "UNLOCK PRO TRAINING",
            { fontSize: "18px", color: "#00ff00" }
        ).setOrigin(0.5).setInteractive();

        upgrade.on("pointerdown", () => {
            window.location.href = "https://forcesector.com/products/force-sector-pro";
        });
    }

    registerSession() {
        if (this.sessionRegistered) return;
        this.sessionRegistered = true;

        let sessions = parseInt(localStorage.getItem("forcesector_sessions") || "0");
        localStorage.setItem("forcesector_sessions", sessions + 1);
    }
}
