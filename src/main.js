import AuthManager from './AuthManager.js';
import GameScene from './GameScene.js';
import ShopScene from './ShopScene.js';
import EconomyManager from './EconomyManager.js';
import SoundManager from './SoundManager.js';

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 720,
        height: 1280, // Mobile Portrait Aspect Ratio
        parent: 'game-container'
    },
    backgroundColor: '#111111',
    scene: [GameScene, ShopScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    // Fix for high DPI screens to look crisp
    render: {
        pixelArt: false,
        antialias: true
    }
};

// Simple obfuscation to prevent casual console editing
const PRO_HASH = "Zm9yY2VzZWN0b3JfcHJvX2dyYW50ZWQ="; // btoa('forcesector_pro_granted')

window.checkProStatus = function () {
    // Check new token OR legacy flag (migration path)
    if (localStorage.getItem("forcesector_pro") === "true") {
        // Upgrade them automatically
        localStorage.setItem("fs_token", PRO_HASH);
        localStorage.removeItem("forcesector_pro");
        return true;
    }
    return localStorage.getItem("fs_token") === PRO_HASH;
};

// Helper to unlock (dev only or for purchase flow)
window.unlockPro = function () {
    localStorage.setItem("fs_token", PRO_HASH);
    console.log("Pro access granted");
};

