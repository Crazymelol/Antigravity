import SoundManager from './SoundManager.js';
import CampaignManager from './CampaignManager.js';
import SecurityManager from './SecurityManager.js';

const DAILY_LIMIT = 1;

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.soundManager = new SoundManager();
        this.campaignManager = new CampaignManager();
        this.securityManager = new SecurityManager();
    }

    init(data) {
        this.gameMode = data.mode || 'standard'; // 'standard', 'endurance', 'speed', 'tournament', 'campaign'
        this.matchId = data.matchId || null;
        this.role = data.role || null;
        this.tournamentData = data.tournamentData || null;
    }

    preload() {
        // Ensure fonts are available (they are loaded in CSS, but this is a double-check if we used assets)
        // No assets to load, but we will use the new font families
    }

    preload() {
        // No external assets required for now, using Phaser Graphics
    }

    create() {
        // --- Access Control Logic ---
        this.sessionRegistered = false;
        // Use global checker if available, else fallback (backward compatibility during dev)
        this.isProUser = window.checkProStatus ? window.checkProStatus() : localStorage.getItem("forcesector_pro") === "true";

        const today = new Date().toDateString();
        const lastPlayDate = localStorage.getItem("forcesector_last_date_v2");
        let sessionsToday = parseInt(localStorage.getItem("forcesector_sessions_v2") || "0");

        if (lastPlayDate !== today) {
            sessionsToday = 0;
            localStorage.setItem("forcesector_sessions_v2", "0");
            localStorage.setItem("forcesector_last_date_v2", today);
        }

        const isLoggedIn = window.authManager && window.authManager.isAuthenticated();
        const limit = isLoggedIn ? 10 : 5;
        // Pro users have no limit
        const dailyCap = this.isProUser ? 999 : limit;

        if (sessionsToday >= dailyCap) {
            this.showLockedScreen(isLoggedIn);
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

        // --- Visuals ---
        this.createParticles();

        // --- UI Layers ---
        this.createUI();

        // --- Live 1v1 Setup ---
        if (this.gameMode === 'tournament' && this.matchId) {
            import('./supabaseClient.js').then(({ subscribeToMatch }) => {
                this.setupLiveMultiplayer(subscribeToMatch);
            });
        }

        // --- Input ---
        this.input.topOnly = true;

        // --- Start Screen ---
        this.showStartScreen();
    }

    createParticles() {
        // Create a particle manager
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(4, 4, 4);
        graphics.generateTexture('particle', 8, 8);

        // Explosion Emitter
        this.emitter = this.add.particles(0, 0, 'particle', {
            speed: { min: 100, max: 400 },
            scale: { start: 1, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 800,
            gravityY: 0,
            blendMode: 'ADD',
            emitting: false
        });
        this.emitter.setDepth(15);
    }

    createGridBackground() {
        // Create a scrolling grid texture
        const width = this.scale.width;
        const height = this.scale.height;

        const gridGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        gridGraphics.lineStyle(1, 0x00CCFF, 0.2);

        // Draw grid lines
        const gridSize = 40;
        for (let x = 0; x <= width; x += gridSize) {
            gridGraphics.moveTo(x, 0);
            gridGraphics.lineTo(x, height);
        }
        for (let y = 0; y <= height; y += gridSize) {
            gridGraphics.moveTo(0, y);
            gridGraphics.lineTo(width, y);
        }
        gridGraphics.strokePath();
        gridGraphics.generateTexture('grid', width, height);

        // Add 2 tiles for scrolling effect
        this.bgGrid1 = this.add.image(width / 2, height / 2, 'grid').setAlpha(0.3).setDepth(0);
        this.bgGrid2 = this.add.image(width / 2, height / 2 - height, 'grid').setAlpha(0.3).setDepth(0);
    }

    update() {
        // Scroll Grid
        if (this.bgGrid1 && this.bgGrid2) {
            this.bgGrid1.y += 0.5;
            this.bgGrid2.y += 0.5;

            if (this.bgGrid1.y >= this.scale.height * 1.5) this.bgGrid1.y = -this.scale.height / 2;
            if (this.bgGrid2.y >= this.scale.height * 1.5) this.bgGrid2.y = -this.scale.height / 2;
        }
    }

    createUI() {
        const width = this.scale.width;

        // Opponent Score UI (Hidden by default, shown in setupLiveMultiplayer)
        this.opponentScoreText = this.add.text(width - 20, 100, "", {
            fontSize: '32px', fontFamily: '"Orbitron", sans-serif', color: '#FF3333', fontWeight: 'bold'
        }).setOrigin(1, 0.5).setDepth(20).setVisible(false);

        // Score Text
        this.createGridBackground(); // Init grid
        // const width = this.scale.width; // Removed redundant declaration

        // Header Background
        this.add.rectangle(width / 2, 60, width, 120, 0x000000, 0.8).setDepth(10);

        // Title
        this.add.text(width / 2, 40, 'FORCESECTOR', {
            fontSize: '32px',
            fontFamily: '"Orbitron", sans-serif',
            fontWeight: 'bold',
            color: this.colors.text
        }).setOrigin(0.5).setDepth(11).setShadow(0, 0, '#00CCFF', 10);

        // Subtitle Mode Display
        this.add.text(width / 2, 85, this.gameMode.toUpperCase() + (this.gameMode === 'campaign' ? ` - LEVEL ${this.levelConfig.id}` : " MODE"), {
            fontSize: '18px', fontFamily: '"Rajdhani", sans-serif', color: '#00CCFF'
        }).setOrigin(0.5).setDepth(11);

        // HUD Container
        this.hudContainer = this.add.container(0, 0).setDepth(10);

        // Timer
        this.timerText = this.add.text(40, 90, 'TIME: 120', {
            fontSize: '28px',
            fontFamily: '"Orbitron", monospace',
            color: this.colors.text
        }).setOrigin(0, 0.5);

        // Score
        this.scoreText = this.add.text(width - 40, 90, 'SCORE: 0', {
            fontSize: '28px',
            fontFamily: '"Orbitron", monospace',
            color: this.colors.text
        }).setOrigin(1, 0.5);

        this.hudContainer.add([this.timerText, this.scoreText]);
        this.hudContainer.setVisible(false);
    }

    showStartScreen() {
        const width = this.scale.width;
        const height = this.scale.height;

        this.startContainer = this.add.container(0, 0).setDepth(20);

        const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8); // Slightly richer bg opacity
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

        // LEADERBOARD BUTTON
        const lbBtn = this.add.text(width / 2, height * 0.85, '🏆 GLOBAL LEADERBOARD', {
            fontSize: '20px', fontFamily: 'Arial', color: '#888'
        }).setOrigin(0.5).setInteractive();

        lbBtn.on('pointerdown', () => {
            this.showLeaderboard(this.startContainer);
        });

        this.startContainer.add([bg, title, subtext, startBtn, startText, lbBtn]);
    }

    async showLeaderboard(container) {
        const width = this.scale.width;
        const height = this.scale.height;

        // Simple overlay
        const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.95);
        const title = this.add.text(width / 2, 100, "TOP AGENTS", { fontSize: '40px', color: '#00CCFF', fontWeight: 'bold' }).setOrigin(0.5);

        const closeBtn = this.add.text(width / 2, height - 80, "CLOSE", { fontSize: '30px', color: '#fff' }).setOrigin(0.5).setInteractive();
        closeBtn.on('pointerdown', () => {
            bg.destroy(); title.destroy(); closeBtn.destroy(); listContainer.destroy();
            if (loginPromptContainer) loginPromptContainer.destroy();
        });

        const listContainer = this.add.container(0, 0);
        container.add([bg, title, closeBtn, listContainer]);

        let loginPromptContainer;

        if (!window.authManager || !window.authManager.isAuthenticated()) {
            loginPromptContainer = this.add.container(0, 0);
            const loginText = this.add.text(width / 2, height * 0.4, "Login to view global leaderboard.", {
                fontSize: '28px', color: '#fff', align: 'center'
            }).setOrigin(0.5);
            const loginBtn = this.add.text(width / 2, height * 0.5, "LOGIN", {
                fontSize: '36px', color: '#00FF88', fontWeight: 'bold'
            }).setOrigin(0.5).setInteractive();

            loginBtn.on('pointerdown', () => {
                window.authManager.login();
            });
            loginPromptContainer.add([loginText, loginBtn]);
            container.add(loginPromptContainer);
            return;
        }

        // Fetch data
        const data = await window.authManager.getLeaderboard();

        data.forEach((entry, i) => {
            const y = 200 + (i * 80);
            const rank = this.add.text(100, y, `#${i + 1}`, { fontSize: '30px', color: '#fff' }).setOrigin(0, 0.5);
            const name = this.add.text(200, y, entry.email ? entry.email.split('@')[0] : entry.name || 'Anonymous', { fontSize: '30px', color: '#eee' }).setOrigin(0, 0.5);
            const score = this.add.text(620, y, entry.score, { fontSize: '30px', color: '#00FF88', fontWeight: 'bold' }).setOrigin(1, 0.5);

            listContainer.add([rank, name, score]);
        });
    }

    startGame() {
        this.registerSession(); // Count session only when actually starting
        this.startContainer.setVisible(false);
        this.hudContainer.setVisible(true);
        this.isGameActive = true;

        // Mode Specific Init
        this.sessionDuration = (this.gameMode === 'speed') ? 60 : 120;

        if (this.gameMode === 'campaign') {
            this.levelConfig = this.campaignManager.getCurrentLevel();
            this.sessionDuration = 0; // Untimed mostly, or we can add a limit? Let's say untimed for now, or just display "TARGETS LEFT"
            this.stimulusDisplayTime = this.levelConfig.speed;
        }

        if (this.gameMode === 'endurance') this.sessionDuration = 0; // Infinite

        // Reset Stats
        this.score = 0;
        this.timeLeft = (this.gameMode === 'endurance') ? 0 : this.sessionDuration;
        this.reactionTimes = [];
        this.correctHits = 0;
        this.totalStimuli = 0;
        this.totalStimuli = 0;
        this.currentDifficulty = 1;
        this.combo = 0; // New Combo Tracker

        // Start Timer
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.onSecondElapsed,
            callbackScope: this,
            loop: true
        });

        // Start Spawning (Delay slightly for intro)
        // Start Spawning (Delay slightly for intro)
        if (this.gameMode === 'campaign') {
            this.showLevelIntro(() => {
                this.securityManager.startSession();
                this.nextTurn();
            });
        } else {
            this.securityManager.startSession();
            this.nextTurn();
        }
    }

    showLevelIntro(onComplete) {
        const { width, height } = this.scale;
        const container = this.add.container(0, 0).setDepth(40);

        const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);

        const line1 = this.add.text(width / 2, height * 0.4, `LEVEL ${this.levelConfig.id}`, {
            fontSize: '60px', fontFamily: '"Orbitron", sans-serif', color: '#00CCFF', fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0).setScale(2);

        const line2 = this.add.text(width / 2, height * 0.5, this.levelConfig.name.toUpperCase(), {
            fontSize: '40px', fontFamily: '"Rajdhani", sans-serif', color: '#FFF'
        }).setOrigin(0.5).setAlpha(0).setY(height * 0.5 + 50);

        const line3 = this.add.text(width / 2, height * 0.6, this.levelConfig.description, {
            fontSize: '20px', fontFamily: '"Rajdhani", sans-serif', color: '#888'
        }).setOrigin(0.5).setAlpha(0);

        container.add([bg, line1, line2, line3]);

        // Sequence
        this.tweens.add({
            targets: line1,
            alpha: 1,
            scale: 1,
            duration: 500,
            ease: 'Back.out',
            onComplete: () => {
                this.soundManager.playSuccess(); // Reuse success sound as 'ping'
                this.tweens.add({
                    targets: [line2, line3],
                    alpha: 1,
                    y: '-=20',
                    duration: 500,
                    delay: 200,
                    onComplete: () => {
                        this.time.delayedCall(1500, () => {
                            this.tweens.add({
                                targets: container,
                                alpha: 0,
                                duration: 500,
                                onComplete: () => {
                                    container.destroy();
                                    onComplete();
                                }
                            });
                        });
                    }
                });
            }
        });
    }

    onSecondElapsed() {
        this.timeLeft--;

        if (this.gameMode === 'endurance') {
            this.timerText.setText(`TIME: ${Math.abs(this.timeLeft)}`); // Count UP
        } else if (this.gameMode === 'campaign') {
            const left = this.levelConfig.targets - this.correctHits;
            this.timerText.setText(`REMAINING: ${left}`);
        } else {
            this.timerText.setText(`TIME: ${this.timeLeft}`);
        }

        // Audio Tick for last 5 seconds (Only in timed modes)
        if (this.gameMode !== 'endurance' && this.timeLeft <= 5 && this.timeLeft > 0) {
            this.soundManager.playTick();
        }

        // Background Pulse
        // Replaced simple bg color change with grid tinting or something subtler to not hide grid
        // this.cameras.main.setBackgroundColor('#1a1a1a'); 
        // Logic: Flash the camera slightly red/white on ticks? 
        // Keeping it simple for now, maybe just pulse the text
        this.tweens.add({
            targets: this.timerText,
            scale: 1.1,
            duration: 100,
            yoyo: true
        });

        // Increase difficulty
        const diffInterval = (this.gameMode === 'speed') ? 10 : 20;
        const timeElapsed = (this.gameMode === 'endurance') ? Math.abs(this.timeLeft) : (this.sessionDuration - this.timeLeft);

        if (this.gameMode !== 'campaign' && timeElapsed > diffInterval * this.currentDifficulty) {
            this.currentDifficulty++;

            // Speed Mode scales faster
            const baseSpeed = (this.gameMode === 'speed') ? 1500 : 2000;
            const dropRate = (this.gameMode === 'speed') ? 250 : 200;

            this.stimulusDisplayTime = Math.max(500, baseSpeed - (this.currentDifficulty * dropRate));
        }

        if (this.gameMode !== 'endurance' && this.timeLeft <= 0) {
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
        const distCount = (this.gameMode === 'campaign') ? this.levelConfig.distractors : numDistractors;

        for (let i = 0; i < distCount; i++) {
            this.spawnStimulus(false, positions);
        }

        this.turnTimer = this.time.delayedCall(this.stimulusDisplayTime, () => {
            if (this.isGameActive) {
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

        // Security Log
        if (isTarget) {
            this.securityManager.log('SPAWN', { x, y });
        }

        // Inner circle for "Cyber" look
        const inner = this.add.circle(x, y, 45, 0x000000);
        const core = this.add.circle(x, y, 35, color);

        // Group them to destroy easily?
        // Actually Scene.add.group is better, but keeping it simple with containers or just properties
        circle.inner = inner;
        circle.core = core;
        circle.setDepth(12);
        inner.setDepth(12);
        core.setDepth(12);

        // Pulse animation
        this.tweens.add({
            targets: [circle, core],
            scaleX: 1.1,
            scaleY: 1.1,
            alpha: 0.8,
            duration: 400,
            yoyo: true,
            repeat: -1
        });

        // Store spawn time for reaction calc
        const spawnTime = this.time.now;

        circle.on('pointerdown', () => {
            if (!this.isGameActive) return;

            if (isTarget) {
                this.soundManager.playSuccess(this.combo); // Pass combo
                this.handleSuccess(spawnTime, circle.x, circle.y);
            } else {
                this.soundManager.playFail(); // Fail resets combo internally in handleFail is best
                this.handleFailure();
            }

            // Cleanup
            if (this.turnTimer) this.turnTimer.remove();
            this.nextTurn();
        });

        // Hack to make the inner elements click-through or just destroy them with the parent
        // Actually, just pushing the main circle to activeTargets is enough if we override destroy
        const originalDestroy = circle.destroy.bind(circle);
        circle.destroy = () => {
            if (inner.active) inner.destroy();
            if (core.active) core.destroy();
            originalDestroy();
        };

        this.activeTargets.push(circle);
    }

    handleSuccess(spawnTime, x, y) {
        // Security Log
        this.securityManager.log('HIT', { x, y, rt: this.time.now - spawnTime });

        // reaction time
        const rt = this.time.now - spawnTime;
        this.reactionTimes.push(rt);
        this.correctHits++;
        this.totalStimuli++; // We count 'turns' where they acted
        this.combo++; // Combo Up

        // Score formula: Base points + Speed bonus
        const speedBonus = Math.max(0, 1000 - rt);
        const points = 100 + Math.floor(speedBonus / 2);
        this.score += points;

        if (this.gameMode === 'campaign') {
            if (this.correctHits >= this.levelConfig.targets) {
                this.campaignWin();
                return;
            }
        }

        this.scoreText.setText(`SCORE: ${this.score}`);

        // Visuals
        this.emitter.emitParticleAt(x, y, 30); // More particles!

        // Ring Ripple Effect
        const ring = this.add.circle(x, y, 60, this.colors.target);
        ring.setStrokeStyle(4, this.colors.target);
        ring.setFillStyle(0x000000, 0); // Transparent fill
        this.tweens.add({
            targets: ring,
            scale: 3,
            alpha: 0,
            duration: 500,
            onComplete: () => ring.destroy()
        });

        this.showFloatText(x, y, `+${points}`, 0x00FF00);

        // Show Combo
        if (this.combo > 1) {
            this.showFloatText(x, y - 40, `COMBO x${this.combo}`, 0x00CCFF, 1.2 + (this.combo * 0.1));
        }
    }

    handleFailure() {
        this.totalStimuli++;

        // ENDURANCE MODE OR CAMPAIGN: Instant Death if distractor hit? 
        // Let's make Campaign more forgiving? No, "Interference" says "Do NOT hit them".
        if (this.gameMode === 'endurance' || (this.gameMode === 'campaign' && this.levelConfig.distractors > 0)) {
            this.soundManager.playFail();
            this.cameras.main.shake(400, 0.02);
            this.endGame();
            return;
        }

        // Penalty
        this.score = Math.max(0, this.score - 50);
        this.scoreText.setText(`SCORE: ${this.score}`);

        if (this.combo > 2) {
            this.showFloatText(this.scale.width / 2, this.scale.height / 2, "COMBO LOST", 0xFF0000, 2);
        }
        this.combo = 0; // Reset Combo

        // Camera shake or flash
        this.cameras.main.shake(200, 0.01);
        this.cameras.main.flash(200, 0xff0000, 0.2);
    }

    showFloatText(x, y, msg, color, scale = 1) {
        const text = this.add.text(x, y, msg, {
            fontSize: '32px',
            fontFamily: '"Orbitron", sans-serif',
            fontWeight: 'bold',
            color: typeof color === 'number' ? '#' + color.toString(16) : color,
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5).setScale(scale);

        this.tweens.add({
            targets: text,
            y: y - 50,
            alpha: 0,
            duration: 800,
            onComplete: () => text.destroy()
        });
    }

    async endGame() {
        this.isGameActive = false;
        if (this.gameTimer) this.gameTimer.remove();
        if (this.turnTimer) this.turnTimer.remove();
        if (this.activeTargets) this.activeTargets.forEach(t => t.destroy());

        // Security Validation
        const replay = await this.securityManager.generateReplayData();
        const secure = await this.securityManager.verify(replay);

        if (!secure) {
            alert("SECURITY ALERT: Cheat Detected! Score Voided.");
            this.score = 0;
            this.scene.start('GameScene', { mode: 'standard' }); // Reset
            return;
        }

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

        // STREAK & HISTORY TRACKING
        const historyStr = localStorage.getItem("forcesector_history");
        const history = historyStr ? JSON.parse(historyStr) : [];

        // Add current session
        history.push({
            date: new Date().toISOString().split('T')[0],
            score: finalScore,
            rt: avgRT
        });

        // Keep last 10
        if (history.length > 10) history.shift();
        localStorage.setItem("forcesector_history", JSON.stringify(history));

        // Show Summary
        this.showSummary(finalScore, avgRT, accuracy, isNewBest, history);

        // ECONOMY REWARDS
        let reward = 0;

        // Campaign Reward
        const passed = false; // logic handled in campaignWin, this is endGame (fail/timeout)
        const unlocked = false;
        if (this.gameMode === 'campaign' && passed && unlocked) {
            reward += (this.levelConfig.id * 0.05); // Level 1 = 0.05, Level 10 = 0.50
        }

        // Performance Reward
        const rating = this.getRating(avgRT, accuracy);
        if (rating.title === "CYBER GOD") reward += 0.10;
        else if (rating.title === "ELITE AGENT") reward += 0.05;

        // Apply
        if (reward > 0 && window.economyManager) {
            window.economyManager.addBonus(reward);
            // Show on summary
            this.currentReward = reward; // Pass to showSummary via property or argument, but showSummary is already called.
            // Actually, showSummary is called BEFORE this. Let me move this logic INSIDE showSummary or call showSummary AFTER this.
            // Moving showSummary call to AFTER this block and passing reward.
        }


        // Show Summary
        this.showSummary(finalScore, avgRT, accuracy, isNewBest, history, reward);

        // TOURNAMENT SUBMISSION (Multiplayer)
        if (this.gameMode === 'tournament' && this.matchId) {
            console.log("Submitting match score:", this.matchId, finalScore);
            import('/src/supabaseClient.js').then(async ({ submitMatchScore }) => {
                // Add temporary feedback text
                const width = this.scale.width;
                const feedback = this.add.text(width / 2, 50, "SUBMITTING MATCH DATA...", {
                    fontSize: '20px', color: '#00FF88', fontFamily: 'Orbitron'
                }).setOrigin(0.5).setDepth(100);

                try {
                    const { match, isFinished } = await submitMatchScore(this.matchId, finalScore);
                    feedback.destroy();

                    if (isFinished) {
                        const didWin = match.winner_id === window.economyManager.user_id;
                        const resultText = didWin ? "VICTORY" : "DEFEAT";
                        const resultColor = didWin ? "#FFD700" : "#FF3333";

                        this.add.text(width / 2, 80, resultText, {
                            fontSize: '40px', color: resultColor, fontWeight: 'bold', fontFamily: 'Orbitron'
                        }).setOrigin(0.5).setDepth(100);

                        if (didWin) {
                            window.economyManager.awardPrize(match.wager * 1.8);
                            window.soundManager.playSuccess();
                        }
                    } else {
                        this.add.text(width / 2, 80, "WAITING FOR OPPONENT...", {
                            fontSize: '24px', color: '#888', fontFamily: 'Rajdhani'
                        }).setOrigin(0.5).setDepth(100);
                    }
                } catch (e) {
                    console.error(e);
                    feedback.setText("SUBMISSION ERROR");
                    feedback.setColor('#FF3333');
                }
            });
        }

        // No auto-submit. Waiting for user input.
    }

    getRating(rt, acc) {
        // Accuracy penalty
        if (acc < 80) return { title: "UNSTABLE", color: "#FF3333" }; // Red

        if (rt < 250) return { title: "CYBER GOD", color: "#FFD700" }; // Gold
        if (rt < 350) return { title: "ELITE AGENT", color: "#00FF88" }; // Green
        if (rt < 450) return { title: "OPERATIVE", color: "#00CCFF" }; // Blue
        if (rt < 600) return { title: "ROOKIE", color: "#FFFFFF" }; // White
        return { title: "CIVILIAN", color: "#888888" }; // Grey
    }

    showSummary(score, rt, acc, isBest, history, reward = 0) {
        const width = this.scale.width;
        const height = this.scale.height;

        const container = this.add.container(0, 0).setDepth(30);
        const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.95);

        const title = this.add.text(width / 2, height * 0.15, 'SESSION COMPLETE', {
            fontSize: '48px', fontFamily: 'Arial', fontWeight: 'bold', color: '#fff'
        }).setOrigin(0.5);

        const scoreLabel = this.add.text(width / 2, height * 0.30, `${score}`, {
            fontSize: '80px', fontFamily: 'Arial', fontWeight: 'bold', color: this.colors.target
        }).setOrigin(0.5);

        const scoreSub = this.add.text(width / 2, height * 0.38, isBest ? 'NEW PERSONAL BEST!' : 'FINAL SCORE', {
            fontSize: '24px', fontFamily: 'Arial', color: '#aaa'
        }).setOrigin(0.5);

        // Rating Logic
        const rating = this.getRating(rt, acc);
        const ratingText = this.add.text(width / 2, height * 0.48, rating.title, {
            fontSize: '40px', fontFamily: '"Orbitron", sans-serif', fontWeight: 'bold', color: rating.color
        }).setOrigin(0.5).setShadow(0, 0, rating.color, 10);

        const statsText = `Avg Reaction: ${rt}ms\nAccuracy: ${acc}%`;
        const stats = this.add.text(width / 2, height * 0.58, statsText, {
            fontSize: '32px', fontFamily: 'Arial', color: '#fff', align: 'center', lineSpacing: 10
        }).setOrigin(0.5);

        if (reward > 0) {
            this.add.text(width / 2, height * 0.65, `BONUS EARNED: $${reward.toFixed(2)}`, {
                fontSize: '36px', fontFamily: '"Orbitron", sans-serif', color: '#00FF88', fontWeight: 'bold'
            }).setOrigin(0.5).setShadow(0, 0, '#00FF88', 20);
        }

        const restartBtn = this.add.rectangle(width / 2, height * 0.75, 300, 80, 0xffffff).setInteractive();
        const restartText = this.add.text(width / 2, height * 0.75, 'TRAIN AGAIN', {
            fontSize: '32px', fontFamily: 'Arial', fontWeight: 'bold', color: '#000000'
        }).setOrigin(0.5);

        restartBtn.on('pointerdown', () => {
            this.scene.restart();
        });

        this.drawHistoryChart(container, history, width, height);

        // SUBMIT SCORE BUTTON
        const submitBtn = this.add.rectangle(width / 2, height * 0.85, 300, 60, 0x00CCFF).setInteractive();
        const submitText = this.add.text(width / 2, height * 0.85, 'SUBMIT TO ARCHIVE', {
            fontSize: '24px', fontFamily: 'Arial', fontWeight: 'bold', color: '#000'
        }).setOrigin(0.5);

        submitBtn.on('pointerdown', async () => {
            if (window.authManager) {
                await window.authManager.submitScore(score, this.gameMode);
                submitText.setText("ARCHIVED ✓");
                submitBtn.disableInteractive();
                submitBtn.setFillStyle(0x555555);
            }
        });

        container.add([bg, title, scoreLabel, scoreSub, ratingText, stats, restartBtn, restartText, submitBtn, submitText]);
    }

    drawHistoryChart(container, history, width, height) {
        if (!history || history.length < 2) return;

        const chartHeight = 150;
        const chartWidth = 400;
        const startX = width / 2 - chartWidth / 2;
        const startY = height * 0.55 + 60; // Below stats

        const graphics = this.scene.scene.add.graphics();
        container.add(graphics);

        graphics.lineStyle(2, 0x555555, 1);
        graphics.beginPath();
        graphics.moveTo(startX, startY + chartHeight);
        graphics.lineTo(startX + chartWidth, startY + chartHeight);
        graphics.strokePath();

        // Normalize scores for chart
        const maxScore = Math.max(...history.map(h => h.score), 100);
        const barWidth = (chartWidth / history.length) - 10;

        history.forEach((h, index) => {
            const hRatio = h.score / maxScore;
            const hHeight = hRatio * chartHeight;
            const x = startX + index * (barWidth + 10);
            const y = startY + chartHeight - hHeight;

            graphics.fillStyle(h.score === this.score ? 0x00FF88 : 0x00CCFF, 0.8);
            graphics.fillRect(x, y, barWidth, hHeight);
        });

        // Label
        const label = this.scene.scene.add.text(width / 2, startY + chartHeight + 10, "LAST SESSIONS", {
            fontSize: '14px', fontFamily: 'Arial', color: '#666'
        }).setOrigin(0.5);
        container.add(label);
    }

    showLockedScreen(isLoggedIn) {
        const { width, height } = this.scale;

        // Darker, red-tinted background
        this.add.rectangle(width / 2, height / 2, width, height, 0x110000, 0.95);

        // Security Icon (Mocked with text)
        this.add.text(width / 2, height * 0.25, "🔒", { fontSize: '80px' }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.35, "ACCESS DENIED", {
            fontSize: "48px", color: "#FF3333", fontFamily: "Orbitron", fontWeight: "bold"
        }).setOrigin(0.5).setShadow(0, 0, '#FF0000', 20);

        this.add.text(width / 2, height * 0.42, "DAILY TRAINING ALLOWANCE EXCEEDED", {
            fontSize: "20px", color: "#888", fontFamily: "Rajdhani", letterSpacing: "2px"
        }).setOrigin(0.5);

        if (!isLoggedIn) {
            // ... existing Guest prompts ...
            this.add.text(width / 2, height / 2,
                "REGISTER TO UNLOCK 3 DAILY ATTEMPTS",
                { fontSize: "24px", color: "#fff", fontFamily: "Rajdhani" }
            ).setOrigin(0.5);
            // ...
            const loginBtn = this.add.rectangle(width / 2, height / 2 + 80, 280, 60, 0x00CCFF).setInteractive();
            this.add.text(width / 2, height / 2 + 80, "ACCESS TERMINAL", { fontSize: '24px', color: '#000', fontWeight: 'bold' }).setOrigin(0.5);

            loginBtn.on('pointerdown', () => {
                window.authManager.showLogin();
                window.authManager.loginResolve = (user) => { if (user) this.scene.restart(); };
            });

        } else {
            this.add.text(width / 2, height * 0.42, "DAILY TRAINING ALLOWANCE EXCEEDED", {
                fontSize: "20px", color: "#aaa", fontFamily: "Arial"
            }).setOrigin(0.5);

            // --- TIER CONTAINER ---
            const tiers = [
                { name: "INITIATE", price: "$0.99", color: "#FFFFFF", plays: "+10 Daily Runs", link: "https://buy.stripe.com/5kQ4gz2Euc1q4svdeP8Ra02", desc: "For New Recruits" },
                { name: "MERCENARY", price: "$1.99", color: "#00FF88", plays: "+50 Daily Runs", link: "https://buy.stripe.com/8x23cv3IyfdCgbd4Ij8Ra01", desc: "Serious Training" },
                { name: "LEGEND", price: "$4.99", color: "#FFD700", plays: "UNLIMITED", link: "https://buy.stripe.com/7sY28ra6W5D25wz0s38Ra00", desc: "Gold Status" }
            ];

            let startX = width / 2 - 220;
            const gap = 220;

            tiers.forEach((t, i) => {
                const x = startX + (i * gap);
                const y = height * 0.65;

                // Card Bg
                const card = this.add.rectangle(x, y, 200, 300, 0x000000).setStrokeStyle(2, parseInt(t.color.replace('#', '0x')));
                card.setInteractive({ useHandCursor: true });

                // Hover
                card.on('pointerover', () => {
                    card.setFillStyle(0x222222);
                    this.tweens.add({ targets: card, scale: 1.05, duration: 100 });
                });
                card.on('pointerout', () => {
                    card.setFillStyle(0x000000);
                    this.tweens.add({ targets: card, scale: 1, duration: 100 });
                });

                // Action
                card.on('pointerdown', () => {
                    if (t.link === '#') {
                        alert("Link coming soon!");
                    } else {
                        window.open(t.link, '_blank');
                    }
                });

                // Content
                this.add.text(x, y - 100, t.name, { fontSize: '24px', fontFamily: 'Orbitron', fontWeight: 'bold', color: t.color }).setOrigin(0.5);
                this.add.text(x, y - 60, t.price, { fontSize: '36px', fontFamily: 'Arial', fontWeight: 'bold', color: '#fff' }).setOrigin(0.5);
                this.add.text(x, y + 20, t.plays, { fontSize: '18px', fontFamily: 'Rajdhani', color: '#ccc' }).setOrigin(0.5);
                this.add.text(x, y + 80, t.desc.toUpperCase(), { fontSize: '14px', fontFamily: 'Arial', color: '#666' }).setOrigin(0.5);

                this.add.text(x, y + 120, "SELECT", { fontSize: '16px', color: t.color, fontWeight: 'bold' }).setOrigin(0.5);
            });

            // Restore Footer
            if (!isLoggedIn) {
                const loginText = this.add.text(width / 2, height * 0.9, "Already an agent? Login to restore access.", {
                    fontSize: "18px", color: "#fff", textDecoration: "underline"
                }).setOrigin(0.5).setInteractive({ useHandCursor: true });

                loginText.on('pointerdown', () => {
                    window.location.reload();
                });
            }
        }
    }

    campaignWin() {
        this.isGameActive = false;
        if (this.gameTimer) this.gameTimer.remove();
        if (this.turnTimer) this.turnTimer.remove();
        if (this.activeTargets) this.activeTargets.forEach(t => t.destroy());

        const width = this.scale.width;
        const height = this.scale.height;

        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.9);

        // Check Minimum Score
        const minPoints = this.levelConfig.minScore || 0;
        const passed = this.score >= minPoints;

        let unlocked = false;
        let reward = 0;

        if (passed) {
            // Unlock Logic
            unlocked = this.campaignManager.unlockNextLevel(this.levelConfig.id);

            // Reward
            reward = (this.levelConfig.id * 0.05); // Cash Reward
            if (window.economyManager) window.economyManager.addBonus(reward);
        }

        const titleText = passed ? "SECTOR CLEARED" : "SECTOR FAILED";
        const titleColor = passed ? "#00FF88" : "#FF3333";

        this.add.text(width / 2, height * 0.3, titleText, {
            fontSize: '48px', fontFamily: '"Orbitron", sans-serif', color: titleColor, fontWeight: 'bold'
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.45, `SCORE: ${this.score}`, {
            fontSize: '60px', fontFamily: '"Orbitron", sans-serif', color: '#fff'
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.55, `REQ: ${minPoints}`, {
            fontSize: '24px', fontFamily: '"Rajdhani", sans-serif', color: '#888'
        }).setOrigin(0.5);

        if (!passed) {
            this.add.text(width / 2, height * 0.6, "PERFORMANCE INSUFFICIENT", {
                fontSize: '24px', fontFamily: '"Rajdhani", sans-serif', color: '#FF3333'
            }).setOrigin(0.5);
        } else if (reward > 0) {
            this.add.text(width / 2, height * 0.6, `CREDITS ACCRUED: $${reward.toFixed(2)}`, {
                fontSize: '32px', fontFamily: '"Orbitron", sans-serif', color: '#00FF88'
            }).setOrigin(0.5);
        }

        const btnText = passed ? "NEXT SECTOR >" : "RETRY SECTOR";

        // If passed but no next level (game complete)
        const isGameComplete = passed && !unlocked && this.levelConfig.id >= 20; // Last level
        const finalBtnText = isGameComplete ? "CAMPAIGN COMPLETE" : btnText;

        const btn = this.add.rectangle(width / 2, height * 0.75, 300, 80, passed ? 0x00CCFF : 0xFFFFFF).setInteractive();
        this.add.text(width / 2, height * 0.75, finalBtnText, {
            fontSize: '32px', fontFamily: 'Arial', fontWeight: 'bold', color: '#000'
        }).setOrigin(0.5);

        btn.on('pointerdown', () => {
            if (passed && !isGameComplete) {
                // Determine next level
                // Simple reload to fetch new Level ID from storage? Or update scene data?
                // Reloading checks storage in create()
                this.scene.restart();
            } else {
                this.scene.restart();
            }
        });

        // Return to Menu
        const menuBtn = this.add.text(width / 2, height * 0.9, "EXIT TO MENU", {
            fontSize: '24px', fontFamily: 'Arial', color: '#888'
        }).setOrigin(0.5).setInteractive();

        menuBtn.on('pointerdown', () => {
            window.location.reload(); // Simplest way to get back to mode select for now
        });
    }


    registerSession() {
        if (this.sessionRegistered) return;
        this.sessionRegistered = true;

        let sessions = parseInt(localStorage.getItem("forcesector_sessions") || "0");
        localStorage.setItem("forcesector_sessions", sessions + 1);
    }

    setupLiveMultiplayer(subscribeToMatch) {
        this.opponentScoreText.setVisible(true);
        this.opponentScoreText.setText("OPPONENT: 0");

        this.matchSubscription = subscribeToMatch(this.matchId, (updatedMatch) => {
            // Determine if we are P1 or P2 to find Opponent Score
            // If we don't have user_id easily, we can deduce it:
            // We are NOT the one whose score equals our local score? No, that's risky.
            // Let's assume AuthManager has user.

            const myId = window.authManager?.user?.id;
            if (!myId) return;

            let oppScore = 0;
            if (updatedMatch.player1_id === myId) {
                oppScore = updatedMatch.p2_score;
            } else {
                oppScore = updatedMatch.p1_score;
            }

            this.opponentScoreText.setText(`OPPONENT: ${oppScore}`);

            // Effect on score change?
            this.tweens.add({
                targets: this.opponentScoreText,
                scale: 1.2,
                duration: 100,
                yoyo: true
            });
        });
    }
}
