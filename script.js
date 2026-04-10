/* --- โค้ดคำนวณคาร์บอนฟุตพริ้นท์ (Student Edition) --- */
/* พัฒนาโดยนักศึกษา เพื่อใช้ภายในมหาวิทยาลัย */

// รอให้หน้าเว็บโหลดเสร็จก่อน
document.addEventListener('DOMContentLoaded', function() {
    
    // อ้างอิงถึง Element ต่างๆ บนหน้าเว็บ
    const form = document.getElementById('carbonForm');
    const resultArea = document.getElementById('resultArea');
    const totalCarbonSpan = document.getElementById('totalCarbon');
    const recommendationText = document.getElementById('recommendationText');

    // 1. ฟังก์ชันหลักเมื่อกดปุ่มคำนวณ
    form.addEventListener('submit', function(e) {
        // ป้องกันการรีเฟรชหน้า
        e.preventDefault();

        // รับค่าจากแบบฟอร์ม
        const transport = form.transportType.value;
        const distance = parseFloat(form.distance.value) || 0; // ป้องกันค่าว่าง
        const meal = form.mealType.value;

        // เรียกฟังก์ชันคำนวณ
        const totalCarbon = calculateDailyCarbon(transport, distance, meal);

        // แสดงผล
        displayResults(totalCarbon);
    });

    // 2. ฟังก์ชันคำนวณ (ใช้ค่า Emission Factor อ้างอิงจาก TGO)
    function calculateDailyCarbon(transport, distance, meal) {
        let transportCarbon = 0;
        let mealCarbon = 0;

        // คำนวณคาร์บอนจากการเดินทาง (kgCO2e/km)
        // [REF]: ข้อมูลจาก TGO
        switch(transport) {
            case 'bus':
                transportCarbon = distance * 0.055; // รถโดยสารสาธารณะ
                break;
            case 'motorcycle':
                transportCarbon = distance * 0.110; // มอเตอร์ไซค์
                break;
            case 'car':
                transportCarbon = distance * 0.190; // รถยนต์
                break;
            case 'walk_bike':
                transportCarbon = distance * 0; // ไม่มีคาร์บอน
                break;
        }

        // คำนวณคาร์บอนจากการรับประทานอาหาร (kgCO2e/meal)
        // [REF]: ค่าเฉลี่ยโดยประมาณ
        switch(meal) {
            case 'pork_beef':
                mealCarbon = 2.80; // เนื้อสัตว์แดง
                break;
            case 'chicken_fish':
                mealCarbon = 1.30; // เนื้อไก่/ปลา
                break;
            case 'plant_based':
                mealCarbon = 0.80; // แพลนต์เบสต์
                break;
        }

        // รวมผลลัพธ์
        return transportCarbon + mealCarbon;
    }

    // 3. ฟังก์ชันแสดงผลและเปลี่ยนข้อแนะนำ
    function displayResults(total) {
        // แสดงผลเลขทศนิยม 2 ตำแหน่ง
        totalCarbonSpan.textContent = total.toFixed(2);

        // เปลี่ยนคำแนะนำตามผลลัพธ์
        if (total < 3) {
            recommendationText.textContent = "ยอดเยี่ยมมาก! วันนี้คุณใช้ชีวิตแบบ 'Low Carbon' สุดๆ รักษาวินัยนี้ไว้ และลองแบ่งปันเรื่องราวนี้ให้เพื่อนๆ ดูนะ";
        } else if (total < 6) {
            recommendationText.textContent = "คุณกำลังทำได้ดี! ลองปรับเปลี่ยนเล็กน้อย เช่น ลดระยะทางการใช้วินมอเตอร์ไซค์โดยเปลี่ยนเป็นเดิน หรือปั่นจักรยานดูบ้างครับ";
        } else {
            recommendationText.textContent = "วันนี้คาร์บอนฟุตพริ้นท์ของคุณค่อนข้างสูง ลองลดมื้อที่ทานเนื้อแดงลง และเปลี่ยนมาใช้รถสาธารณะแทนรถส่วนตัว หรือมอเตอร์ไซค์ดูนะครับ";
        }

        // ทำให้การ์ดผลลัพธ์ปรากฏขึ้น
        resultArea.classList.remove('hidden');
    }

});