// UI: Mode Selection (HTML Overlay)
function showModeSelection(game) {
    const isPro = window.checkProStatus();

    // Simple HTML Overlay
    const overlay = document.createElement('div');
    overlay.id = 'mode-select-overlay';
    // Add scanlines
    const scanlines = document.createElement('div');
    scanlines.className = 'scanlines';
    document.body.appendChild(scanlines);

    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.zIndex = '1000';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    // Background handled by CSS

    const title = document.createElement('h1');
    title.innerText = "FORCE SECTOR";
    title.className = "cyber-title";

    const subtitle = document.createElement('div');
    subtitle.innerText = "SELECT OPERATION";
    subtitle.style.color = "#888";
    subtitle.style.letterSpacing = "2px";
    subtitle.style.marginBottom = "30px";
    subtitle.style.fontFamily = "Orbitron, sans-serif";
    subtitle.style.fontSize = "14px";

    const modes = [
        { id: 'tournament', name: 'CASH TOURNAMENTS', desc: 'Real Money Skills · Win Cash', pro: false },
        { id: 'campaign', name: 'ADVENTURE', desc: 'Campaign · Levels 1-8', pro: false },
        { id: 'standard', name: 'STANDARD', desc: '120s Timer · Normal Difficulty', pro: false },
        { id: 'endurance', name: 'ENDURANCE', desc: 'Survival · No Timer · 1 Miss = Fail', pro: true },
        { id: 'speed', name: 'SPEED', desc: 'Blitz · 60s Timer · 2x Speed', pro: true }
    ];

    modes.forEach(mode => {
        const btn = document.createElement('div');
        const locked = mode.pro && !isPro;

        btn.className = `mode-card ${locked ? 'locked' : ''}`;

        // Inline overrides removed in favor of CSS, but layout needs flex
        btn.style.width = '85%';
        btn.style.maxWidth = '450px';
        btn.style.padding = '25px';
        btn.style.marginBottom = '15px';
        btn.style.cursor = 'pointer';
        btn.style.display = 'flex';
        btn.style.flexDirection = 'column';

        btn.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div class="mode-name" style="color: ${locked ? '#888' : (mode.id === 'campaign' ? '#00FF88' : '#00CCFF')}">${mode.name}</div>
                ${locked ? '🔒' : ''}
            </div>
            <div class="mode-desc">${mode.desc}</div>
        `;

        // Hover Sound
        btn.onmouseenter = () => {
            if (!locked) window.soundManager.playHover();
        };

        btn.onclick = () => {
            window.soundManager.playClick();
            if (locked) {
                // Flash red
                btn.style.borderColor = "#FF3333";
                setTimeout(() => btn.style.borderColor = "#333", 200);
                alert("ACCESS DENIED: UPGRADE REQUIRED");
                return;
            }

            if (mode.id === 'tournament') {
                showTournamentLobby(game);
                return;
            }

            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                overlay.style.display = 'none';
                game.scene.start('GameScene', { mode: mode.id });
            }, 500);
        };

        if (locked) {
            btn.onclick = () => { window.location.href = "https://forcesector.com/products/force-sector-pro"; };
        }

        overlay.appendChild(title);
        overlay.appendChild(subtitle);
        overlay.appendChild(btn);
    });

    // Gear Shop Button
    const shopBtn = document.createElement('div');
    shopBtn.innerText = "⚡ PRO GEAR SHOP";
    shopBtn.style.color = "#FFD700"; // Gold
    shopBtn.style.fontFamily = "Orbitron";
    shopBtn.style.fontSize = "16px";
    shopBtn.style.marginTop = "20px";
    shopBtn.style.cursor = "pointer";
    shopBtn.style.border = "1px solid #FFD700";
    shopBtn.style.padding = "10px 30px";
    shopBtn.style.background = "rgba(255, 215, 0, 0.1)";
    shopBtn.style.letterSpacing = "2px";

    shopBtn.onmouseenter = () => {
        shopBtn.style.background = "rgba(255, 215, 0, 0.3)";
        window.soundManager.playHover();
    };
    shopBtn.onmouseout = () => {
        shopBtn.style.background = "rgba(255, 215, 0, 0.1)";
    };
    shopBtn.onclick = () => {
        window.soundManager.playClick();
        showShopOverlay();
    };

    overlay.appendChild(shopBtn);

    // IN-GAME SHOP (Spending Earnings)
    const inGameShopBtn = document.createElement('div');
    inGameShopBtn.innerText = "🛒 SPEND EARNINGS";
    inGameShopBtn.style.color = "#00FF88";
    inGameShopBtn.style.fontFamily = "Orbitron";
    inGameShopBtn.style.fontSize = "16px";
    inGameShopBtn.style.marginTop = "10px";
    inGameShopBtn.style.cursor = "pointer";
    inGameShopBtn.style.border = "1px solid #00FF88";
    inGameShopBtn.style.padding = "10px 30px";
    inGameShopBtn.style.background = "rgba(0, 255, 136, 0.1)";
    inGameShopBtn.style.letterSpacing = "2px";

    inGameShopBtn.onclick = () => {
        window.soundManager.playClick();
        overlay.style.display = 'none';
        game.scene.start('ShopScene');
    };

    overlay.appendChild(inGameShopBtn);

    document.body.appendChild(overlay);
    return overlay;
}

function showShopOverlay() {
    // Hide Main Menu
    const menu = document.getElementById('mode-select-overlay');
    if (menu) menu.style.display = 'none';

    const overlay = document.createElement('div');
    overlay.id = 'shop-overlay';
    overlay.style.position = 'fixed'; // Fixed to cover everything
    overlay.style.top = '0'; overlay.style.left = '0';
    overlay.style.width = '100vw'; overlay.style.height = '100vh';
    overlay.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.95), rgba(0,0,0,0.9))";
    overlay.style.zIndex = '2000';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.padding = '20px';
    overlay.style.overflowY = 'auto'; // scrollable

    // Header
    const header = document.createElement('div');
    header.innerHTML = `
        <h1 style="font-family: Orbitron; color: #FFD700; text-shadow: 0 0 20px rgba(255,215,0,0.5); margin-bottom: 5px;">TACTICAL SUPPLY</h1>
        <div style="font-family: Rajdhani; color: #888; letter-spacing: 2px; margin-bottom: 30px;">OPTIMIZE YOUR BIOLOGY & HARDWARE</div>
    `;
    overlay.appendChild(header);

    // Products Grid
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
    grid.style.gap = '20px';
    grid.style.width = '100%';
    grid.style.maxWidth = '1000px';

    const products = [
        {
            name: "ZOWIE XL2546K 240Hz",
            tag: "VISUAL CLARITY",
            desc: "The gold standard for esports. DyAc+ technology for zero motion blur.",
            price: "$429.00",
            link: "https://www.amazon.com/s?k=BenQ+ZOWIE+XL2546K"
        },
        {
            name: "Logitech G PRO X Superlight",
            tag: "PRECISION INPUT",
            desc: "Less than 63g. Zero friction. The choice of 90% of pros.",
            price: "$125.00",
            link: "https://www.amazon.com/s?k=Logitech+G+PRO+X+Superlight"
        },
        {
            name: "Gorilla Mind Smooth",
            tag: "COGNITIVE ENHANCEMENT",
            desc: "Stimulant-free focus. Laser-in without the jittery crash.",
            price: "$39.99",
            link: "https://www.amazon.com/s?k=Gorilla+Mind+Smooth"
        },
        {
            name: "Wooting 60HE+",
            tag: "RAPID TRIGGER",
            desc: "Analog switches for instant reset. The fastest keyboard alive.",
            price: "$174.99",
            link: "https://www.amazon.com/s?k=Wooting+60HE"
        }
    ];

    products.forEach(p => {
        const card = document.createElement('div');
        card.style.background = "rgba(255, 255, 255, 0.05)";
        card.style.border = "1px solid #333";
        card.style.padding = "20px";
        card.style.borderRadius = "4px";
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.transition = "transform 0.2s, border-color 0.2s";

        card.onmouseenter = () => {
            card.style.transform = "translateY(-5px)";
            card.style.borderColor = "#FFD700";
            card.style.boxShadow = "0 0 20px rgba(255, 215, 0, 0.1)";
        };
        card.onmouseleave = () => {
            card.style.transform = "translateY(0)";
            card.style.borderColor = "#333";
            card.style.boxShadow = "none";
        };

        card.innerHTML = `
            <div style="color: #FFD700; font-family: Rajdhani; font-size: 12px; font-weight: bold; margin-bottom: 5px;">${p.tag}</div>
            <div style="color: #fff; font-family: Orbitron; font-size: 18px; margin-bottom: 10px;">${p.name}</div>
            <div style="color: #aaa; font-family: Rajdhani; font-size: 14px; margin-bottom: 15px; flex-grow: 1;">${p.desc}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #222; padding-top: 15px;">
                <div style="color: #fff; font-family: Rajdhani; font-size: 20px;">${p.price}</div>
                <button class="buy-btn" style="background: #FFD700; color: #000; border: none; padding: 8px 20px; font-family: Orbitron; font-weight: bold; cursor: pointer;">ACQUIRE</button>
            </div>
        `;

        card.querySelector('.buy-btn').onclick = () => {
            window.open(p.link, '_blank');
        };

        grid.appendChild(card);
    });

    overlay.appendChild(grid);

    // Close Button
    const close = document.createElement('div');
    close.innerText = "RETURN TO OPERATIONS";
    close.style.marginTop = "40px";
    close.style.marginBottom = "20px";
    close.style.fontFamily = "Rajdhani";
    close.style.color = "#666";
    close.style.cursor = "pointer";
    close.onclick = () => {
        overlay.remove();
        if (menu) menu.style.display = 'flex';
    };
    overlay.appendChild(close);

    document.body.appendChild(overlay);
}

// STARTUP LOGIC (Race Condition Fix)
const initGame = () => {
    if (window.gameInitialized) return; // Prevent double init
    window.gameInitialized = true;

    const game = new Phaser.Game(config);

    // Init Sound
    const sound = new SoundManager();
    window.soundManager = sound;

    // Init Auth
    window.authManager = new AuthManager();
    window.economyManager = new EconomyManager();

    // Show Mode Selection
    showModeSelection(game);

    // Global Click Sound
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.classList.contains('mode-card') || e.target.classList.contains('lobby-row')) {
            // Handled individually usually
        }
    });
};

// Check if already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initGame();
} else {
    window.addEventListener('load', initGame);
    // Backup: Ensure it runs if load missed but DOM ready
    window.addEventListener('DOMContentLoaded', initGame);
}

// --- ECONOMY UI FUNCTIONS ---

function showTournamentLobby(game) {
    const eco = window.economyManager;
    const balance = eco.getBalance();

    // Remove old overlay if exists
    const old = document.getElementById('mode-select-overlay');
    if (old) old.style.display = 'none';

    const overlay = document.createElement('div');
    overlay.id = 'tournament-lobby';
    overlay.className = 'lobby-overlay'; // We will add CSS for this
    // Inline basics for now
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = "rgba(0,0,0,0.95)";
    overlay.style.zIndex = "1100";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.alignItems = "center";
    overlay.style.paddingTop = "40px";

    // Header
    const header = document.createElement('div');
    header.innerHTML = `
        <div style="font-family: Orbitron; font-size: 24px; color: #fff; margin-bottom: 10px;">SECTOR BANK</div>
        <div style="font-family: Rajdhani; font-size: 32px; color: #00FF88;">$${balance.real.toFixed(2)} <span style="font-size: 16px; color: #888;">REAL</span></div>
        <div style="font-family: Rajdhani; font-size: 18px; color: #00CCFF;">$${balance.bonus.toFixed(2)} <span style="font-size: 14px; color: #888;">BONUS</span></div>
    `;
    overlay.appendChild(header);

    // Deposit Button
    const depBtn = document.createElement('button');
    depBtn.innerText = "+ ADD FUNDS";
    // ... styles ...
    depBtn.onclick = () => {
        window.soundManager.playClick();
        showDepositModal(eco, () => {
            overlay.remove();
            showTournamentLobby(game); // Refresh
        });
    };
    overlay.appendChild(depBtn);

    // Tournaments List
    const list = document.createElement('div');
    list.style.width = "90%";
    list.style.maxWidth = "400px";

    const tournaments = [
        { name: "ROOKIE SKIRMISH", entry: 1.00, prize: 1.80, desc: "Entry Level" },
        { name: "PRO CIRCUIT", entry: 5.00, prize: 9.00, desc: "High Stakes" },
        { name: "ELITE SECTOR", entry: 10.00, prize: 18.00, desc: "Winner Takes All" }
    ];

    tournaments.forEach(t => {
        const row = document.createElement('div');
        row.style.background = "linear-gradient(90deg, #111, #222)";
        row.style.borderLeft = "4px solid #00FF88";
        row.style.marginBottom = "10px";
        row.style.padding = "15px";
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.alignItems = "center";
        row.style.cursor = "pointer";
        row.style.transition = "transform 0.2s";

        row.onmouseover = () => {
            row.style.transform = "translateX(10px)";
            window.soundManager.playHover();
        };
        row.onmouseout = () => row.style.transform = "translateX(0)";

        row.innerHTML = `
            <div>
                <div style="color: #fff; font-family: Orbitron; font-size: 16px;">${t.name}</div>
                <div style="color: #666; font-size: 12px;">Prize: $${t.prize.toFixed(2)}</div>
            </div>
            <div style="text-align: right;">
                <div style="color: #FF3333; font-family: Rajdhani; font-weight: bold; font-size: 20px;">ENTRY $${t.entry.toFixed(2)}</div>
            </div>
        `;

        row.onclick = () => {
            if (eco.enterTournament(t.entry)) {
                // Matchmaking
                simulateMatchmaking(overlay, async () => {
                    // Start Search
                    try {
                        const { findMatch } = await import('./supabaseClient.js');
                        const result = await findMatch(t.entry);

                        overlay.remove();
                        game.scene.start('GameScene', {
                            mode: 'tournament',
                            tournamentData: t,
                            matchId: result.match.id,
                            role: result.role
                        });
                    } catch (e) {
                        alert("Matchmaking Error: " + e.message);
                        overlay.remove();
                        showModeSelection(game);
                    }
                });
            } else {
                alert("INSUFFICIENT FUNDS");
            }
        };

        list.appendChild(row);
    });

    overlay.appendChild(list);

    // Back Button
    const backBtn = document.createElement('div');
    backBtn.innerText = "BACK TO MENU";
    backBtn.style.marginTop = "auto";
    backBtn.style.padding = "20px";
    backBtn.style.color = "#888";
    backBtn.style.cursor = "pointer";
    backBtn.onclick = () => {
        overlay.remove();
        document.getElementById('mode-select-overlay').style.display = 'flex';
    };
    overlay.appendChild(backBtn);

    document.body.appendChild(overlay);
}

function showDepositModal(eco, onClose) {
    // Determine the overlay to use; usually there's only one active.
    // We'll just create a new modal on top.
    const modal = document.createElement('div');
    modal.style.position = "absolute";
    modal.style.top = "0"; modal.style.left = "0";
    modal.style.width = "100%"; modal.style.height = "100%";
    modal.style.background = "rgba(0,0,0,0.9)";
    modal.style.zIndex = "1200";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";

    const box = document.createElement('div');
    box.style.background = "#111";
    box.style.border = "1px solid #00CCFF";
    box.style.padding = "30px";
    box.style.textAlign = "center";

    box.innerHTML = `
        <h2 style="color: #fff; font-family: Orbitron;">ADD FUNDS</h2>
        <p style="color: #888;">Secure Transaction Simulation</p>
        <div id="dep-opts"></div>
        <button id="close-dep" style="margin-top: 20px; background: transparent; border: 1px solid #555; color: #888; padding: 10px;">CANCEL</button>
    `;

    const amounts = [10, 25, 50];
    const opts = box.querySelector('#dep-opts');
    amounts.forEach(amt => {
        const btn = document.createElement('button');
        btn.innerText = `$${amt}`;
        btn.style.margin = "5px";
        btn.style.padding = "15px 25px";
        btn.style.background = "#00FF88";
        btn.style.border = "none";
        btn.style.fontWeight = "bold";
        btn.style.fontSize = "18px";
        btn.style.cursor = "pointer";
        btn.onclick = () => {
            eco.deposit(amt);
            alert(`SUCCESS: Added $${amt} + 10% Bonus`);
            modal.remove();
            onClose();
        };
        opts.appendChild(btn);
    });

    box.querySelector('#close-dep').onclick = () => modal.remove();
    modal.appendChild(box);
    document.body.appendChild(modal);
}

function simulateMatchmaking(container, onFound) {
    container.innerHTML = ""; // clear lobby
    container.style.justifyContent = "center";

    // Searching UI
    const status = document.createElement('div');
    status.className = "cyber-title";
    status.style.fontSize = "24px";
    status.innerText = "SEARCHING FOR OPPONENT...";
    container.appendChild(status);

    // Sim delay
    setTimeout(() => {
        status.innerText = "OPPONENT FOUND";
        status.style.color = "#FF3333";

        const oppName = document.createElement('div');
        oppName.innerText = "VS  " + (Math.random() > 0.5 ? "NeonStryker" : "CyberViper");
        oppName.style.fontFamily = "Orbitron";
        oppName.style.fontSize = "32px";
        oppName.style.marginTop = "20px";
        container.appendChild(oppName);

        setTimeout(onFound, 2000);
    }, 2000);
}

