/**
 * Content Factory V10.1 — Animated Orbs Background
 * Include this script and call: CF.orbs.init()
 * Or it auto-inits if body has class "cf-orbs-auto"
 */
(function(CF) {
    CF = CF || {};

    const COLORS = [
        '#ffd700','#ec4899','#3b82f6','#10b981',
        '#8b5cf6','#f97316','#06b6d4','#14b8a6'
    ];

    CF.orbs = {
        init: function(containerId) {
            const container = containerId
                ? document.getElementById(containerId)
                : (document.querySelector('.cf-orbs') || _createContainer());

            if(!container) return;
            container.innerHTML = '';

            const count = 18;
            for(let i = 0; i < count; i++) {
                const orb = document.createElement('div');
                orb.className = 'cf-orb';
                const size = 160 + Math.random() * 320;
                const color = COLORS[i % COLORS.length];
                const duration = 12 + Math.random() * 18;
                const delay = -(Math.random() * 20);
                orb.style.cssText = [
                    `width:${size}px`,
                    `height:${size}px`,
                    `left:${Math.random() * 110 - 5}%`,
                    `top:${Math.random() * 110 - 5}%`,
                    `background:radial-gradient(circle,${color}22 0%,transparent 70%)`,
                    `animation-duration:${duration}s`,
                    `animation-delay:${delay}s`
                ].join(';');
                container.appendChild(orb);
            }
        }
    };

    function _createContainer() {
        const el = document.createElement('div');
        el.className = 'cf-orbs';
        el.id = 'cf-orbs-bg';
        document.body.insertBefore(el, document.body.firstChild);
        return el;
    }

    // Auto-init
    document.addEventListener('DOMContentLoaded', function() {
        if(document.querySelector('.cf-orbs-auto') || document.querySelector('.cf-orbs')) {
            CF.orbs.init();
        }
    });

    window.CF = CF;
})(window.CF);
