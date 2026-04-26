function initializeStorage() {
    if (!localStorage.getItem('gymUsers')) {
        localStorage.setItem('gymUsers', JSON.stringify([]));
    }
    if (!localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', JSON.stringify(null));
    }
}

function getAllUsers() {
    const users = localStorage.getItem('gymUsers');
    return users ? JSON.parse(users) : [];
}

function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    updateNavBar();
}

function saveUserData(user) {
    const users = getAllUsers();
    const existingUserIndex = users.findIndex(u => u.email === user.email);

    if (existingUserIndex !== -1) {
        users[existingUserIndex] = user;
    } else {
        users.push(user);
    }

    localStorage.setItem('gymUsers', JSON.stringify(users));
}

// ==================== AUTHENTICATION ====================

function openAuthModal(type) {
    const modal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const resetForm = document.getElementById('resetForm');

    if (type === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        resetForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        resetForm.style.display = 'none';
    }

    modal.classList.add('show');
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    modal.classList.remove('show');

    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('registerName').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
    document.getElementById('registerAge').value = '';
    document.getElementById('resetEmail').value = '';
    document.getElementById('resetNewPassword').value = '';
    document.getElementById('resetConfirmPassword').value = '';
}

function switchToLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('resetForm').style.display = 'none';
}

function switchToReset() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('resetForm').style.display = 'block';
}

function handlePasswordReset(event) {
    event.preventDefault();

    const email = document.getElementById('resetEmail').value.trim();
    const newPassword = document.getElementById('resetNewPassword').value;
    const confirmPassword = document.getElementById('resetConfirmPassword').value;

    if (!email || !newPassword || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    if (newPassword.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }

    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
        alert('Email not found. Please register first.');
        return;
    }

    // Update password
    users[userIndex].password = newPassword;
    localStorage.setItem('gymUsers', JSON.stringify(users));

    alert('Password reset successful! You can now login with your new password.');
    
    // Clear form and go to login
    document.getElementById('resetEmail').value = '';
    document.getElementById('resetNewPassword').value = '';
    document.getElementById('resetConfirmPassword').value = '';
    switchToLogin();
}

function switchToRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('resetForm').style.display = 'none';
}

function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const age = document.getElementById('registerAge').value;

    if (!name || !email || !password || !age) {
        alert('Please fill in all fields');
        return;
    }

    const users = getAllUsers();

    if (users.some(user => user.email === email)) {
        alert('Email already registered. Please login or use a different email.');
        return;
    }

    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        age: parseInt(age, 10),
        membership: 'None',
        workoutPlan: 'None',
        bmi: null,
        registeredDate: new Date().toLocaleDateString()
    };

    saveUserData(newUser);
    setCurrentUser(newUser);

    alert('Registration successful! Welcome to FitZone!');
    closeAuthModal();
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }

    const users = getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        setCurrentUser(user);
        alert('Login successful! Welcome back!');
        closeAuthModal();
    } else {
        alert('Invalid email or password. Please try again.');
    }
}

function logout() {
    setCurrentUser(null);
    alert('You have been logged out.');
    closeAuthModal();
}

function updateNavBar() {
    const currentUser = getCurrentUser();
    const loginBtn = document.getElementById('loginBtnNav');
    const logoutBtn = document.getElementById('logoutBtnNav');
    const profileBtn = document.getElementById('profileBtnNav');

    if (!loginBtn || !logoutBtn || !profileBtn) {
        return;
    }

    if (currentUser) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        profileBtn.style.display = 'block';
    } else {
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        profileBtn.style.display = 'none';
    }
}

// ==================== BMI CALCULATOR ====================

