export default class SoundManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterVolume = 0.4;
    }

    // Generic Synth Tone
    playTone(freq, type, duration, vol = 1, slideTo = null) {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        if (slideTo) {
            osc.frequency.exponentialRampToValueAtTime(slideTo, t + duration);
        }

        gain.gain.setValueAtTime(vol * this.masterVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(t + duration);
    }

    playClick() {
        // High-tech UI blip
        this.playTone(800, 'sine', 0.05, 0.5);
        setTimeout(() => this.playTone(1200, 'square', 0.03, 0.2), 30);
    }

    playHover() {
        // Subtle low frequency hum
        this.playTone(200, 'triangle', 0.1, 0.1);
    }

    playSuccess(combo = 0) {
        // Cyberpunk "Power Up" Success
        // Pitch shift based on combo: +50Hz per step, max +600Hz
        const pitchMod = Math.min(combo * 50, 600);
        const baseFreq = 440 + pitchMod;
        const slideFreq = 880 + pitchMod;

        const t = this.ctx.currentTime;
        // 1. Base Sawtooth Slide Up
        this.playTone(baseFreq, 'sawtooth', 0.4, 0.5, slideFreq);

        // 2. High Sparkle (Only for combos > 2)
        if (combo > 2) {
            setTimeout(() => this.playTone(1200 + pitchMod, 'square', 0.2, 0.3, 2000), 100);
        }

        // 3. "Juice" Echo for high combos
        if (combo > 9) {
            setTimeout(() => this.playTone(baseFreq * 1.5, 'triangle', 0.3, 0.2), 150);
        }
    }

    playFail() {
        // "System Error" Glitch
        this.playTone(150, 'sawtooth', 0.3, 0.6, 50); // Downslide
        // Noise burst simulation (random sq waves)
        setTimeout(() => this.playTone(80, 'square', 0.05, 0.5), 50);
        setTimeout(() => this.playTone(60, 'square', 0.05, 0.5), 120);
    }

    playTick() {
        // Geiger counter style tick
        this.playTone(2000, 'square', 0.01, 0.2);
    }
}
