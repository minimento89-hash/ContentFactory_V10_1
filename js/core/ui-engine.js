/**
 * Content Factory V10.1 — UI Engine
 * Ensures every page follows the "Master Template" standards.
 */

const UIEngine = (() => {
    
    // Exact Orb Configuration from Hub (index.html)
    const orbList = [
        { w:120, h:120, t:5, l:15, bg:'rgba(255,20,147,0.4)', anim:'float-slow 18s' },
        { w:70, h:70, t:45, l:5, bg:'rgba(255,105,180,0.5)', anim:'float-medium 22s' },
        { w:90, h:90, b:10, r:30, bg:'rgba(219,112,147,0.4)', anim:'float-slow 25s' },
        { w:140, h:140, t:30, r:10, bg:'rgba(0,255,127,0.3)', anim:'float-slow 20s' },
        { w:80, h:80, b:40, l:8, bg:'rgba(50,205,50,0.4)', anim:'float-medium 15s' },
        { w:100, h:100, t:75, r:20, bg:'rgba(32,178,170,0.35)', anim:'float-slow 30s' },
        { w:110, h:110, t:15, r:40, bg:'rgba(255,215,0,0.4)', anim:'float-medium 28s' },
        { w:60, h:60, b:20, l:35, bg:'rgba(255,223,0,0.5)', anim:'float-slow 15s' },
        { w:130, h:130, t:60, l:45, bg:'rgba(255,235,59,0.3)', anim:'float-medium 40s' },
        { w:100, h:100, t:50, r:50, bg:'rgba(0,191,255,0.4)', anim:'float-slow 22s' },
        { w:140, h:140, b:5, r:5, bg:'rgba(30,144,255,0.35)', anim:'float-medium 25s' },
        { w:80, h:80, t:5, r:2, bg:'rgba(0,250,154,0.3)', anim:'float-slow 12s' },
        { w:40, h:40, t:25, l:40, bg:'rgba(255,255,255,0.4)', anim:'float-medium 10s' },
        { w:50, h:50, b:30, r:15, bg:'rgba(255,255,255,0.3)', anim:'float-slow 8s' },
        { w:150, h:150, t:80, l:5, bg:'rgba(255,20,147,0.2)', anim:'float-medium 35s' },
        { w:100, h:100, t:40, l:70, bg:'rgba(255,215,0,0.25)', anim:'float-slow 20s' },
        { w:120, h:120, b:50, r:5, bg:'rgba(0,255,127,0.2)', anim:'float-medium 25s' },
        { w:60, h:60, t:10, l:80, bg:'rgba(168,212,209,0.4)', anim:'float-slow 15s' }
    ];

    /**
     * Injects the standard hub cinematic background.
     */
    const injectBackground = () => {
        const bg = document.createElement('div');
        bg.className = 'cinematic-bg';
        
        orbList.forEach(o => {
            const orb = document.createElement('div');
            orb.className = 'orb';
            
            let pos = '';
            if (o.t !== undefined) pos += `top: ${o.t}%;`;
            if (o.b !== undefined) pos += `bottom: ${o.b}%;`;
            if (o.l !== undefined) pos += `left: ${o.l}%;`;
            if (o.r !== undefined) pos += `right: ${o.r}%;`;

            orb.style.cssText = `
                position: absolute;
                width: ${o.w}px;
                height: ${o.h}px;
                ${pos}
                background: radial-gradient(circle, ${o.bg} 0%, transparent 70%);
                border-radius: 50%;
                animation: ${o.anim} infinite ease-in-out;
                pointer-events: none;
            `;
            bg.appendChild(orb);
        });
        document.body.prepend(bg);
    };

    /**
     * Initializes the Master Template on a page.
     */
    let initialized = false;
    const init = () => {
        if (initialized) return;
        const container = document.querySelector('[data-master-template]');
        if (!container) return;
        initialized = true;

        // 1. Inject Background
        injectBackground();

        // 2. Standardize Structure
        if (!container.classList.contains('master-container')) {
            container.classList.add('master-container');
        }

        // 3. Inject Navigation
        if (!document.querySelector('.master-back-btn')) {
            const backBtn = document.createElement('a');
            backBtn.href = 'index.html';
            backBtn.className = 'master-back-btn';
            backBtn.innerHTML = `<i class="ph ph-house"></i> HUB STRATEGICA`;
            document.body.appendChild(backBtn);
        }
    };

    return { init };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', UIEngine.init);
} else {
    UIEngine.init();
}