function calculateBMI() {
    const height = parseFloat(document.getElementById('bmiHeight').value);
    const weight = parseFloat(document.getElementById('bmiWeight').value);
    const resultDiv = document.getElementById('bmiResult');

    if (!height || !weight || height <= 0 || weight <= 0) {
        alert('Please enter valid height and weight');
        return;
    }

    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    let category = '';
    let categoryColor = '';

    if (bmi < 18.5) {
        category = 'Underweight';
        categoryColor = '#38bdf8';
    } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal weight';
        categoryColor = '#22c55e';
    } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
        categoryColor = '#f59e0b';
    } else {
        category = 'Obese';
        categoryColor = '#ef4444';
    }

    const currentUser = getCurrentUser();
    if (currentUser) {
        currentUser.bmi = {
            value: bmi,
            height: height,
            weight: weight,
            category: category,
            date: new Date().toLocaleDateString()
        };
        saveUserData(currentUser);
        setCurrentUser(currentUser);
    }

    resultDiv.innerHTML = `
        <h4>Your BMI Result</h4>
        <p style="font-size: 2.2rem; font-weight: bold; color: ${categoryColor};">${bmi}</p>
        <p style="font-size: 1.1rem; color: ${categoryColor}; margin: 10px 0;">${category}</p>
        <p style="font-size: 0.95rem; color: var(--muted); margin-top: 15px;">
            Height: ${height} cm | Weight: ${weight} kg
        </p>
        <div style="margin-top: 15px; font-size: 0.85rem; color: var(--muted);">
            <p><strong>BMI Categories:</strong></p>
            <p>Underweight: BMI < 18.5</p>
            <p>Normal weight: 18.5 - 24.9</p>
            <p>Overweight: 25 - 29.9</p>
            <p>Obese: BMI ≥ 30</p>
        </div>
    `;
}

// ==================== MEMBERSHIP ====================

function buyMembership(planName, price) {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        alert('Please login first to purchase a membership');
        openAuthModal('login');
        return;
    }

    // Store membership data in sessionStorage
    sessionStorage.setItem('selectedMembership', JSON.stringify({
        name: planName,
        price: price,
        duration: 'Monthly'
    }));

    // Redirect to payments page
    window.location.href = 'payments.html';
}

// ==================== TRAINERS ====================

function messageCoach(coachId, coachName) {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        alert('Please login first to message a coach');
        openAuthModal('login');
        return;
    }

    // Store selected coach data
    sessionStorage.setItem('selectedCoach', coachId);

    // Redirect to communication page
    window.location.href = 'communication.html';
}

// ==================== THEME ====================

const moonIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 14.5A9 9 0 0 1 9.5 3 7 7 0 1 0 21 14.5z"/></svg>';
const sunIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.5a1 1 0 0 1 1-1h.01a1 1 0 0 1 1 1v1.1a1 1 0 0 1-2 0V4.5zM6.34 6.34a1 1 0 0 1 1.41 0l.78.78a1 1 0 1 1-1.41 1.41l-.78-.78a1 1 0 0 1 0-1.41zm11.32 0a1 1 0 0 1 0 1.41l-.78.78a1 1 0 1 1-1.41-1.41l.78-.78a1 1 0 0 1 1.41 0zM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm7.5 3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-1.1a1 1 0 0 1 0-2h1.1zM4.5 12a1 1 0 0 1 1-1h1.1a1 1 0 0 1 0 2H5.5a1 1 0 0 1-1-1zm11.72 5.88a1 1 0 0 1 1.41 0l.78.78a1 1 0 0 1-1.41 1.41l-.78-.78a1 1 0 0 1 0-1.41zM6.34 17.66a1 1 0 0 1 0 1.41l-.78.78a1 1 0 1 1-1.41-1.41l.78-.78a1 1 0 0 1 1.41 0zm5.66 1.84a1 1 0 0 1 1 1v.01a1 1 0 0 1-2 0V20.5a1 1 0 0 1 1-1z"/></svg>';

function setTheme(mode) {
    const body = document.body;
    const toggleBtn = document.getElementById('themeToggle');

    if (mode === 'dark') {
        body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        if (toggleBtn) {
            toggleBtn.innerHTML = sunIcon;
            toggleBtn.setAttribute('aria-pressed', 'true');
        }
    } else {
        body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        if (toggleBtn) {
            toggleBtn.innerHTML = moonIcon;
            toggleBtn.setAttribute('aria-pressed', 'false');
        }
    }
}

