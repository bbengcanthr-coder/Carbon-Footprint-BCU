/**
 * CARBON FOOTPRINT CALCULATION TOOL (ACADEMIC VERSION)
 * Methodology: Tier 1 Approach based on IPCC Guidelines
 * Data Source: TGO Emission Factor Database (2023-2024 Update)
 */

const EMISSION_FACTORS = {
    // กิโลกรัมคาร์บอนต่อกิโลเมตร (kgCO2e/km)
    transport: {
        sedan: 0.210,      // รถยนต์เบนซินเฉลี่ย
        diesel: 0.185,     // รถยนต์ดีเซล
        ev: 0.050,         // อ้างอิงจาก Grid Mix ของไทย
        motorcycle: 0.095, 
        public_bus: 0.045, 
        bts_mrt: 0.035,
        none: 0
    },
    // กิโลกรัมคาร์บอนต่อหน่วยพลังงาน
    energy: {
        electricity_kwh: 0.4999, // ค่าไฟฟ้าเฉลี่ยของไทย (Grid Mix) kgCO2e/unit
        air_con_rate: 1.2,       // ประมาณการใช้ไฟแอร์ (Unit/hr) สำหรับ 12000 BTU
        laptop_rate: 0.05        // ประมาณการใช้ไฟคอมพิวเตอร์ (Unit/hr)
    },
    // กิโลกรัมคาร์บอนต่อกิจกรรม
    lifestyle: {
        diet: {
            vegan: 1.5,      // ต่อวัน
            balanced: 3.2,   // ต่อวัน
            meat_heavy: 5.8  // ต่อวัน
        },
        waste: 1.89          // ขยะมูลฝอยส่งหลุมฝังกลบ (kgCO2e/kg waste) อ้างอิง TGO
    }
};

document.getElementById('academicCarbonForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. รับค่าการเดินทาง
    const dist = parseFloat(document.getElementById('distance').value) || 0;
    const transType = document.getElementById('transportType').value;
    const carbonTrans = dist * EMISSION_FACTORS.transport[transType];

    // 2. รับค่าพลังงาน (คำนวณเป็นหน่วยไฟฟ้าก่อน)
    const acHours = parseFloat(document.getElementById('airConHours').value) || 0;
    const pcHours = parseFloat(document.getElementById('computerHours').value) || 0;
    const totalUnits = (acHours * EMISSION_FACTORS.energy.air_con_rate) + (pcHours * EMISSION_FACTORS.energy.laptop_rate);
    const carbonEnergy = totalUnits * EMISSION_FACTORS.energy.electricity_kwh;

    // 3. รับค่าอาหารและขยะ
    const dietType = document.getElementById('dietType').value;
    const wasteW = parseFloat(document.getElementById('wasteWeight').value) || 0;
    const carbonFood = EMISSION_FACTORS.lifestyle.diet[dietType];
    const carbonWaste = wasteW * EMISSION_FACTORS.lifestyle.waste;

    // รวมผลลัพธ์
    const total = carbonTrans + carbonEnergy + carbonFood + carbonWaste;
    
    displayAcademicReport(total, carbonTrans, carbonEnergy, carbonFood, carbonWaste);
});

function displayAcademicReport(total, trans, energy, food, waste) {
    document.getElementById('resultArea').classList.remove('hidden');
    document.getElementById('totalCarbon').textContent = total.toFixed(3);
    document.getElementById('reportDate').textContent = "Generated on: " + new Date().toLocaleString('th-TH');

    const breakdownData = [
        { label: "การเดินทาง (Transportation)", value: trans },
        { label: "การใช้ไฟฟ้า (Energy)", value: energy },
        { label: "การบริโภคอาหาร (Diet)", value: food },
        { label: "ขยะมูลฝอย (Waste)", value: waste }
    ];

    const tableBody = document.getElementById('breakdownTable');
    tableBody.innerHTML = '';

    breakdownData.forEach(item => {
        const percent = ((item.value / total) * 100).toFixed(1);
        const row = `<tr>
            <td>${item.label}</td>
            <td>${item.value.toFixed(3)}</td>
            <td>${percent}%</td>
        </tr>`;
        tableBody.innerHTML += row;
    });

    // Auto-scroll to result
    window.scrollTo({ top: document.getElementById('resultArea').offsetTop - 50, behavior: 'smooth' });
}
