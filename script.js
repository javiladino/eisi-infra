document.addEventListener('DOMContentLoaded', () => {
    let globalSchedule = [];
    let currentLang = 'es';

    const translations = {
        es: {
            labelCal: "SEMANAS CALENDARIO:",
            labelTrain: "SEMANAS FORMACIÓN:",
            labelGoTo: "IR A SEMANA DE:",
            titleCurrent: "SEMANA SELECCIONADA",
            titleNext: "PRÓXIMA SEMANA DE ACTIVIDAD",
            noData: "SIN ACTIVIDAD PROGRAMADA.",
            prof: "PROF:",
            session: "SESIÓN:",
            roomDef: "SALA NO DEF."
        },
        fr: {
            labelCal: "SEMAINES CALENDRIER:",
            labelTrain: "SEMAINES FORMATION:",
            labelGoTo: "ALLER À LA SEMAINE DU:",
            titleCurrent: "SEMAINE SÉLECTIONNÉE",
            titleNext: "PROCHAINE SEMAINE D'ACTIVITÉ",
            noData: "AUCUNE ACTIVITÉ PROGRAMMÉE.",
            prof: "PROF:",
            session: "SESSION:",
            roomDef: "SALLE NON DÉF."
        }
    };

    // --- FUNCIÓN GLOBAL PARA GUARDAR TAREAS ---
    window.saveTaskStatus = function(taskId, isChecked) {
        localStorage.setItem(taskId, isChecked);
    };

    // --- MANEJO DE IDIOMA ---
    const langBtn = document.getElementById('lang-btn');
    if(langBtn) {
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'es' ? 'fr' : 'es';
            applyTranslations();
            updateDashboard(new Date(document.getElementById('week-selector').value));
        });
    }

    function applyTranslations() {
        document.querySelectorAll('.lang-text').forEach(el => {
            const key = el.getAttribute('data-key');
            if (translations[currentLang][key]) {
                el.innerText = translations[currentLang][key];
            }
        });
    }

    // --- CARGA DE DATOS ---
    Papa.parse("horario_notion_listo.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
            globalSchedule = results.data.map(row => ({
                ...row,
                dateObj: new Date(row.Fecha + 'T00:00:00')
            })).filter(row => !isNaN(row.dateObj.getTime()))
               .sort((a, b) => a.dateObj - b.dateObj);
            
            initSelector();
        }
    });

    function initSelector() {
        const selector = document.getElementById('week-selector');
        const weekMap = new Map();
        
        globalSchedule.forEach(row => {
            const monday = getStartOfWeek(row.dateObj);
            const key = monday.toISOString().split('T')[0];
            if (!weekMap.has(key)) weekMap.set(key, monday);
        });

        const sortedMondays = Array.from(weekMap.values()).sort((a, b) => a - b);

        selector.innerHTML = "";
        sortedMondays.forEach(monday => {
            const option = document.createElement('option');
            option.value = monday.toISOString();
            option.innerText = monday.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).toUpperCase();
            selector.appendChild(option);
        });

        const today = new Date(); 
        const currentMonday = getStartOfWeek(today);
        const currentMondayKey = currentMonday.toISOString().split('T')[0];

        if (weekMap.has(currentMondayKey)) {
            selector.value = currentMonday.toISOString();
        } else {
            const nextAvailable = sortedMondays.find(monday => monday > today);
            if (nextAvailable) selector.value = nextAvailable.toISOString();
        }

        selector.addEventListener('change', (e) => updateDashboard(new Date(e.target.value)));
        
        applyTranslations();
        updateDashboard(new Date(selector.value));
    }

    function updateDashboard(referenceDate) {
        const startSelected = getStartOfWeek(referenceDate);
        const endSelected = new Date(startSelected);
        endSelected.setDate(endSelected.getDate() + 6);
        endSelected.setHours(23, 59, 59);

        const future = globalSchedule.filter(r => r.dateObj >= referenceDate);
        if (future.length > 0) {
            const lastDate = future[future.length - 1].dateObj;
            document.getElementById('weeks-calendar').innerText = Math.max(0, Math.ceil((lastDate - referenceDate) / (1000 * 60 * 60 * 24 * 7)));
            
            const trainingWeeksCount = new Set();
            future.forEach(r => trainingWeeksCount.add(getStartOfWeek(r.dateObj).toDateString()));
            document.getElementById('weeks-training').innerText = trainingWeeksCount.size;
        }

        const currentClasses = globalSchedule.filter(r => r.dateObj >= startSelected && r.dateObj <= endSelected);
        renderList(currentClasses, 'current-week-list');

        const nextActivity = globalSchedule.filter(r => r.dateObj > endSelected);
        if (nextActivity.length > 0) {
            const nStart = getStartOfWeek(nextActivity[0].dateObj);
            const nEnd = new Date(nStart); 
            nEnd.setDate(nEnd.getDate() + 6); 
            nEnd.setHours(23, 59, 59);
            renderList(globalSchedule.filter(r => r.dateObj >= nStart && r.dateObj <= nEnd), 'next-week-list');
        } else {
            renderList([], 'next-week-list');
        }
    }

    function getStartOfWeek(d) {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const mon = new Date(date.setDate(diff));
        mon.setHours(0,0,0,0);
        return mon;
    }

    function renderList(classes, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = "";
        const t = translations[currentLang];

        if (classes.length === 0) {
            container.innerHTML = `<p class='no-data-msg'>${t.noData}</p>`;
            return;
        }

        classes.forEach(c => {
            // Cálculos de progreso y sala
            const progressArr = String(c.Progreso || '').split('/');
            const percent = progressArr.length === 2 ? (parseInt(progressArr[0])/parseInt(progressArr[1])*100) : 0;
            const roomInfo = c.Salle || t.roomDef;
            
            // Generar ID único para tareas
            const cardId = `${c.Materia}-${c.Fecha}`.replace(/\s+/g, '-');

            // Procesar las tareas de la columna CSV
            let checklistHtml = '';
            if (c.Tareas) {
                const listaTareas = c.Tareas.split('|');
                checklistHtml = `<ul class="cyber-checklist">`;
                listaTareas.forEach((tarea, index) => {
                    const taskId = `${cardId}-task-${index}`;
                    const isChecked = localStorage.getItem(taskId) === 'true' ? 'checked' : '';
                    checklistHtml += `
                        <li>
                            <label class="cyber-checkbox-label">
                                <input type="checkbox" id="${taskId}" ${isChecked} 
                                    onchange="saveTaskStatus('${taskId}', this.checked)">
                                <span class="checkmark"></span>
                                <span class="task-text">${tarea.trim()}</span>
                            </label>
                        </li>`;
                });
                checklistHtml += `</ul>`;
            }

            const card = document.createElement('div');
            card.className = 'course-card';
            card.innerHTML = `
                <div class="salle-badge">${roomInfo}</div>
                <div class="date">${c.Fecha} // ${c["Hora Inicio"]} - ${c["Hora Fin"]}</div>
                <div class="title">${c.Materia}</div>
                <div class="info-text">
                    ${t.session} ${c.Progreso || '1/1'}
                </div>
                ${checklistHtml}
                <div class="progress-bar"><div class="progress-fill" style="width:${percent}%"></div></div>
            `;
            container.appendChild(card);
        });
    }
});