function toggleTheme() {
    const isDark = document.body.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
}

function setActiveNav() {
    const page = document.body.dataset.page;
    if (!page) {
        return;
    }

    const navLinks = document.querySelectorAll('.nav-menu a[data-link]');
    navLinks.forEach(link => {
        if (link.dataset.link === page) {
            link.classList.add('active');
        }
    });
}

// ==================== NAV TOGGLE ====================

function setupNavToggle() {
    const toggle = document.getElementById('navToggle');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (!toggle) {
        return;
    }

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('nav-open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('nav-open');
        });
    });
}

// ==================== PROFILE ====================

function loadProfile() {
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileNameDetail = document.getElementById('profileNameDetail');
    const profileEmailDetail = document.getElementById('profileEmailDetail');
    const profileAge = document.getElementById('profileAge');
    const profileMembership = document.getElementById('profileMembership');
    const profileBmi = document.getElementById('profileBmi');

    if (!profileName) {
        return;
    }

    const currentUser = getCurrentUser();

    if (!currentUser) {
        profileName.textContent = 'Guest';
        profileEmail.textContent = 'Login to see your profile.';
        if (profileNameDetail) {
            profileNameDetail.textContent = 'Guest';
        }
        if (profileEmailDetail) {
            profileEmailDetail.textContent = 'Login to see your profile.';
        }
        profileAge.textContent = '-';
        profileMembership.textContent = 'None';
        profileBmi.textContent = 'Not calculated';
        return;
    }

    profileName.textContent = currentUser.name;
    profileEmail.textContent = currentUser.email;
    if (profileNameDetail) {
        profileNameDetail.textContent = currentUser.name;
    }
    if (profileEmailDetail) {
        profileEmailDetail.textContent = currentUser.email;
    }
    profileAge.textContent = currentUser.age;
    profileMembership.textContent = currentUser.membership || 'None';
    profileBmi.textContent = currentUser.bmi ? `${currentUser.bmi.value} (${currentUser.bmi.category})` : 'Not calculated';
}

// ==================== TRAINER CHAT ====================

const trainerReplies = {
    alex: [
        'Focus on form today, then add 5% weight next session.',
        'Great energy. Prioritize compound lifts this week.',
        'Remember to recover with protein and sleep.'
    ],
    sarah: [
        'Your endurance is improving. Add a 10-minute cooldown jog.',
        'Let us keep intervals short and powerful today.',
        'Hydrate before your next HIIT session.'
    ],
    michael: [
        'Take deep breaths and slow your transitions.',
        'A 5-minute stretch before bed will help recovery.',
        'Focus on balance and alignment in your next flow.'
    ],
    emily: [
        'Try a protein-rich snack post-workout.',
        'Aim for balanced macros in your next meal.',
        'Consistent hydration will boost your energy.'
    ],
    david: [
        'Keep your guard high and lead with your jab.',
        'Footwork drills will sharpen your timing.',
        'Stay relaxed in the shoulders during combinations.'
    ],
    jessica: [
        'Keep your strokes long and controlled.',
        'Breathe every two strokes for steady pace.',
        'Use fins for an extra leg burn session.'
    ]
};

let activeTrainer = 'alex';

