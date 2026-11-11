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

        if (u === STAFF_CREDENTIALS.username && p === STAFF_CREDENTIALS.password) {
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
            modal.classList.remove('active');
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
            document.getElementById(btn.dataset.tab).classList.add('active');
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
        appData.spec = document.getElementById('devSpec').value;
        const imgPrev = document.getElementById('devImgPrev');
        appData.image = imgPrev ? imgPrev.src : null;
    } else {
        appData.exp = document.getElementById('modExp').value;
    }

    applications.push(appData);
    localStorage.setItem('rostock_apps', JSON.stringify(applications));

    alert('Deine Bewerbung wurde erfolgreich eingereicht!');
    closeModal('applyModal');
    document.getElementById('applyForm').reset();
    document.getElementById('dynamicFields').innerHTML = '';
}