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
    scene: [GameScene],
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

window.onload = function () {
    const game = new Phaser.Game(config);

    // Handle resize events if necessary, though Scale Manager handles most
    window.addEventListener('resize', () => {
        game.scale.refresh();
    });
};