function setupTrainerChat() {
    const trainerItems = document.querySelectorAll('.trainer-item');
    const chatTitle = document.getElementById('chatCoachName');
    const chatStatus = document.getElementById('chatCoachStatus');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');

    if (!chatTitle || !chatMessages || !chatInput || !chatSend) {
        return;
    }

    function setTrainer(trainerId, name, statusText) {
        activeTrainer = trainerId;
        chatTitle.textContent = name;
        chatStatus.textContent = statusText;
        chatMessages.innerHTML = '';
        addCoachMessage(`Hi, I'm ${name}. How can I help today?`);
    }

    function addUserMessage(text) {
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble user';
        bubble.textContent = text;
        chatMessages.appendChild(bubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addCoachMessage(text) {
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble coach';
        bubble.textContent = text;
        chatMessages.appendChild(bubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) {
            return;
        }
        addUserMessage(text);
        chatInput.value = '';

        const replies = trainerReplies[activeTrainer] || ['Got it! Let me look into that.'];
        const reply = replies[Math.floor(Math.random() * replies.length)];

        setTimeout(() => {
            addCoachMessage(reply);
        }, 600);
    }

    trainerItems.forEach(item => {
        item.addEventListener('click', () => {
            const id = item.dataset.trainer;
            const name = item.dataset.name;
            const status = item.dataset.status;
            setTrainer(id, name, status);
        });
    });

    chatSend.addEventListener('click', handleSend);
    chatInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSend();
        }
    });

    const firstTrainer = document.querySelector('.trainer-item');
    if (firstTrainer) {
        setTrainer(firstTrainer.dataset.trainer, firstTrainer.dataset.name, firstTrainer.dataset.status);
    }
}

// ==================== MODAL CLOSE ON BACKGROUND CLICK ====================

window.onclick = function(event) {
    const authModal = document.getElementById('authModal');

    if (authModal && event.target === authModal) {
        closeAuthModal();
    }
};

// ==================== COUNTRY PHONE CODES ====================

const countryPhoneCodes = {
    'US': '+1',
    'CA': '+1',
    'UK': '+44',
    'AU': '+61',
    'DE': '+49',
    'FR': '+33',
    'IN': '+91',
    'BR': '+55',
    'JO': '+962'
};

function setupCountryPhoneCode() {
    const countrySelect = document.getElementById('country');
    const phoneInput = document.getElementById('phone');

    if (!countrySelect || !phoneInput) {
        return;
    }

    countrySelect.addEventListener('change', function() {
        const selectedCountry = this.value;
        const phoneCode = countryPhoneCodes[selectedCountry];

        if (phoneCode) {
            phoneInput.placeholder = `${phoneCode} (xxx) xxx-xxxx`;
            phoneInput.value = phoneCode + ' ';
        } else {
            phoneInput.placeholder = '+1 (555) 123-4567';
            phoneInput.value = '';
        }
    });
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', function() {
    initializeStorage();
    updateNavBar();
    setActiveNav();
    setupNavToggle();

    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    loadProfile();
    setupTrainerChat();
    setupReveals();
    setupCommChat();
    setupProgramModal();
    setupCountryPhoneCode();
});

// ==================== REVEAL ANIMATIONS ====================

