// ===============================
// script.js
// ===============================

// ===== بنك الكلمات =====
const wordSources = {
    animals: ["أسد", "كلب", "قطة", "فيل", "زرافة"],
    colors: ["أحمر", "أزرق", "أخضر", "أصفر"],
    games: ["كرة", "شطرنج", "سباق"],
    jobs: ["طبيب", "مهندس", "مدرس"],
    numbers: ["واحد", "اثنان", "ثلاثة"],
    letters: ["أ", "ب", "ت", "ث"]
};



function generateCategory(words, count) {
    const result = [];
    let i = 1;

    while (result.length < count) {
        for (let w of words) {
            if (result.length >= count) break;
            result.push(w + "_" + i);
        }
        i++;
    }
    return result;
}

const wordBank = {
    animals: generateCategory(wordSources.animals, 10000),
    colors: generateCategory(wordSources.colors, 8000),
    games: generateCategory(wordSources.games, 6000),
    jobs: generateCategory(wordSources.jobs, 7000),
    numbers: generateCategory(wordSources.numbers, 3000),
    letters: generateCategory(wordSources.letters, 2000)
};
// ===== نهاية بنك الكلمات =====


// =======================================
// كل منطق الصفحة يبدأ من هنا
// =======================================
document.addEventListener('DOMContentLoaded', () => {

    const activeStudentId = localStorage.getItem('activeStudentId');
    const path = window.location.pathname;

    // =================================================
    // 1. الصفحات المسموح فتحها بدون طالب
    // =================================================
    const isPublicPage =
        path.includes('login.html') ||
        path.includes('account_switcher.html') ||
        path.includes('settings.html') ||
        path === '/';

    // =================================================
    // 2. فحص تسجيل الدخول
    // =================================================
    if (!isPublicPage && !activeStudentId) {
        alert('يجب اختيار طالب أو تسجيل الدخول أولاً.');
        window.location.href = 'login.html';
        return;
    }

    // =================================================
    // 3. أزرار الشريط الجانبي
    // =================================================

    // دخول ولي الأمر
    const parentLoginLink = document.getElementById('parent-login-link');
    if (parentLoginLink) {
        parentLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'account_switcher.html?action=parentlogin';
        });
    }

    // تسجيل خروج الطالب
    const logoutStudentLink = document.getElementById('logout-student-link');
    if (logoutStudentLink) {
        logoutStudentLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('هل أنت متأكد من تسجيل خروج الطالب الحالي؟')) {
                localStorage.removeItem('activeStudentId');
                alert('تم تسجيل خروج الطالب بنجاح.');
                window.location.href = 'account_switcher.html';
            }
        });
    }

    // =================================================
    // 4. تطبيق الإعدادات العامة
    // =================================================
    const applySettings = () => {
        const settings = JSON.parse(localStorage.getItem('userSettings')) || {};
        if (settings.fontSize) {
            document.body.style.fontSize =
                settings.fontSize === 'small' ? '14px' :
                settings.fontSize === 'large' ? '20px' :
                '16px';
        }
    };
    applySettings();

    // =================================================
    // 5. تجربة بنك الكلمات (كلمة عشوائية)
    // =================================================
    const randomAnimal =
        wordBank.animals[Math.floor(Math.random() * wordBank.animals.length)];

    console.log("كلمة عشوائية من بنك الكلمات:", randomAnimal);

    // =================================================
    // 6. نظام الكوينز (Coin System)
    // =================================================
    
    // تهيئة عنصر عرض الكوينز في الصفحة إذا لم يكن موجوداً
    let coinDisplay = document.getElementById('coin-count');
    if (!coinDisplay) {
        // إنشاء العنصر ديناميكياً إذا لم يكن موجوداً في HTML
        const coinContainer = document.createElement('div');
        coinContainer.className = 'coins-display';
        coinContainer.innerHTML = '💰 <span id="coin-count">0</span>';
        document.body.appendChild(coinContainer);
        coinDisplay = document.getElementById('coin-count');
    }

    // قراءة الرصيد الحالي للطالب النشط
    const getActiveStudentData = () => {
        const students = JSON.parse(localStorage.getItem('allStudents') || '[]');
        return students.find(s => s.id === activeStudentId);
    };

    let currentCoins = getActiveStudentData()?.coins || 0;
    updateCoinUI();

    // دالة تحديث الواجهة
    function updateCoinUI() {
        if (coinDisplay) {
            coinDisplay.innerText = currentCoins;
        }

        // تحديث العرض في صفحة الكوينز الرئيسية (coins.html)
        const totalCoinsDisplay = document.getElementById('total-coins');
        if (totalCoinsDisplay) {
            totalCoinsDisplay.innerText = currentCoins;
        }

        // تحديث العرض في صفحة الإعدادات (settings.html)
        const settingsCoinsDisplay = document.getElementById('current-coins');
        if (settingsCoinsDisplay) {
            settingsCoinsDisplay.innerText = currentCoins;
        }
    }

    // دالة عامة لإضافة الكوينز (يمكن استدعاؤها من أي مكان)
    window.addCoins = function(amount) {
        const students = JSON.parse(localStorage.getItem('allStudents') || '[]');
        const studentIndex = students.findIndex(s => s.id === activeStudentId);

        if (studentIndex !== -1) {
            students[studentIndex].coins = (students[studentIndex].coins || 0) + amount;
            localStorage.setItem('allStudents', JSON.stringify(students));
            currentCoins = students[studentIndex].coins;
        }
        
        updateCoinUI();
        
        // تأثير بصري بسيط
        const container = document.querySelector('.coins-display');
        if (container) {
            container.style.transform = "scale(1.2)";
            setTimeout(() => container.style.transform = "scale(1)", 200);
        }
        console.log(`تم إضافة ${amount} كوينز. الرصيد الجديد: ${currentCoins}`);
    };

    // دالة عامة لحفظ الكلمات (لحل مشكلة عدم ظهور الكلمات في الحقيبة)
    window.saveWordToReview = function(word, source) {
        const students = JSON.parse(localStorage.getItem('allStudents') || '[]');
        const studentIndex = students.findIndex(s => s.id === activeStudentId);

        if (studentIndex !== -1) {
            if (!students[studentIndex].learnedWords) {
                students[studentIndex].learnedWords = [];
            }
            // منع التكرار
            if (!students[studentIndex].learnedWords.some(w => w.word === word)) {
                students[studentIndex].learnedWords.push({
                    word: word,
                    source: source,
                    date: new Date().toLocaleDateString('ar-EG'),
                    timestamp: Date.now()
                });
                localStorage.setItem('allStudents', JSON.stringify(students));
            }
        }
    };

    // =================================================
    // 7. التحكم في الشريط الجانبي (Sidebar Toggle)
    // =================================================
    
    // استخدام nav.sidebar لضمان اختيار القائمة الصحيحة وتجاهل أي عناصر قديمة
    const sidebar = document.querySelector('nav.sidebar') || document.querySelector('.sidebar');
    const pageWrapper = document.querySelector('.page-wrapper');
    
    // إنشاء زر القائمة ديناميكياً
    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = '☰';
    toggleBtn.className = 'menu-toggle-btn';
    toggleBtn.setAttribute('aria-label', 'Toggle Sidebar');
    document.body.appendChild(toggleBtn);

    toggleBtn.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            // منطق الموبايل
            sidebar.classList.toggle('active');
            // إزالة كلاس hidden إذا كان موجوداً لضمان الظهور
            sidebar.classList.remove('hidden');
        } else {
            // منطق سطح المكتب
            sidebar.classList.toggle('hidden');
            if (pageWrapper) {
                pageWrapper.classList.toggle('expanded');
            }
        }
    });

    // إغلاق القائمة عند النقر خارجها في الموبايل
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && sidebar.classList.contains('active') && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
});
