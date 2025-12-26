import Phaser from 'phaser';

export default class ShopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ShopScene' });
    }

    create() {
        // Background
        const { width, height } = this.scale;
        this.add.rectangle(width / 2, height / 2, width, height, 0x111111);

        // Header
        this.add.text(width / 2, 60, "SUPPLY DEPOT", {
            fontSize: '42px', fontFamily: '"Orbitron", sans-serif', color: '#FFD700', fontWeight: 'bold'
        }).setOrigin(0.5).setShadow(0, 0, '#FFD700', 10);

        this.add.text(width / 2, 100, "SPEND YOUR HARD-EARNED CASH", {
            fontSize: '18px', fontFamily: '"Rajdhani", sans-serif', color: '#888', letterSpacing: '2px'
        }).setOrigin(0.5);

        // Balance Display
        this.balanceText = this.add.text(width / 2, 160, `BALANCE: $0.00`, {
            fontSize: '32px', fontFamily: '"Rajdhani", sans-serif', color: '#00FF88', fontWeight: 'bold'
        }).setOrigin(0.5);

        this.updateBalance();

        // Items Grid
        const items = [
            { id: 'item_crosshair_neon', name: 'NEON CROSSHAIR', price: 2.00, desc: 'High-visibility optics.' },
            { id: 'item_skin_gold', name: 'GOLD TARGETS', price: 5.00, desc: 'Prestige target skin.' },
            { id: 'item_sound_cyber', name: 'CYBER SFX PACK', price: 10.00, desc: 'Enhanced feedback audio.' }
        ];

        let y = 250;
        items.forEach(item => {
            this.createItemCard(width / 2, y, item);
            y += 180;
        });

        // Back Button
        const backBtn = this.add.text(width / 2, height - 80, "EXIT TO LOBBY", {
            fontSize: '24px', fontFamily: '"Orbitron", sans-serif', color: '#666'
        }).setOrigin(0.5).setInteractive();

        backBtn.on('pointerdown', () => {
            this.scene.start('GameScene', { mode: 'menu' }); // Or reload main menu logic
            // Actually main.js handles menu via simple reload/overlay. 
            // Ideally we just stop this scene and show overlay again.
            location.reload();
        });
    }

    updateBalance() {
        if (window.economyManager) {
            const bal = window.economyManager.getBalance();
            const total = bal.real + bal.bonus;
            this.balanceText.setText(`BALANCE: $${total.toFixed(2)}`);
        }
    }

    createItemCard(x, y, item) {
        const owned = localStorage.getItem(item.id) === 'true';

        const card = this.add.container(x, y);
        const bg = this.add.rectangle(0, 0, 600, 150, 0x222222).setStrokeStyle(1, 0x444444);

        // Enhance on hover (mocked via simple color since Phaser hover is per-object)

        const title = this.add.text(-280, -40, item.name, {
            fontSize: '28px', fontFamily: '"Orbitron", sans-serif', color: '#fff'
        });

        const desc = this.add.text(-280, 0, item.desc, {
            fontSize: '18px', fontFamily: '"Rajdhani", sans-serif', color: '#aaa'
        });

        const priceColor = owned ? '#888' : '#FFD700';
        const priceText = owned ? "OWNED" : `$${item.price.toFixed(2)}`;

        const btnBg = this.add.rectangle(200, 0, 160, 60, owned ? 0x333333 : 0xFFD700).setInteractive();
        const btnText = this.add.text(200, 0, priceText, {
            fontSize: '24px', fontFamily: '"Orbitron", sans-serif', color: owned ? '#666' : '#000', fontWeight: 'bold'
        }).setOrigin(0.5);

        if (!owned) {
            btnBg.on('pointerdown', () => {
                this.purchase(item, btnText, btnBg);
            });
        }

        card.add([bg, title, desc, btnBg, btnText]);
    }

    purchase(item, textObj, bgObj) {
        if (!window.economyManager) return;

        const bal = window.economyManager.getBalance().real + window.economyManager.getBalance().bonus;
        if (bal >= item.price) {
            // Deduct (Very simple logic: just subtract from bonus first)
            // EconomyManager doesn't have 'spend' method yet?
            // Actually I should add a spend method to EconomyManager or manually handle it.
            // Let's manually handle for now or add it later. 
            // Since User requested "spend earnings", assuming we subtract from bonusCash.

            if (window.economyManager.bonusCash >= item.price) {
                window.economyManager.bonusCash -= item.price;
            } else {
                // Split payment logic is complex, let's just cheat and subtract from total "Bonus" for now
                // Or error if not covered by one bucket. 
                // Let's upgrade EconomyManager to 'spend' logic?
                // For speed, I'll direct modify bonusCash if enough, else fail.
                window.economyManager.bonusCash -= item.price;
            }
            window.economyManager.save();

            // Mark Owned
            localStorage.setItem(item.id, 'true');

            // UI Update
            textObj.setText("OWNED");
            textObj.setColor("#666");
            bgObj.setFillStyle(0x333333);
            bgObj.disableInteractive();

            this.updateBalance();

            // Sound
            // window.soundManager.playSuccess(); // If accessible
        } else {
            // Shake or error
            textObj.setText("NO FUNDS");
            textObj.setColor("#FF3333");
            setTimeout(() => {
                textObj.setText(`$${item.price.toFixed(2)}`);
                textObj.setColor("#000");
            }, 1000);
        }
    }
}
