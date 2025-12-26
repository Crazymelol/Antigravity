export default class SecurityManager {
    constructor() {
        this.events = [];
        this.startTime = Date.now();
        this.secret = "FS_SECRET_KEY_" + Math.random().toString(36).substring(7); // Session-based secret
    }

    startSession() {
        this.events = [];
        this.startTime = Date.now();
        this.log("SESSION_START", { t: this.startTime });
    }

    log(type, data) {
        // Record relative time to prevent timestamp spoofing
        const clickTime = Date.now();
        const relTime = clickTime - this.startTime;
        this.events.push({
            type: type,
            dt: relTime, // Delta Time
            data: data
        });
    }

    async generateReplayData() {
        // Prepare the payload
        const payload = {
            id: this.secret, // Simulation of a session ID
            timestamp: Date.now(),
            events: this.events
        };

        const jsonString = JSON.stringify(payload);

        // Generate Checksum/Hash (SHA-256)
        const msgBuffer = new TextEncoder().encode(jsonString + "SALT_V1");
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        return {
            payload: payload,
            signature: hashHex
        };
    }

    // Client-side validation simulation (In real app, this runs on server)
    async verify(submittedData) {
        const { payload, signature } = submittedData;

        // Re-hash
        const jsonString = JSON.stringify(payload);
        const msgBuffer = new TextEncoder().encode(jsonString + "SALT_V1");
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const calculatedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        if (calculatedHash !== signature) {
            console.error("SECURITY ALERT: Hash Mismatch! Data Tampered.");
            return false;
        }

        // Logical Validation (Anti-Bot)
        // 1. Check for superhuman speed (<100ms reactions frequently)
        let fastClicks = 0;
        let lastSpawnTime = 0;

        for (let e of payload.events) {
            if (e.type === 'SPAWN') lastSpawnTime = e.dt;
            if (e.type === 'HIT') {
                const reaction = e.dt - lastSpawnTime;
                if (reaction < 150) fastClicks++; // 150ms is very fast
            }
        }

        if (fastClicks > 3) {
            console.error("SECURITY ALERT: Bot Detected (Inhuman Reaction Times)");
            return false;
        }

        return true;
    }
}
