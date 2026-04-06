// 1. ท่อส่งข้อมูล (ตรวจดูว่าตรงกับของพี่บ่าวไหม)
const scriptURL = 'https://script.google.com/macros/s/AKfycbwY_rEFst-uno3cj-BPYekv_N2PCNgiH9ee0KuvkZREW0zbZU08yuL4Vtkl6col-JIcKQ/exec';

let score = parseInt(localStorage.getItem('userScore')) || 110;
let totalScore = 200;

function updateUI() {
    document.getElementById("scoretext").innerText = score;
    let percen = (score / totalScore) * 100;
    document.getElementById("percentext").innerText = percen.toFixed(1) + "%";
    document.getElementById("progress-bar").style.width = percen + "%";
    
    let statusText = document.getElementById("status-text");
    if (percen >= 80) {
        statusText.innerText = "✅ มีสิทธิ์เข้าสอบ";
        statusText.style.color = "#28a745";
    } else {
        statusText.innerText = "❌ ไม่มีสิทธิ์เข้าสอบ";
        statusText.style.color = "#dc3545";
    }
}

// ฟังก์ชันส่งข้อมูลไป Google Sheets
function sendToTeacher(name, points) {
    const data = new FormData();
    data.append('Name', name);
    data.append('Points', points);

    fetch(scriptURL, { method: 'POST', body: data})
      .then(response => alert("บันทึกข้อมูลของคุณ " + name + " เรียบร้อยแล้ว!"))
      .catch(error => console.error('Error!', error.message));
}

// ฟังก์ชันเช็คชื่อ (ถามชื่อ)
function handleCheckIn() {
      let studentId = prompt("กรุณากรอก 'เลขที่' (เช่น 01, 02):"); // เพิ่มบรรทัดนี้
    let name = prompt("กรุณากรอกชื่อ-นามสกุล:");
    
    if (studentId != null && name != null && name != "") {
        score += 5;
        // รวมเลขที่ไว้หน้าชื่อเพื่อให้ Sheets เรียงง่าย (เช่น "01 - สมชาย")
        let fullName = studentId + " - " + name; 
        
        if (score > totalScore) score = totalScore;
        localStorage.setItem('userScore', score);
        sendToTeacher(fullName, score); // ส่งชื่อที่มีเลขที่ไป
        updateUI();
    }
}

// ฟังก์ชันแจ้งลา (ถามชื่อ)
function handleLeave() {
    let studentId = prompt("กรุณากรอก 'เลขที่' ของคนที่จะแจ้งลา:"); // เพิ่มบรรทัดนี้
    let name = prompt("กรุณากรอกชื่อ-นามสกุล ของคนที่จะแจ้งลา:");
    
    if (studentId != null && name != null && name != "") {
        let fullName = studentId + " - " + name;
        sendToTeacher(fullName, "ลา (Leave)");
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
        }
    ).catch(err => console.error(err));
}

updateUI();