function setupReveals() {
    const targets = [
        '.hero-content',
        '.page-hero .container',
        '.section-title',
        '.card',
        '.program-card',
        '.trainer-card',
        '.membership-card',
        '.nutrition-card',
        '.profile-card',
        '.profile-sidebar'
    ];

    const elements = document.querySelectorAll(targets.join(','));
    if (!elements.length) {
        return;
    }

    elements.forEach((el, index) => {
        el.classList.add('reveal');
    });

    if (!('IntersectionObserver' in window)) {
        elements.forEach(el => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    elements.forEach(el => observer.observe(el));
}

// ==================== COMMUNICATION CHAT ====================

const commReplies = {
    alex: [
        'Let us focus on strength today. Add 2 sets to your main lift.',
        'Keep your rest time tight to maximize intensity.',
        'Great progress. Increase weight by 2.5% next week.'
    ],
    sarah: [
        'Add a 10-minute cooldown jog after HIIT.',
        'Stay hydrated before intervals to keep performance steady.',
        'Nice work. Shorten rest by 15 seconds next session.'
    ],
    michael: [
        'Focus on breath and slow transitions.',
        'Add a 5-minute mobility flow before bed.',
        'Keep your shoulders relaxed in the next session.'
    ],
    emily: [
        'Aim for 30g of protein per meal.',
        'Add more greens to balance your macros.',
        'Hydration will improve recovery and energy.'
    ],
    david: [
        'Keep your guard high and lead with the jab.',
        'Footwork drills will sharpen timing.',
        'Relax your shoulders during combinations.'
    ],
    jessica: [
        'Focus on long strokes and steady breathing.',
        'Add a fin set for leg endurance.',
        'Keep your core engaged through each lap.'
    ]
};

const commThreads = {};

function setupCommChat() {
    const coachButtons = document.querySelectorAll('.coach-item');
    const coachName = document.getElementById('commCoachName');
    const coachRole = document.getElementById('commCoachRole');
    const messages = document.getElementById('commMessages');
    const input = document.getElementById('commInput');
    const sendBtn = document.getElementById('commSend');

    if (!coachButtons.length || !coachName || !messages || !input || !sendBtn) {
        return;
    }

    function renderThread(coachId) {
        messages.innerHTML = '';
        const thread = commThreads[coachId] || [];
        thread.forEach(entry => {
            const bubble = document.createElement('div');
            bubble.className = `comm-bubble ${entry.sender}`;
            bubble.innerHTML = `<p><strong>${entry.name}</strong> · ${entry.time}</p><p>${entry.text}</p>`;
            messages.appendChild(bubble);
        });
        messages.scrollTop = messages.scrollHeight;
    }

    function setCoach(button) {
        coachButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const coachId = button.dataset.coach;
        const name = button.dataset.name;
        const role = button.dataset.role;
        coachName.textContent = name;
        coachRole.textContent = role;

        if (!commThreads[coachId]) {
            const hello = `Hi, I'm ${name}. How can I help today?`;
            commThreads[coachId] = [
                { sender: 'coach', name, time: 'Now', text: hello }
            ];
        }
        renderThread(coachId);
    }

    function sendMessage() {
        const text = input.value.trim();
        if (!text) {
            return;
        }
        const activeButton = document.querySelector('.coach-item.active');
        if (!activeButton) {
            return;
        }
        const coachId = activeButton.dataset.coach;
        const name = activeButton.dataset.name;
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        commThreads[coachId] = commThreads[coachId] || [];
        commThreads[coachId].push({ sender: 'user', name: 'You', time: now, text });
        renderThread(coachId);
        input.value = '';

        const replyOptions = commReplies[coachId] || ['Got it! I will get back to you soon.'];
        const reply = replyOptions[Math.floor(Math.random() * replyOptions.length)];

        setTimeout(() => {
            commThreads[coachId].push({ sender: 'coach', name, time: 'Now', text: reply });
            renderThread(coachId);
        }, 650);
    }

    coachButtons.forEach(btn => {
        btn.addEventListener('click', () => setCoach(btn));
    });

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });

    // Check if a coach was selected from the trainers page
    const selectedCoachId = sessionStorage.getItem('selectedCoach');
    if (selectedCoachId) {
        const selectedButton = document.querySelector(`.coach-item[data-coach="${selectedCoachId}"]`);
        if (selectedButton) {
            setCoach(selectedButton);
            sessionStorage.removeItem('selectedCoach');
        } else {
            setCoach(coachButtons[0]);
        }
    } else {
        setCoach(coachButtons[0]);
    }
}

// ==================== PROGRAM MODAL ====================

function setupProgramModal() {
    const modal = document.getElementById('programModal');
    const modalTitle = document.getElementById('programModalTitle');
    const modalText = document.getElementById('programModalText');
    const modalClose = document.getElementById('programModalClose');
    const modalCta = document.getElementById('programModalCta');
    const buttons = document.querySelectorAll('.learn-more-btn');

    if (!modal || !modalTitle || !modalText || !buttons.length) {
        return;
    }

    function openModal(title, text) {
        modalTitle.textContent = title;
        modalText.textContent = text;
        modal.classList.add('show');
    }

    function closeModal() {
        modal.classList.remove('show');
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.dataset.program || 'Program Details';
            const text = btn.dataset.details || 'More details coming soon.';
            openModal(title, text);
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalCta) {
        modalCta.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', event => {
        if (event.target === modal) {
            closeModal();
        }
    });
}
