const STAFF_CREDENTIALS = {
    username: "Krypto_Dev",
    password: "112"
};

let applications = JSON.parse(localStorage.getItem('rostock_apps')) || [];
let phaseSettings = JSON.parse(localStorage.getItem('rostock_phases')) || { mod: true, dev: true };
let targetDate = localStorage.getItem('rostock_timer') || new Date(Date.now() + 7*24*60*60*1000).toISOString();
