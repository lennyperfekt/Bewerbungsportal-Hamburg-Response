const STAFF_CREDENTIALS = [
    { username: "Krypto_Dev", password: "112" },
    { username: "Dev_luxury", password: "Luxury908070" }
];

let applications = JSON.parse(localStorage.getItem('rostock_apps')) || [];
let phaseSettings = JSON.parse(localStorage.getItem('rostock_phases')) || { mod: true, dev: true };
let targetDate = localStorage.getItem('rostock_timer') || new Date(Date.now() + 7*24*60*60*1000).toISOString();

document.addEventListener('DOMContentLoaded', () => {
    initTimer();
    updatePhaseUI();
    renderApplications();

    document.getElementById('staffLoginBtn').addEventListener('click', () => {
        if (localStorage.getItem('staff_logged_in') === 'true') {
            openStaffPanel();
        } else {
            openModal('loginModal');
        }
    });

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const u = document.getElementById('loginUser').value;
        const p = document.getElementById('loginPass').value;

        const validStaff = STAFF_CREDENTIALS.some(cred => cred.username === u && cred.password === p);

        if (validStaff) {
            localStorage.setItem('staff_logged_in', 'true');
            closeModal('loginModal');
            openStaffPanel();
            document.getElementById('loginError').style.display = 'none';
            document.getElementById('loginForm').reset();
        } else {
            document.getElementById('loginError').style.display = 'block';
        }
    });

    document.getElementById('staffLogout').addEventListener('click', () => {
        localStorage.removeItem('staff_logged_in');
        closeModal('staffModal');
    });

    document.getElementById('btnApplyMod').addEventListener('click', () => {
        if (phaseSettings.mod) openApplyModal('Moderator');
    });

    document.getElementById('btnApplyDev').addEventListener('click', () => {
        if (phaseSettings.dev) openApplyModal('Developer');
    });

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) modal.classList.remove('active');
        });
    });

    document.getElementById('applyForm').addEventListener('submit', handleApplySubmit);

    document.getElementById('toggleModPhase').addEventListener('click', () => {
        phaseSettings.mod = !phaseSettings.mod;
        savePhases();
    });

    document.getElementById('toggleDevPhase').addEventListener('click', () => {
        phaseSettings.dev = !phaseSettings.dev;
        savePhases();
    });

    document.getElementById('timerSettingsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const val = document.getElementById('timerDate').value;
        if (val) {
            targetDate = new Date(val).toISOString();
            localStorage.setItem('rostock_timer', targetDate);
            alert('Timer erfolgreich aktualisiert!');
        }
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const targetTab = document.getElementById(btn.dataset.tab);
            if (targetTab) targetTab.classList.add('active');
        });
    });
});

function handleApplySubmit(e) {
    e.preventDefault();
    const type = document.getElementById('appType').value;
    
    const appData = {
        id: Date.now(),
        type: type,
        status: 'offen',
        discord: document.getElementById('discordTag').value,
        alter: document.getElementById('alter').value,
        icName: document.getElementById('icName').value,
        roblox: document.getElementById('robloxName').value,
        motivation: document.getElementById('motivation').value,
        date: new Date().toLocaleDateString('de-DE')
    };

    if (type === 'Developer') {
        const specEl = document.getElementById('devSpec');
        appData.spec = specEl ? specEl.value : 'Luau / Scripting';
        const imgPrev = document.getElementById('devImgPrev');
        appData.image = (imgPrev && imgPrev.src && imgPrev.style.display !== 'none') ? imgPrev.src : null;
    } else {
        const modExpEl = document.getElementById('modExp');
        appData.exp = modExpEl ? modExpEl.value : '';
    }

    try {
        applications.push(appData);
        localStorage.setItem('rostock_apps', JSON.stringify(applications));
        alert('Deine Bewerbung wurde erfolgreich eingereicht!');
        closeModal('applyModal');
        document.getElementById('applyForm').reset();
        document.getElementById('dynamicFields').innerHTML = '';
        renderApplications();
    } catch (err) {
        alert('Fehler beim Speichern! Auf Mobilgeräten sind große Bilder im Speicher oft zu groß für den lokalen Speicher. Versuche ein kleineres Bild oder keins.');
        console.error(err);
    }
}

function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
}

