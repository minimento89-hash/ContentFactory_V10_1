/**
 * Content Factory V10.1 — Global Layout Engine
 * Abilita la modalità Drag & Drop universale per personalizzare l'interfaccia.
 */

class LayoutEngine {
    constructor() {
        this.isActive = false;
        this.selectedItems = [];
        this.pageKey = 'cf_layout_' + window.location.pathname.replace(/\//g, '_').replace('.html', '');
        this.sortableSelectors = [
            '.hub-card', '.rm-card', '.setting-group', '.widget-card', 
            '.agent-card', '.brain-card', '.tool-card', '.stat-card', 
            '.platform-card', '.guide-item'
        ];

        this.init();
    }

    init() {
        this.applySavedLayout();
        this.injectUI();
        console.log("LayoutEngine: Pronto.");
    }

    injectUI() {
        const ui = document.createElement('div');
        ui.id = 'layout-engine-ui';
        ui.innerHTML = `
            <div class="le-floating-bar" id="le-bar">
                <button id="le-toggle" title="Modifica Layout"><i class="ph-bold ph-pencil-line"></i></button>
                <div class="le-controls" id="le-controls" style="display: none;">
                    <button id="le-save" title="Salva Layout"><i class="ph-bold ph-floppy-disk"></i></button>
                    <button id="le-reset" title="Ripristina Default"><i class="ph-bold ph-arrow-counter-clockwise"></i></button>
                </div>
            </div>
            <style>
                #layout-engine-ui { position: fixed; bottom: 30px; right: 30px; z-index: 9999; }
                .le-floating-bar { 
                    display: flex; gap: 10px; background: rgba(0,0,0,0.8); 
                    backdrop-filter: blur(10px); padding: 10px; border-radius: 50px;
                    border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
                .le-floating-bar button {
                    width: 44px; height: 44px; border-radius: 50%; border: none;
                    background: rgba(255,255,255,0.05); color: white; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
                    transition: all 0.3s;
                }
                .le-floating-bar button:hover { background: var(--accent, #e8c547); color: black; }
                #le-toggle.active { background: #ef4444; color: white; }
                
                body.le-mode-active [draggable="true"] {
                    position: relative;
                    cursor: move !important;
                    outline: 2px dashed rgba(255,255,255,0.2) !important;
                    outline-offset: 4px;
                    user-select: none;
                }
                body.le-mode-active [draggable="true"].le-selected {
                    outline: 3px solid var(--accent, #e8c547) !important;
                    box-shadow: 0 0 20px rgba(232, 197, 71, 0.3);
                }
                /* Impedisce l'interazione con i contenuti durante il drag, tranne che con la maniglia */
                body.le-mode-active [draggable="true"] *:not(.le-resizer) {
                    pointer-events: none !important;
                }
                
                /* Resize Handle */
                .le-resizer {
                    position: absolute; bottom: 0; right: 0; width: 24px; height: 24px;
                    background: var(--accent, #e8c547); clip-path: polygon(100% 0, 100% 100%, 0 100%);
                    cursor: nwse-resize !important; z-index: 1001; pointer-events: all !important;
                    opacity: 0.8; transition: 0.3s;
                }
                .le-resizer:hover { opacity: 1; transform: scale(1.1); }


                body.le-mode-active .dragging {
                    opacity: 0.5;
                    transform: scale(0.95);
                    z-index: 1000;
                }
                body.le-mode-active .le-controls { display: flex !important; gap: 10px; }

                @media (max-width: 768px) {
                    [draggable="true"] { grid-column: span 1 !important; grid-row: span 1 !important; }
                }
            </style>
        `;
        document.body.appendChild(ui);

        document.getElementById('le-toggle').onclick = () => this.toggleMode();
        document.getElementById('le-save').onclick = () => this.saveLayout();
        document.getElementById('le-reset').onclick = () => this.resetLayout();
    }

    toggleMode() {
        this.isActive = !this.isActive;
        const btn = document.getElementById('le-toggle');
        if (this.isActive) {
            document.body.classList.add('le-mode-active');
            btn.classList.add('active');
            btn.innerHTML = '<i class="ph-bold ph-x"></i>';
            this.enableDragging(true);
        } else {
            document.body.classList.remove('le-mode-active');
            btn.classList.remove('active');
            btn.innerHTML = '<i class="ph-bold ph-pencil-line"></i>';
            this.enableDragging(false);
            window.location.reload(); 
        }
    }

    enableDragging(enable) {
        const items = this.getSortableItems();
        items.forEach(el => {
            el.setAttribute('draggable', enable ? 'true' : 'false');
            
            // Gestione Resizer
            if (enable) {
                const resizer = document.createElement('div');
                resizer.className = 'le-resizer';
                el.appendChild(resizer);
                this.initResizer(resizer, el);

                el.addEventListener('dragstart', (e) => this.handleDragStart(e));
                el.addEventListener('dragover', (e) => this.handleDragOver(e));
                el.addEventListener('drop', (e) => this.handleDrop(e));
                el.addEventListener('dragend', (e) => this.handleDragEnd(e));
                
                el.addEventListener('click', (e) => {
                    if (this.isActive && !e.target.classList.contains('le-resizer')) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.handleSelection(e, el);
                    }
                }, true);
            }
        });
    }

