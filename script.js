document.addEventListener("DOMContentLoaded", function () {
    // ---- Index Page Logic ----
    const searchContainer = document.getElementById('search-form-container');
    const dynamicForm = document.getElementById('dynamic-form-content');
    const startBtn = document.getElementById('start-button-container');
    const modeLabel = document.getElementById('current-mode-label');

    const today = new Date().toISOString().split('T')[0];

    // قائمة المدن المصرية الموسعة
    const citiesHTML = `
        <option value="" disabled selected>اختر مدينة...</option>
        <optgroup label="المدن الرئيسية">
            <option value="cairo">القاهرة</option>
            <option value="giza">الجيزة</option>
            <option value="alex">الإسكندرية</option>
        </optgroup>
        <optgroup label="مدن القناة وسيناء">
            <option value="portsaid">بورسعيد</option>
            <option value="ismailia">الإسماعيلية</option>
            <option value="suez">السويس</option>
            <option value="sharm">شرم الشيخ</option>
            <option value="dahab">دهب</option>
            <option value="tur">الطور</option>
        </optgroup>
        <optgroup label="البحر الأحمر">
            <option value="hurghada">الغردقة</option>
            <option value="gouna">الجونة</option>
            <option value="safaga">سفاجا</option>
            <option value="quseir">القصير</option>
            <option value="marsa_alam">مرسى علم</option>
        </optgroup>
        <optgroup label="الوجه البحري والدلتا">
            <option value="tanta">طنطا</option>
            <option value="mansoura">المنصورة</option>
            <option value="zagazig">الزقازيق</option>
            <option value="damanhour">دمنهور</option>
            <option value="banha">بنها</option>
            <option value="kafr_el_sheikh">كفر الشيخ</option>
            <option value="damietta">دمياط</option>
            <option value="monufia">المنوفية (شبين الكوم)</option>
        </optgroup>
        <optgroup label="الصعيد">
            <option value="fayoum">الفيوم</option>
            <option value="beni_suef">بني سويف</option>
            <option value="minya">المنيا</option>
            <option value="asyut">أسيوط</option>
            <option value="sohag">سوهاج</option>
            <option value="qena">قنا</option>
            <option value="luxor">الأقصر</option>
            <option value="aswan">أسوان</option>
        </optgroup>
        <optgroup label="الساحل الشمالي">
            <option value="matrouh">مرسى مطروح</option>
            <option value="alamein">العلمين</option>
        </optgroup>
    `;

    // قائمة المحطات للقطارات
    const stationsHTML = `
        <option value="" disabled selected>اختر المحطة...</option>
        <optgroup label="القاهرة الكبرى">
            <option value="ramses">محطة مصر (رمسيس)</option>
            <option value="giza">محطة الجيزة</option>
        </optgroup>
        <optgroup label="الإسكندرية">
            <option value="alex_misr">محطة مصر (الإسكندرية)</option>
            <option value="sidi_gaber">محطة سيدي جابر</option>
        </optgroup>
        <optgroup label="باقي المحافظات">
            <option value="tanta">محطة طنطا</option>
            <option value="mansoura">محطة المنصورة</option>
            <option value="asyut">محطة أسيوط</option>
            <option value="luxor">محطة الأقصر</option>
            <option value="aswan">محطة أسوان</option>
        </optgroup>
    `;

    window.showDefaultHero = function() {
        if (searchContainer) searchContainer.classList.add('hidden');
        if (startBtn) startBtn.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.updateSearchFields = function(mode) {
        if (!startBtn || !searchContainer) {
            window.location.href = "index.html#booking-section";
            // Once redirected we won't execute further on this page, but if already on index:
            return;
        }
        
        startBtn.classList.add('hidden');
        searchContainer.classList.remove('hidden');
        document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' });

        document.querySelectorAll('.card-hover').forEach(card => card.classList.remove('active-tab'));
        const selectedCard = document.getElementById(`card-${mode}`);
        if (selectedCard) selectedCard.classList.add('active-tab');

        if (mode === 'car') {
            modeLabel.className = "bg-red-50 text-red-700 px-6 py-2 rounded-full text-sm font-black flex items-center gap-2";
            modeLabel.innerHTML = `<i class="fas fa-car"></i> طلب رحلة خاصة (ملاكي)`;

            dynamicForm.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch text-right">
                    <div class="md:col-span-1 hidden md:flex justify-center">
                        <div class="uber-path-visual">
                            <div class="dot-start"></div>
                            <div class="line-dashed"></div>
                            <div class="dot-end"></div>
                        </div>
                    </div>
                    <div class="md:col-span-8 space-y-6">
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-black text-gray-400 mr-2">نقطة الانطلاق</label>
                            <div class="input-group-custom">
                                <i class="fas fa-location-dot text-blue-500"></i>
                                <input placeholder="أين أنت الآن؟" class="w-full bg-transparent font-bold outline-none text-lg">
                            </div>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-black text-gray-400 mr-2">وجهة الوصول</label>
                            <div class="input-group-custom">
                                <i class="fas fa-map-pin text-red-500"></i>
                                <input placeholder="إلى أين تريد الذهاب؟" class="w-full bg-transparent font-bold outline-none text-lg">
                            </div>
                        </div>
                    </div>
                    <div class="md:col-span-3 flex flex-col justify-between gap-4">
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-black text-gray-400 mr-2">تاريخ السفر</label>
                            <div class="input-group-custom">
                                <i class="fas fa-calendar-day text-orange-500"></i>
                                <input type="date" min="${today}" value="${today}" class="w-full bg-transparent font-bold outline-none cursor-pointer">
                            </div>
                        </div>
                        <button class="w-full bg-black hover:bg-gray-800 text-white font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2">
                            اطلب الآن <i class="fas fa-bolt text-yellow-400"></i>
                        </button>
                    </div>
                </div>`;
        } else if (mode === 'bus') {
            modeLabel.className = "bg-emerald-50 text-emerald-700 px-6 py-2 rounded-full text-sm font-black flex items-center gap-2";
            modeLabel.innerHTML = `<i class="fas fa-bus"></i> تخصيص المسار والمحطات (أتوبيسات)`;

            dynamicForm.innerHTML = `
                <div class="space-y-8 text-right">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div class="flex flex-col gap-2">
                            <label class="text-xs font-black text-gray-400 mr-2">من مدينة</label>
                            <div class="input-group-custom">
                                <i class="fas fa-city text-emerald-500"></i>
                                <select id="fromCity" class="w-full bg-transparent font-bold outline-none text-gray-700">
                                    ${citiesHTML}
                                </select>
                            </div>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-xs font-black text-gray-400 mr-2">من محطة (تحديد دقيق)</label>
                            <div class="input-group-custom">
                                <i class="fas fa-location-dot text-emerald-400"></i>
                                <input type="text" id="fromStation" placeholder="مثلاً: موقف الغردقة الجديد" class="w-full bg-transparent font-bold outline-none">
                            </div>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-xs font-black text-gray-400 mr-2">إلى مدينة</label>
                            <div class="input-group-custom">
                                <i class="fas fa-city text-blue-500"></i>
                                <select id="toCity" class="w-full bg-transparent font-bold outline-none text-gray-700">
                                    ${citiesHTML}
                                </select>
                            </div>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-xs font-black text-gray-400 mr-2">إلى محطة (تحديد دقيق)</label>
                            <div class="input-group-custom">
                                <i class="fas fa-location-dot text-blue-400"></i>
                                <input type="text" id="toStation" placeholder="مثلاً: موقف عبود" class="w-full bg-transparent font-bold outline-none">
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                        <div class="flex flex-col gap-2">
                            <label class="text-xs font-black text-gray-400 mr-2">تاريخ السفر</label>
                            <div class="input-group-custom justify-between">
                                <i class="fa-solid fa-calendar-days text-gray-800"></i>
                                <input type="date" id="travelDate" min="${today}" value="${today}" class="w-full bg-transparent font-bold outline-none cursor-pointer">
                            </div>
                        </div>
                        <div class="flex flex-col gap-2 text-center">
                            <label class="text-xs font-black text-gray-400">عدد التذاكر</label>
                            <div class="flex items-center justify-between bg-gray-50 border-2 border-gray-100 rounded-2xl p-2 px-4">
                                <button type="button" onclick="let s = this.parentNode.querySelector('#ticketCountDisp'); s.innerText = parseInt(s.innerText)+1" class="stepper-btn bg-emerald-500 text-white">+</button>
                                <span id="ticketCountDisp" class="font-black text-xl">1</span>
                                <button type="button" onclick="let s = this.parentNode.querySelector('#ticketCountDisp'); if(parseInt(s.innerText)>1) s.innerText = parseInt(s.innerText)-1" class="stepper-btn bg-emerald-100 text-emerald-600">-</button>
                            </div>
                        </div>
                        <button class="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 text-lg transition-all hover:bg-emerald-700">
                            ابحث عن أتوبيس <i class="fas fa-search text-sm"></i>
                        </button>
                    </div>
                </div>`;
        } else {
            const isTrain = mode === 'train';
            modeLabel.className = "bg-blue-50 text-blue-700 px-6 py-2 rounded-full text-sm font-black flex items-center gap-2";
            modeLabel.innerHTML = `<i class="fas fa-train"></i> حجز قطارات`;

            dynamicForm.innerHTML = `
                <div class="space-y-8 text-right">
                    <div class="flex items-center gap-6 justify-center md:justify-start">
                        <label class="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                            <input type="radio" name="trip-type" checked class="w-5 h-5 accent-blue-600"> ذهاب فقط
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                            <input type="radio" name="trip-type" class="w-5 h-5 accent-blue-600"> ذهاب وعودة 
                        </label>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="flex flex-col gap-2">
                            <label class="text-xs font-black text-gray-400 mr-2">من المحطة</label>
                            <div class="input-group-custom">
                                <i class="fas fa-city text-gray-400"></i>
                                <select class="w-full bg-transparent font-bold outline-none text-gray-600">
                                    ${stationsHTML}
                                </select>
                            </div>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-xs font-black text-gray-400 mr-2">إلى المحطة</label>
                            <div class="input-group-custom">
                                <i class="fas fa-location-dot text-gray-400"></i>
                                <select class="w-full bg-transparent font-bold outline-none text-gray-600">
                                    ${stationsHTML}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                        <div class="flex flex-col gap-2">
                            <label class="text-xs font-black text-gray-400 mr-2">تاريخ السفر</label>
                            <div class="input-group-custom justify-between"><input type="date" min="${today}" value="${today}" class="w-full bg-transparent font-bold outline-none cursor-pointer"><i class="fas fa-calendar-alt text-gray-800"></i></div>
                        </div>
                        <div class="flex flex-col gap-2 text-center">
                            <label class="text-xs font-black text-gray-400">عدد المسافرين</label>
                            <div class="flex items-center justify-between bg-gray-50 border-2 border-gray-100 rounded-2xl p-2 px-4">
                                <button type="button" onclick="let s = this.parentNode.querySelector('.pass-count'); s.innerText = parseInt(s.innerText)+1" class="stepper-btn bg-blue-500 text-white">+</button>
                                <span class="pass-count font-black text-xl">1</span>
                                <button type="button" onclick="let s = this.parentNode.querySelector('.pass-count'); if(parseInt(s.innerText)>1) s.innerText = parseInt(s.innerText)-1" class="stepper-btn bg-blue-100 text-blue-600">-</button>
                            </div>
                        </div>
                        <button class="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 text-lg transition-all hover:bg-blue-700">
                            أعرض الرحلات <i class="fas fa-search text-sm"></i>
                        </button>
                    </div>
                </div>`;
        }
    }


    // ---- Driver Register Logic ----
    const driverForm = document.getElementById('driverForm');
    if (driverForm) {
        driverForm.addEventListener('submit', function(e) {
            e.preventDefault();
            window.showModal();
        });
    }

    const modal = document.getElementById('modal');
    window.showModal = function() {
        if(modal) modal.classList.remove('hidden');
    }
    window.hideModal = function() {
        if(modal) modal.classList.add('hidden');
    }


    // ---- Create Account Logic ----
    const signupForm = document.getElementById('signupForm');
    const togglePassBtn = document.getElementById('togglePass');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    if (togglePassBtn && passwordInput) {
        togglePassBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassBtn.classList.toggle('fa-eye');
            togglePassBtn.classList.toggle('fa-eye-slash');
        });
    }

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            const pass = document.getElementById('password').value;
            if (this.value === pass) {
                const cw = document.getElementById('confirmWrapper');
                const ce = document.getElementById('confirmError');
                if(cw) cw.classList.remove('error');
                if(ce) ce.style.display = 'none';
            }
        });
    }

    window.handleSignup = function(event) {
        event.preventDefault();
        
        const nameInput = document.getElementById('fullName');
        const passInput = document.getElementById('password');
        const confirmPassInput = document.getElementById('confirmPassword');
        
        if (!nameInput || !passInput || !confirmPassInput) return;

        const name = nameInput.value;
        const pass = passInput.value;
        const confirmPass = confirmPassInput.value;
        
        const confirmWrapper = document.getElementById('confirmWrapper');
        const confirmError = document.getElementById('confirmError');

        if(confirmWrapper) confirmWrapper.classList.remove('error');
        if(confirmError) confirmError.style.display = 'none';

        if (pass !== confirmPass) {
            if(confirmWrapper) confirmWrapper.classList.add('error');
            if(confirmError) confirmError.style.display = 'block';
            return false;
        }

        window.showMessage(`أهلاً بك يا ${name}! تم إنشاء حسابك بنجاح.`, '#10b981');
    }

    window.showMessage = function(text, color) {
        const box = document.getElementById('msg-box');
        if(!box) return;
        box.innerText = text;
        box.style.backgroundColor = color;
        box.style.display = 'block';
        
        setTimeout(() => {
            box.style.display = 'none';
        }, 4000);
    }


    // ---- Login / Driver Login Logic ----
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

    window.toggleDriverPass = function() {
        const field = document.getElementById('driverPass');
        const icon = document.getElementById('eyeIcon');
        if(!field || !icon) return;

        if (field.type === 'password') {
            field.type = 'text';
            icon.setAttribute('data-lucide', 'eye-off');
        } else {
            field.type = 'password';
            icon.setAttribute('data-lucide', 'eye');
        }

        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }
    }

    window.togglePassword = function() {
        const passField = document.getElementById('passwordField');
        const eyeIcon = document.getElementById('eyeIcon');
        if(!passField || !eyeIcon) return;

        if (passField.type === 'password') {
            passField.type = 'text';
            eyeIcon.setAttribute('data-lucide', 'eye-off');
        } else {
            passField.type = 'password';
            eyeIcon.setAttribute('data-lucide', 'eye');
        }

        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }
    };

    const loginForm = document.getElementById('loginForm');
    if(loginForm){
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("login clicked");
            localStorage.setItem("isLoggedIn", "true");
            console.log("saved:", localStorage.getItem("isLoggedIn"));
            alert("تم تسجيل الدخول ✅");
            window.location.href = "index.html";
        });
    }

    const driverLoginForm = document.getElementById('driverLoginForm');
    if(driverLoginForm) {
        driverLoginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = document.getElementById('loginBtn');
            if(btn) {
                btn.disabled = true;
                btn.innerHTML = 'جاري التحميل...';
            }
            setTimeout(() => {
                window.location.href = "driver-dashboard.html";
            }, 1500);
        });
    }
});
