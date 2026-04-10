document.getElementById('carbonForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // ข้อมูล Emission Factors (อ้างอิง TGO/IPCC)
    const factor = {
        trans: { none: 0, bus: 0.05, mrt: 0.03, motor: 0.1, car: 0.22 },
        ac: 0.65, // ต่อชั่วโมง
        food: { vegan: 1.2, normal: 3.0, meat: 6.5 }
    };

    const d = parseFloat(document.getElementById('distance').value) || 0;
    const t = document.getElementById('transport').value;
    const ac = parseFloat(document.getElementById('ac').value) || 0;
    const f = document.getElementById('food').value;

    const total = (d * factor.trans[t]) + (ac * factor.ac) + factor.food[f];

    renderResults(total);
});

function renderResults(val) {
    const res = document.getElementById('results');
    const bar = document.getElementById('userBar');
    const status = document.getElementById('statusIndicator');
    const statusTxt = document.getElementById('statusText');
    const summary = document.getElementById('summaryText');

    res.classList.remove('hidden');
    document.getElementById('finalScore').textContent = val.toFixed(2);

    // กำหนดเกณฑ์ (Thresholds)
    let color = "";
    let msg = "";

    if (val <= 5) {
        color = "status-success";
        msg = "🌿 ระดับดีเยี่ยม (Eco-Friendly)";
        summary.textContent = "พฤติกรรมของคุณสอดคล้องกับเป้าหมายการจำกัดอุณหภูมิโลกไม่ให้เกิน 1.5 องศาเซลเซียส คุณคือกลุ่มผู้ใช้งานที่มีความรับผิดชอบต่อสิ่งแวดล้อมสูงมาก";
        bar.style.backgroundColor = "#10B981";
    } else if (val <= 12) {
        color = "status-warn";
        msg = "⚠️ ระดับปานกลาง (Average)";
        summary.textContent = "คุณมีการปล่อยคาร์บอนอยู่ในเกณฑ์เฉลี่ย แต่ยังสามารถปรับลดได้ โดยเฉพาะการเลือกใช้ระบบขนส่งสาธารณะแทนรถส่วนตัว หรือลดมื้อเนื้อแดงลง";
        bar.style.backgroundColor = "#F59E0B";
    } else {
        color = "status-danger";
        msg = "🚨 ระดับสูง (High Impact)";
        summary.textContent = "ค่าคาร์บอนฟุตพริ้นท์ของคุณสูงกว่าเกณฑ์ที่แนะนำอย่างมาก หากทุกคนมีพฤติกรรมเช่นนี้ โลกจะเข้าสู่ภาวะวิกฤตเร็วกว่าที่คาดการณ์ไว้";
        bar.style.backgroundColor = "#EF4444";
    }

    status.className = `status-bar ${color}`;
    statusTxt.textContent = msg;

    // คำนวณความยาว Bar (เทียบกับ Max 20kg)
    const percent = Math.min((val / 20) * 100, 100);
    setTimeout(() => { bar.style.width = percent + "%"; }, 100);

    window.scrollTo({ top: res.offsetTop - 50, behavior: 'smooth' });
}
