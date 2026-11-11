function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function openApplyModal(type) {
    document.getElementById('appType').value = type;
    document.getElementById('modalTitle').innerText = `${type} Bewerbung`;
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

        document.getElementById('devImg').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    const prev = document.getElementById('devImgPrev');
                    prev.src = evt.target.result;
                    prev.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
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