    initResizer(resizer, el) {
        let startX, startY, startWidth, startHeight;

        const onMouseMove = (e) => {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            // Threshold più bassi: 120px per colonna, 80px per riga
            const colSpan = Math.max(1, Math.round((startWidth + dx) / 120));
            const rowSpan = Math.max(1, Math.round((startHeight + dy) / 80));

            if (el.style.gridColumn !== `span ${colSpan}`) {
                el.style.gridColumn = `span ${colSpan}`;
                console.log(`LayoutEngine: New Column Span = ${colSpan}`);
            }
            if (el.style.gridRow !== `span ${rowSpan}`) {
                el.style.gridRow = `span ${rowSpan}`;
                console.log(`LayoutEngine: New Row Span = ${rowSpan}`);
            }
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            el.setAttribute('draggable', 'true');
            console.log("LayoutEngine: Resize terminato.");
        };

        resizer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            el.setAttribute('draggable', 'false');

            startX = e.clientX;
            startY = e.clientY;
            startWidth = el.offsetWidth;
            startHeight = el.offsetHeight;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            console.log("LayoutEngine: Resize iniziato.");
        });
    }


    handleSelection(e, el) {
        if (e.shiftKey) {
            if (el.classList.contains('le-selected')) {
                el.classList.remove('le-selected');
                this.selectedItems = this.selectedItems.filter(item => item !== el);
            } else {
                el.classList.add('le-selected');
                this.selectedItems.push(el);
            }
        } else {
            this.getSortableItems().forEach(item => item.classList.remove('le-selected'));
            el.classList.add('le-selected');
            this.selectedItems = [el];
        }
    }

    getSortableItems() {
        let items = [];
        this.sortableSelectors.forEach(sel => {
            const found = document.querySelectorAll(sel);
            if (found.length > 0) items = [...items, ...Array.from(found)];
        });
        return items;
    }

    handleDragStart(e) {
        if (e.target.classList.contains('le-resizer')) return;
        this.draggedItem = e.currentTarget;
        e.dataTransfer.effectAllowed = 'move';
        this.draggedItem.classList.add('dragging');
    }

    handleDragOver(e) {
        e.preventDefault();
        const target = e.currentTarget;
        if (target && target !== this.draggedItem) {
            const parent = target.parentNode;
            const rect = target.getBoundingClientRect();
            const next = (e.clientY - rect.top) > (rect.height / 2);
            parent.insertBefore(this.draggedItem, next ? target.nextSibling : target);
        }
    }

    handleDrop(e) { e.preventDefault(); }

    handleDragEnd(e) {
        if (this.draggedItem) {
            this.draggedItem.classList.remove('dragging');
            this.draggedItem = null;
        }
    }

    saveLayout() {
        const items = this.getSortableItems();
        const order = items.map(el => {
            const colSpan = el.style.gridColumn.replace('span ', '') || '1';
            const rowSpan = el.style.gridRow.replace('span ', '') || '1';
            return {
                id: el.id || el.innerText.trim().substring(0, 20),
                colSpan: colSpan,
                rowSpan: rowSpan
            };
        });
        localStorage.setItem(this.pageKey, JSON.stringify(order));
        alert("Layout salvato con successo!");
        this.toggleMode();
    }

    resetLayout() {
        if (confirm("Vuoi davvero ripristinare il layout originale?")) {
            localStorage.removeItem(this.pageKey);
            window.location.reload();
        }
    }

    applySavedLayout() {
        const savedRaw = localStorage.getItem(this.pageKey);
        if (!savedRaw) return;

        const order = JSON.parse(savedRaw);
        const items = this.getSortableItems();
        if (items.length === 0) return;

        const itemsMap = {};
        items.forEach(el => {
            const id = el.id || el.innerText.trim().substring(0, 20);
            itemsMap[id] = el;
        });

        order.forEach(config => {
            const el = itemsMap[config.id];
            if (el) {
                el.style.gridColumn = `span ${config.colSpan}`;
                el.style.gridRow = `span ${config.rowSpan}`;
                el.parentNode.appendChild(el);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.LayoutManager = new LayoutEngine();
});