function openApplyModal(type) {
    document.getElementById('appType').value = type;
    const titleEl = document.getElementById('modalTitle');
    if (titleEl) titleEl.innerText = `${type} Bewerbung`;
    const dyn = document.getElementById('dynamicFields');
    
    if (type === 'Developer') {
        dyn.innerHTML = `
            <div class="form-section">
                <h4>3. Entwickler Details</h4>
                <div class="form-group">
                    <label for="devSpec">Spezialisierung *</label>
                    <select id="devSpec" required>
                        <option value="Luau / Scripting">Luau / Scripting</option>
                        <option value="Building / Mapping">Building / Mapping</option>
                        <option value="UI / UX Design">UI / UX Design</option>
                        <option value="3D Modeling">3D Modeling</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="devImg">Arbeitsprobe / Screenshot *</label>
                    <input type="file" id="devImg" accept="image/*" required>
                    <img id="devImgPrev" style="max-width:100%; max-height:140px; margin-top:8px; border-radius:6px; display:none;">
                </div>
            </div>
        `;

        const devImgInput = document.getElementById('devImg');
        if (devImgInput) {
            devImgInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                        const img = new Image();
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const MAX_WIDTH = 600;
                            const MAX_HEIGHT = 600;
                            let width = img.width;
                            let height = img.height;

                            if (width > height) {
                                if (width > MAX_WIDTH) {
                                    height *= MAX_WIDTH / width;
                                    width = MAX_WIDTH;
                                }
                            } else {
                                if (height > MAX_HEIGHT) {
                                    width *= MAX_HEIGHT / height;
                                    height = MAX_HEIGHT;
                                }
                            }

                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, width, height);

                            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                            const prev = document.getElementById('devImgPrev');
                            if (prev) {
                                prev.src = compressedDataUrl;
                                prev.style.display = 'block';
                            }
                        };
                        img.src = evt.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    } else {
        dyn.innerHTML = `
            <div class="form-section">
                <h4>3. Moderator Details</h4>
                <div class="form-group">
                    <label for="modExp">Bisherige Erfahrung *</label>
                    <textarea id="modExp" rows="2" required placeholder="Erfahrungen auf anderen Servern..."></textarea>
                </div>
            </div>
        `;
    }

    openModal('applyModal');
}

function updatePhaseUI() {
    const cardMod = document.getElementById('cardModerator');
    const btnMod = document.getElementById('btnApplyMod');
    const badgeMod = document.getElementById('badgeModerator');

    if (cardMod && btnMod && badgeMod) {
        if (phaseSettings.mod) {
            cardMod.classList.remove('closed');
            btnMod.disabled = false;
            btnMod.innerText = 'Jetzt bewerben!';
            badgeMod.style.display = 'none';
        } else {
            cardMod.classList.add('closed');
            btnMod.disabled = true;
            btnMod.innerText = 'Bewerbung geschlossen';
            badgeMod.style.display = 'inline-block';
        }
    }

    const cardDev = document.getElementById('cardDeveloper');
    const btnDev = document.getElementById('btnApplyDev');
    const badgeDev = document.getElementById('badgeDeveloper');

    if (cardDev && btnDev && badgeDev) {
        if (phaseSettings.dev) {
            cardDev.classList.remove('closed');
            btnDev.disabled = false;
            btnDev.innerText = 'Bewerben';
            badgeDev.style.display = 'none';
        } else {
            cardDev.classList.add('closed');
            btnDev.disabled = true;
            btnDev.innerText = 'Bewerbung geschlossen';
            badgeDev.style.display = 'inline-block';
        }
    }

    const tModBtn = document.getElementById('toggleModPhase');
    if (tModBtn) {
        tModBtn.innerText = phaseSettings.mod ? 'Aktiv' : 'Geschlossen';
        tModBtn.className = phaseSettings.mod ? 'btn btn-success' : 'btn btn-danger';
    }

    const tDevBtn = document.getElementById('toggleDevPhase');
    if (tDevBtn) {
        tDevBtn.innerText = phaseSettings.dev ? 'Aktiv' : 'Geschlossen';
        tDevBtn.className = phaseSettings.dev ? 'btn btn-success' : 'btn btn-danger';
    }
}

function savePhases() {
    localStorage.setItem('rostock_phases', JSON.stringify(phaseSettings));
    updatePhaseUI();
}

