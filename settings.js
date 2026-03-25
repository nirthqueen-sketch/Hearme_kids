// settings.js

document.addEventListener('DOMContentLoaded', () => {
    // تم نقل فحص الدخول لـ script.js
    
    const currentStudentId = localStorage.getItem('activeStudentId');
    const parentAccount = JSON.parse(localStorage.getItem('parentAccount') || '{}');
    let allStudents = JSON.parse(localStorage.getItem('allStudents') || '[]');
  

    
    // ===================================
    // 1. وظائف عامة مساعدة
    // ===================================

    const saveSettings = () => {
        const settings = {
            volume: document.getElementById('volume-slider').value,
            rate: document.getElementById('speech-rate').value,
            voiceURI: document.getElementById('voice-select').value,
            fontSize: document.getElementById('font-size-select').value
        };
        localStorage.setItem('userSettings', JSON.stringify(settings));
        // إعادة تطبيق الإعدادات العامة لكي يتأثر حجم الخط فوراً
        document.body.style.fontSize = settings.fontSize === 'small' ? '14px' : 
                                        settings.fontSize === 'large' ? '20px' : '16px';
    };

    const loadSettings = () => {
        const savedSettings = JSON.parse(localStorage.getItem('userSettings')) || {};
        
        if (savedSettings.volume) document.getElementById('volume-slider').value = savedSettings.volume;
        if (savedSettings.rate) document.getElementById('speech-rate').value = savedSettings.rate;
        if (savedSettings.fontSize) document.getElementById('font-size-select').value = savedSettings.fontSize;
    };
    
    const updateCoinsDisplay = () => {
        const activeStudent = allStudents.find(s => s.id === currentStudentId);
        if (activeStudent) {
            document.getElementById('current-coins').textContent = activeStudent.coins;
        } else {
             document.getElementById('current-coins').textContent = 0;
        }
    };


    // ===================================
    // 2. إدارة الأصوات (Speech Synthesis)
    // ===================================

    const populateVoiceList = () => {
        const voiceSelect = document.getElementById('voice-select');
        voiceSelect.innerHTML = '';
        const voices = window.speechSynthesis.getVoices().filter(voice => voice.lang.startsWith('ar') || voice.lang.startsWith('en'));

        voices.forEach(voice => {
            const option = document.createElement('option');
            option.textContent = voice.name + ' (' + voice.lang + ')';
            option.value = voice.voiceURI;
            if (voice.default && voice.lang.startsWith('ar')) {
                option.selected = true;
            }
            voiceSelect.appendChild(option);
        });
        const savedSettings = JSON.parse(localStorage.getItem('userSettings')) || {};
        if (savedSettings.voiceURI && voiceSelect.querySelector(`option[value="${savedSettings.voiceURI}"]`)) {
             voiceSelect.value = savedSettings.voiceURI;
        }
    };
    
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = populateVoiceList;
    }
    populateVoiceList(); 

    // ===================================
    // 3. وظائف تسجيل الخروج والمسح
    // ===================================
    
    // أ. تسجيل خروج الطالب الحالي (في منطقة الإعدادات)
    document.getElementById('logout-student-btn-sec').addEventListener('click', () => {
         if (confirm('هل أنت متأكد من تسجيل خروج الطالب الحالي؟')) {
            localStorage.removeItem('activeStudentId');
            alert('تم تسجيل خروج الطالب. سيتم نقلك لصفحة اختيار الحساب.');
            window.location.href = 'account_switcher.html';
        }
    });

    // ب. مسح كلمات المراجعة (يتطلب قفل أبوي)
    document.getElementById('clear-words-btn').addEventListener('click', () => {
        const parentPass = prompt('للمتابعة، أدخل كلمة المرور الأبوية:');
        
        if (parentPass === parentAccount.password) {
            if (confirm('تحذير: هل أنت متأكد من مسح جميع الكلمات المحفوظة للمراجعة لكل الأبناء؟')) {
                allStudents.forEach(student => {
                    student.learnedWords = [];
                });
                localStorage.setItem('allStudents', JSON.stringify(allStudents));
                alert('تم مسح جميع كلمات المراجعة بنجاح.');
            }
        } else if (parentPass !== null) {
            alert('كلمة المرور غير صحيحة. تم إلغاء العملية.');
        }
    });


    // ج. تسجيل الخروج الكامل (الأكثر خطورة)
    document.getElementById('parent-logout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const inputPass = document.getElementById('parent-pass-logout').value;
        document.getElementById('logout-error-msg').textContent = '';

        if (inputPass === parentAccount.password) {
            if (confirm('تحذير نهائي: هذا سيمحو جميع بيانات الولي وكل الأبناء المسجلين نهائياً. هل أنت متأكد؟')) {
                localStorage.clear(); 
                alert('تم تسجيل الخروج ومسح جميع البيانات بنجاح.');
                window.location.href = 'login.html';
            }
        } else {
            document.getElementById('logout-error-msg').textContent = 'كلمة المرور غير صحيحة.';
        }
        document.getElementById('parent-pass-logout').value = '';
    });
    
    // ===================================
    // 4. تهيئة الصفحة والـ Event Listeners
    // ===================================

    loadSettings();
    updateCoinsDisplay();

    document.getElementById('volume-slider').addEventListener('change', saveSettings);
    document.getElementById('speech-rate').addEventListener('change', saveSettings);
    document.getElementById('voice-select').addEventListener('change', saveSettings);
    document.getElementById('font-size-select').addEventListener('change', saveSettings);
    
    document.getElementById('toggle-fullscreen').addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });
});

