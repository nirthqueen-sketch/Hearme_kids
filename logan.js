// login.js

document.addEventListener('DOMContentLoaded', () => {
    // تحديد عناصر الشاشات في صفحة login.html
    const roleSelectionScreen = document.getElementById('role-selection');
    const studentMessageScreen = document.getElementById('student-message');
    const parentFormScreen = document.getElementById('parent-form');
    const parentVerificationScreen = document.getElementById('parent-verification');
    const featuresVideoScreen = document.getElementById('features-video');
    const studentDetailsScreen = document.getElementById('student-details');



    // تحديد النماذج
    const parentRegistrationForm = document.getElementById('parent-registration-form');
    const verificationForm = document.getElementById('verification-form');
    const studentDetailsForm = document.getElementById('student-details-form');
    
    // ===================================
    // دالة التبديل بين الشاشات
    // ===================================
    /**
     * يخفي جميع الشاشات التي تحمل الكلاس 'login-screen' ثم يظهر الشاشة المحددة.
     * @param {HTMLElement} showScreen - العنصر المراد إظهاره.
     */
    const switchScreen = (showScreen) => {
        const allScreens = document.querySelectorAll('.login-screen');
        // إخفاء كل الشاشات أولاً
        allScreens.forEach(screen => screen.classList.add('hidden'));
        // إظهار الشاشة المطلوبة
        showScreen.classList.remove('hidden');
    };
    
    // دالة مساعدة لتوليد معرف فريد للطالب
    const generateUniqueId = () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    // ===================================
    // فحص حالة الدخول عند تحميل الصفحة
    // ===================================
    
    // إذا كان هناك طالب نشط بالفعل، يتم توجيهه للرئيسية مباشرة
    if (localStorage.getItem('activeStudentId')) {
        window.location.href = 'main.html';
        return; 
    }
    
    // إظهار الشاشة الأولى عند البداية
    switchScreen(roleSelectionScreen);


    // ===================================
    // 1. منطق أزرار اختيار الدور
    // ===================================
    
    // أنا طالب ⬅️ رسالة التوجيه
    document.getElementById('student-btn').addEventListener('click', () => {
        switchScreen(studentMessageScreen);
    });

    // أنا ولي أمر ⬅️ نموذج الولي أو إدارة الحسابات
    document.getElementById('parent-btn').addEventListener('click', () => {
        // إذا كان هناك ولي أمر مسجل بالفعل، يتم توجيهه لصفحة تبديل الحسابات
        if (localStorage.getItem('parentAccount')) {
            alert('لقد سجلت كولي أمر سابقاً. سيتم نقلك لصفحة تبديل وإدارة الحسابات.');
            window.location.href = 'account_switcher.html';
            return;
        }
        // إذا لم يكن مسجلاً، ينتقل لنموذج التسجيل
        switchScreen(parentFormScreen);
    });


    // ===================================
    // 2. منطق التنقل الخلفي والأمام
    // ===================================

    // العودة
    document.getElementById('back-from-student-btn').addEventListener('click', () => switchScreen(roleSelectionScreen));
    document.getElementById('back-from-parent-form-btn').addEventListener('click', () => switchScreen(roleSelectionScreen));
    document.getElementById('back-from-verification-btn').addEventListener('click', () => switchScreen(parentFormScreen));
    document.getElementById('back-from-video-btn').addEventListener('click', () => switchScreen(parentVerificationScreen));
    document.getElementById('back-from-student-details-btn').addEventListener('click', () => switchScreen(featuresVideoScreen));
    
    // المتابعة من شاشة الفيديو
    document.getElementById('continue-btn').addEventListener('click', () => switchScreen(studentDetailsScreen));
    
    // ===================================
    // 3. عند تقديم نموذج الولي (الشاشة 3)
    // ===================================
    parentRegistrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // حفظ بيانات الولي مؤقتاً في sessionStorage لحين إتمام التسجيل
        sessionStorage.setItem('tempParentName', document.getElementById('parent-name').value);
        sessionStorage.setItem('tempParentEmail', document.getElementById('parent-email').value);
        sessionStorage.setItem('tempParentPassword', document.getElementById('parent-password').value);

        switchScreen(parentVerificationScreen);
    });

    // ===================================
    // 4. عند التحقق من العمر (الشاشة 4)
    // ===================================
    verificationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const birthYear = parseInt(document.getElementById('birth-year').value);
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;

        if (age >= 18) {
             switchScreen(featuresVideoScreen); // الانتقال للفيديو
        } else {
            alert('يجب أن يكون الولي أكبر سناً (18 سنة فأكثر) لإعداد الحساب.');
        }
    });

    // ===================================
    // 5. عند التسجيل النهائي للطالب (الشاشة 6)
    // ===================================
    studentDetailsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // استرداد بيانات الولي المؤقتة
        const parentPassword = sessionStorage.getItem('tempParentPassword');
        const parentName = sessionStorage.getItem('tempParentName');
        const parentEmail = sessionStorage.getItem('tempParentEmail');
        
        // 1. إنشاء بيانات الطالب الجديد
        const newStudent = {
            id: generateUniqueId(),
            name: document.getElementById('student-name').value,
            age: document.getElementById('student-age').value,
            grade: document.getElementById('student-grade').value,
            coins: 0,
            learnedWords: [] 
        };

        // 2. تحديث قائمة الأبناء الكلية في localStorage
        let allStudents = JSON.parse(localStorage.getItem('allStudents')) || [];
        allStudents.push(newStudent);
        localStorage.setItem('allStudents', JSON.stringify(allStudents));

        // 3. حفظ بيانات الولي (يتم حفظها مرة واحدة فقط عند أول تسجيل)
        if (!localStorage.getItem('parentAccount')) {
            const parentAccount = {
                name: parentName,
                email: parentEmail,
                password: parentPassword, 
            };
            localStorage.setItem('parentAccount', JSON.stringify(parentAccount));
        }
        
        // 4. تعيين الطالب الحالي كـ Active
        localStorage.setItem('activeStudentId', newStudent.id);
        
        // مسح البيانات المؤقتة
        sessionStorage.clear();

        alert(`تم إعداد الحساب بنجاح! مرحباً بك يا ${newStudent.name}.`);
        
        window.location.href = 'main.html'; 
    });
});

