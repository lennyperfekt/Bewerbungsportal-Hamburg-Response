function updatePhaseUI() {
    const cardMod = document.getElementById('cardModerator');
    const btnMod = document.getElementById('btnApplyMod');
    const badgeMod = document.getElementById('badgeModerator');

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

    const cardDev = document.getElementById('cardDeveloper');
    const btnDev = document.getElementById('btnApplyDev');
    const badgeDev = document.getElementById('badgeDeveloper');

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

    const tModBtn = document.getElementById('toggleModPhase');
    tModBtn.innerText = phaseSettings.mod ? 'Aktiv' : 'Geschlossen';
    tModBtn.className = phaseSettings.mod ? 'btn btn-success' : 'btn btn-danger';

    const tDevBtn = document.getElementById('toggleDevPhase');
    tDevBtn.innerText = phaseSettings.dev ? 'Aktiv' : 'Geschlossen';
    tDevBtn.className = phaseSettings.dev ? 'btn btn-success' : 'btn btn-danger';
}

function savePhases() {
    localStorage.setItem('rostock_phases', JSON.stringify(phaseSettings));
    updatePhaseUI();
}

function openStaffPanel() {
    renderApplications();
    const dt = new Date(targetDate);
    const formatted = dt.toISOString().slice(0, 16);
    document.getElementById('timerDate').value = formatted;
    openModal('staffModal');
}

function renderApplications() {
    const listOffen = document.getElementById('listOffen');
    const listAngenommen = document.getElementById('listAngenommen');
    const listAbgelehnt = document.getElementById('listAbgelehnt');

    listOffen.innerHTML = '';
    listAngenommen.innerHTML = '';
    listAbgelehnt.innerHTML = '';

    let cntOffen = 0, cntAngenommen = 0, cntAbgelehnt = 0;

    applications.forEach(app => {
        const card = document.createElement('div');
        card.className = 'app-card';

        let extraDetails = '';
        if (app.type === 'Developer') {
            extraDetails = `<div><strong>Spezialisierung:</strong> ${app.spec}</div>`;
            if (app.image) {
                extraDetails += `<div><strong>Arbeitsprobe:</strong><br><img src="${app.image}" style="max-width:140px; border-radius:4px; margin-top:4px;"></div>`;
            }
        } else {
            extraDetails = `<div><strong>Erfahrung:</strong> ${app.exp}</div>`;
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

    document.getElementById('cntOffen').innerText = cntOffen;
    document.getElementById('cntAngenommen').innerText = cntAngenommen;
    document.getElementById('cntAbgelehnt').innerText = cntAbgelehnt;
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
