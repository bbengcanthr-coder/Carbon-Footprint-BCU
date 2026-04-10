document.getElementById('carbonCalculator').addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. รับค่าและคำนวณ (อ้างอิงค่าจริง)
    const dist = parseFloat(document.getElementById('distance').value) || 0;
    const transType = document.getElementById('transportType').value;
    const acHours = parseFloat(document.getElementById('acHours').value) || 0;
    const diet = document.getElementById('dietType').value;

    // Emission Factors (kgCO2e)
    const factors = {
        bus: 0.06, bts_mrt: 0.04, motorcycle: 0.1, sedan: 0.2, none: 0,
        ac: 0.6, // ต่อชั่วโมง (แอร์ประหยัดไฟเบอร์ 5)
        diet_low: 1.5, diet_med: 3.5, diet_high: 6.5
    };

    const cTrans = dist * factors[transType];
    const cEnergy = acHours * factors.ac;
    const cFood = factors[`diet_${diet}`];
    
    const total = cTrans + cEnergy + cFood;

    updateUI(total, cTrans, cEnergy, cFood);
});

function updateUI(total, trans, energy, food) {
    const panel = document.getElementById('resultPanel');
    const statusBox = document.getElementById('statusBox');
    const fill = document.getElementById('progressFill');
    
    panel.classList.remove('hidden');
    document.getElementById('totalValue').textContent = total.toFixed(2);

    // 2. ตรวจสอบเกณฑ์ความเป็นจริง (Thresholds)
    // เกณฑ์: น้อยกว่า 5 = ดีมาก, 5-10 = เริ่มสูง, 10 ขึ้นไป = อันตรายต่อโลก
    let status = "";
    let desc = "";
    let colorClass = "";
    let progressWidth = (total / 15) * 100; // เทียบสเกลสูงสุดที่ 15kg

    if (total <= 5) {
        status = "🌿 ระดับความยั่งยืนสูง (Optimal)";
        desc = "พฤติกรรมของคุณช่วยรักษาอุณหภูมิโลกไม่ให้เกิน 1.5°C";
        colorClass = "status-good";
    } else if (total <= 10) {
        status = "⚠️ เริ่มส่งผลกระทบ (Moderate)";
        desc = "ปริมาณคาร์บอนของคุณสูงกว่าเกณฑ์เฉลี่ยเพื่อความยั่งยืน";
        colorClass = "status-warning";
    } else {
        status = "🚨 สูงเกินขีดจำกัด (Critical)";
        desc = "หากทุกคนทำแบบคุณ เราจะต้องใช้โลกถึง 3 ใบเพื่อรองรับทรัพยากร";
        colorClass = "status-danger";
    }

    statusBox.className = `status-indicator ${colorClass}`;
    document.getElementById('statusLabel').textContent = status;
    document.getElementById('statusDesc').textContent = desc;
    fill.style.width = `${Math.min(progressWidth, 100)}%`;

    // อัปเดตบทวิเคราะห์
    const list = document.getElementById('analysisItems');
    list.innerHTML = `
        <li style="font-size: 0.9rem; margin-top: 10px;">🚗 การเดินทาง: ${trans.toFixed(2)} kg</li>
        <li style="font-size: 0.9rem;">⚡ พลังงาน: ${energy.toFixed(2)} kg</li>
        <li style="font-size: 0.9rem;">🍔 การบริโภค: ${food.toFixed(2)} kg</li>
    `;

    window.scrollTo({ top: panel.offsetTop - 100, behavior: 'smooth' });
}
