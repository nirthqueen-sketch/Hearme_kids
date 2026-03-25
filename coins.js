// coins.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. جلب بيانات الطالب النشط
    const activeStudentId = localStorage.getItem('activeStudentId');
    const allStudents = JSON.parse(localStorage.getItem('allStudents') || '[]');


    
    // البحث عن بيانات الطالب الحالي في المصفوفة
    const currentStudent = allStudents.find(s => s.id === activeStudentId);

    if (!currentStudent) {
        // إذا لم يتم العثور على طالب (حالة نادرة بفضل فحص script.js)
        return; 
    }

    // 2. تحديث الواجهة بالبيانات
    document.getElementById('student-name-header').textContent = currentStudent.name;
    document.getElementById('total-coins').textContent = currentStudent.coins || 0;

    const wordsContainer = document.getElementById('words-container');
    const emptyMsg = document.getElementById('empty-msg');

    // 3. عرض قائمة الكلمات (learnedWords)
    const learnedWords = currentStudent.learnedWords || [];

    if (learnedWords.length === 0) {
        emptyMsg.classList.remove('hidden');
    } else {
        learnedWords.forEach(wordObj => {
            const wordCard = document.createElement('div');
            wordCard.style.cssText = `
                background: white;
                padding: 15px;
                border-radius: 15px;
                border: 2px solid #C0E3EA;
                min-width: 150px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            `;

            wordCard.innerHTML = `
                <span style="font-size: 22px; font-weight: bold; color: #274569;">${wordObj.word}</span>
                <button class="speak-btn" style="background-color: #0077b6; padding: 5px 15px; font-size: 14px;">🔊 اسمع</button>
            `;

            // إضافة وظيفة النطق عند الضغط على الزر
            wordCard.querySelector('.speak-btn').onclick = () => {
                speakText(wordObj.word);
            };

            wordsContainer.appendChild(wordCard);
        });
    }

    // ===================================
    // وظيفة النطق (باستخدام إعدادات المستخدم)
    // ===================================
    function speakText(text) {
        if (!('speechSynthesis' in window)) {
            alert("متصفحك لا يدعم خاصية النطق الصوتي.");
            return;
        }

        const msg = new SpeechSynthesisUtterance();
        msg.text = text;
        msg.lang = 'ar-SA'; // لغة عربية

        // جلب الإعدادات المحفوظة (من صفحة الإعدادات)
        const settings = JSON.parse(localStorage.getItem('userSettings')) || {};
        msg.volume = settings.volume || 1;
        msg.rate = settings.rate || 1;

        // اختيار الصوت المفضل إذا كان مخزناً
        if (settings.voiceURI) {
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.voiceURI === settings.voiceURI);
            if (preferredVoice) msg.voice = preferredVoice;
        }

        window.speechSynthesis.speak(msg);
    }
});
