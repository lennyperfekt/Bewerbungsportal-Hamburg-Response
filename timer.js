function initTimer() {
    function updateCount() {
        const now = new Date().getTime();
        const countTo = new Date(targetDate).getTime();
        const diff = countTo - now;

        if (diff <= 0) {
            document.getElementById('days').innerText = '00';
            document.getElementById('hours').innerText = '00';
            document.getElementById('minutes').innerText = '00';
            document.getElementById('seconds').innerText = '00';
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = String(d).padStart(2, '0');
        document.getElementById('hours').innerText = String(h).padStart(2, '0');
        document.getElementById('minutes').innerText = String(m).padStart(2, '0');
        document.getElementById('seconds').innerText = String(s).padStart(2, '0');
    }

    updateCount();
    setInterval(updateCount, 1000);
}
