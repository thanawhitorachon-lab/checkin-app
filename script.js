// 1. ท่อส่งข้อมูลของพี่บ่าว
const scriptURL = 'https://script.google.com/macros/s/AKfycbwY_rEFst-uno3cj-BPYekv_N2PCNgiH9ee0KuvkZREW0zbZU08yuL4Vtkl6col-JIcKQ/exec';

// 2. ตั้งค่าเริ่มต้น (ดึงจากเครื่องถ้ามี)
let score = parseInt(localStorage.getItem('userScore')) || 110;
let totalScore = 200;

function updateUI() {
    // อัปเดตตัวเลขคะแนน
    document.getElementById("scoretext").innerText = score;
    
    // คำนวณเปอร์เซ็นต์
    let percen = (score / totalScore) * 100;
    document.getElementById("percentext").innerText = percen.toFixed(1) + "%";
    
    // อัปเดตแถบ Progress Bar
    document.getElementById("progress-bar").style.width = percen + "%";
    
    // เช็คสิทธิ์เข้าสอบ
    let statusText = document.getElementById("status-text");
    if (percen >= 80) {
        statusText.innerText = "✅ มีสิทธิ์เข้าสอบ";
        statusText.style.color = "#28a745";
    } else {
        statusText.innerText = "❌ ไม่มีสิทธิ์เข้าสอบ";
        statusText.style.color = "#dc3545";
    }

    // เซฟลงเครื่องกันหาย
    localStorage.setItem('userScore', score);
}

// 3. ฟังก์ชันส่งข้อมูลเข้า Google Sheets
function sendToTeacher(name, currentScore) {
    const data = new FormData();
    data.append('Name', name);
    data.append('Points', currentScore);

    fetch(scriptURL, { method: 'POST', body: data})
      .then(response => console.log('ส่งข้อมูลสำเร็จ!'))
      .catch(error => console.error('Error!', error.message));
}

// 4. ฟังก์ชันเมื่อสแกนสำเร็จ
function handleCheckIn() {
    if (score < totalScore) {
        score += 5;
        let name = "ธนวิช อรชร (เวียร์)";
        
        // ส่งไปหลังบ้านครู
        sendToTeacher(name, score);
        
        updateUI();
        alert("เช็คชื่อสำเร็จ! ข้อมูลถูกส่งไปที่ระบบครูแล้ว");
    }
}

function startScanner() {
    const html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start(
        { facingMode: "environment" }, 
        { fps: 10, qrbox: 250 },
        (qrCodeMessage) => {
            if (qrCodeMessage.trim() === "CHECKIN_SUCCESS") {
                handleCheckIn();
                html5QrCode.stop(); 
            }
        },
        (errorMessage) => { }
    ).catch(err => console.error(err));
}

// รันตอนโหลดหน้าเว็บ
updateUI();
