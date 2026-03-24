let score = 100;
let totalScore = 200;

function updateUI() {
    // 1. อัปเดตตัวเลขคะแนน
    document.getElementById("scoretext").innerText = score;

    // 2. คำนวณและอัปเดตเปอร์เซ็นต์
    let percen = (score / totalScore) * 100;
    document.getElementById("percentext").innerText = percen.toFixed(1) + "%";

    // 3. อัปเดตแถบความคืบหน้า (Progress Bar)
    document.getElementById("progress-bar").style.width = percen + "%";

    // 4. เช็คสิทธิ์เข้าสอบ
    let statusText = document.getElementById("status-text");
    if (percen >= 80) {
        statusText.innerText = "✅ มีสิทธิ์เข้าสอบ";
        statusText.style.color = "#28a745";
    } else {
        statusText.innerText = "❌ ไม่มีสิทธิ์เข้าสอบ";
        statusText.style.color = "#dc3545";
    }
}

function handleCheckIn() {
    if (score < totalScore) {
        score += 5;
        if (score > totalScore) score = totalScore;
        updateUI();
    }
}

function startScanner() {
    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        { facingMode: "environment" }, 
        {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        },
        (qrCodeMessage) => {
            // ดักจับข้อความจาก QR Code
            if (qrCodeMessage === "CHECKIN_SUCCESS") {
                handleCheckIn();
                alert("สแกนสำเร็จ! คะแนนเพิ่มขึ้นแล้วครับ");
                
                // หยุดกล้องหลังสแกนเสร็จ
                html5QrCode.stop().then(() => {
                    console.log("Scanner stopped.");
                }).catch(err => console.error(err));
            } else {
                alert("QR Code ไม่ถูกต้อง: " + qrCodeMessage);
            }
        },
        (errorMessage) => {
            // ไม่ต้องทำอะไร ปล่อยให้มันหาต่อไป
        }
    ).catch(err => {
        alert("เปิดกล้องไม่ได้: " + err);
    });
}

// เริ่มต้นหน้าจอ
updateUI();