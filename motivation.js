// ملف motivation.js

// الصوت التحفيزي
const motivationalSound = new Audio('https://www.zapsplat.com/wp-content/uploads/sounds/motivational.mp3');

// دالة لتشغيل الصوت عند بداية اللعبة
function playMotivationalSound() {
    motivationalSound.play().catch(e => {
        console.log("لازم المستخدم يتفاعل أولاً لتشغيل الصوت:", e);
    });
}

// مثال: ربط الصوت بزر معين إذا موجود
function attachToButton(buttonId) {
    const btn = document.getElementById(buttonId);
    if(btn) {
        btn.addEventListener('click', () => {
            playMotivationalSound();
        });
    }
}



// --- استخدامات ممكنة ---
// playMotivationalSound(); // لتشغيل الصوت مباشرة عند استدعاء الدالة
// attachToButton('startGame'); // لو عندك زر "ابدأ اللعبة"
