let points = 100;
let presentCount = 0;
let totalDays = 0;

function updateUI() {
    document.getElementById('points').innerText = points;
    
    // คำนวณเปอร์เซ็นต์
    let percen = totalDays === 0 ? 100 : (presentCount / totalDays) * 100;
    document.getElementById('attendance-percent').innerText = percen.toFixed(1) + "%";
    
    // ปรับความยาวแถบพลัง
    document.getElementById('progress-bar').style.width = percen + "%";
}

function handleCheckIn() {
    totalDays++;
    presentCount++;
    points += 5;
    
    document.getElementById('message').innerText = "✅ เช็คชื่อสำเร็จ! (+5 คะแนน)";
    updateUI();
}

function handleLeave() {
    totalDays++;
    
    document.getElementById('message').innerText = "📝 บันทึกการลาเรียบร้อย!";
    updateUI();
}

// ฟังก์ชันเริ่มสแกน QR Code
function startScanner() {
    const html5QrCode = new Html5Qrcode("reader");
    
    html5QrCode.start(
        { facingMode: "environment" }, // ใช้กล้องหลัง (ถ้ามี)
        {
            fps: 10,    // สแกน 10 เฟรมต่อวินาที
            qrbox: 250  // ขนาดกรอบสแกน
        },
        qrCodeMessage => {
            // ถ้าสแกนเจอข้อความว่า "CHECKIN_SUCCESS" ให้เรียกฟังก์ชันเช็คชื่อ
            if(qrCodeMessage === "CHECKIN_SUCCESS") {
                handleCheckIn();
                html5QrCode.stop(); // สแกนเสร็จให้หยุดกล้อง
                alert("สแกนสำเร็จ!");
            }
        },
        errorMessage => {
            // ไม่ต้องทำอะไรถ้ายังสแกนไม่เจอ
        }
    ).catch(err => {
        console.error("เปิดกล้องไม่ได้: ", err);
    });
}

// เปลี่ยนปุ่มสแกนเดิมให้เป็นปุ่มเปิดกล้อง
document.querySelector('.btn-checkin').onclick = startScanner;