function openStaffPanel() {
    renderApplications();
    const dt = new Date(targetDate);
    const formatted = dt.toISOString().slice(0, 16);
    const timerDateEl = document.getElementById('timerDate');
    if (timerDateEl) timerDateEl.value = formatted;
    openModal('staffModal');
}

function renderApplications() {
    const listOffen = document.getElementById('listOffen');
    const listAngenommen = document.getElementById('listAngenommen');
    const listAbgelehnt = document.getElementById('listAbgelehnt');

    if (!listOffen || !listAngenommen || !listAbgelehnt) return;

    listOffen.innerHTML = '';
    listAngenommen.innerHTML = '';
    listAbgelehnt.innerHTML = '';

    let cntOffen = 0, cntAngenommen = 0, cntAbgelehnt = 0;

    applications.forEach(app => {
        const card = document.createElement('div');
        card.className = 'app-card';

        let extraDetails = '';
        if (app.type === 'Developer') {
            extraDetails = `<div><strong>Spezialisierung:</strong> ${app.spec || '-'}</div>`;
            if (app.image) {
                extraDetails += `<div><strong>Arbeitsprobe:</strong><br><img src="${app.image}" style="max-width:140px; border-radius:4px; margin-top:4px;"></div>`;
            }
        } else {
            extraDetails = `<div><strong>Erfahrung:</strong> ${app.exp || '-'}</div>`;
        }

        card.innerHTML = `
            <div class="app-card-header">
                <span class="app-card-title">${app.icName} (${app.roblox})</span>
                <span class="app-card-type">${app.type}</span>
            </div>
            <div class="app-details">
                <div><strong>Discord:</strong> ${app.discord}</div>
                <div><strong>Alter:</strong> ${app.alter}</div>
                <div><strong>Datum:</strong> ${app.date}</div>
                ${extraDetails}
            </div>
            <div style="font-size:0.85rem; margin-bottom:10px;">
                <strong>Motivation:</strong><br>${app.motivation}
            </div>
            <div class="app-actions">
                <button class="btn btn-success btn-sm" onclick="changeAppStatus(${app.id}, 'angenommen')">Annehmen</button>
                <button class="btn btn-outline btn-sm" onclick="changeAppStatus(${app.id}, 'abgelehnt')">Ablehnen</button>
                <button class="btn btn-danger btn-sm" onclick="deleteApp(${app.id})">Löschen</button>
            </div>
        `;

        if (app.status === 'offen') {
            listOffen.appendChild(card);
            cntOffen++;
        } else if (app.status === 'angenommen') {
            listAngenommen.appendChild(card);
            cntAngenommen++;
        } else if (app.status === 'abgelehnt') {
            listAbgelehnt.appendChild(card);
            cntAbgelehnt++;
        }
    });

    const cntOffenEl = document.getElementById('cntOffen');
    const cntAngenommenEl = document.getElementById('cntAngenommen');
    const cntAbgelehntEl = document.getElementById('cntAbgelehnt');

    if (cntOffenEl) cntOffenEl.innerText = cntOffen;
    if (cntAngenommenEl) cntAngenommenEl.innerText = cntAngenommen;
    if (cntAbgelehntEl) cntAbgelehntEl.innerText = cntAbgelehnt;
}

function changeAppStatus(id, newStatus) {
    const app = applications.find(a => a.id === id);
    if (app) {
        app.status = newStatus;
        localStorage.setItem('rostock_apps', JSON.stringify(applications));
        renderApplications();
    }
}

function deleteApp(id) {
    if (confirm('Möchtest du diese Bewerbung wirklich dauerhaft löschen?')) {
        applications = applications.filter(a => a.id !== id);
        localStorage.setItem('rostock_apps', JSON.stringify(applications));
        renderApplications();
    }
}

function initTimer() {
    function updateCount() {
        const now = new Date().getTime();
        const countTo = new Date(targetDate).getTime();
        const diff = countTo - now;

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

        if (diff <= 0) {
            daysEl.innerText = '00';
            hoursEl.innerText = '00';
            minutesEl.innerText = '00';
            secondsEl.innerText = '00';
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.innerText = String(d).padStart(2, '0');
        hoursEl.innerText = String(h).padStart(2, '0');
        minutesEl.innerText = String(m).padStart(2, '0');
        secondsEl.innerText = String(s).padStart(2, '0');
    }

    updateCount();
    setInterval(updateCount, 1000);
}
