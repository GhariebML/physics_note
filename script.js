document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.getAttribute('data-target')).classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Theme Toggle
    const themeBtn = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeBtn.innerHTML = savedTheme === 'dark' ? '☀️ وضع النهار' : '🌙 الوضع الليلي';
    }
    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeBtn.innerHTML = newTheme === 'dark' ? '☀️ وضع النهار' : '🌙 الوضع الليلي';
    });

    // Print functionality
    document.getElementById('printBtn').addEventListener('click', () => window.print());

    // Interactive MCQ Quiz Logic
    const units = ['unit3', 'unit4', 'unit5', 'unit6'];
    units.forEach(unit => {
        const pane = document.getElementById(unit);
        if (!pane) return;
        
        let score = 0;
        const scoreDisplay = pane.querySelector('.score-val');
        const questions = pane.querySelectorAll('.mcq-question');
        
        questions.forEach(q => {
            const options = q.querySelectorAll('.option-btn');
            options.forEach(opt => {
                opt.addEventListener('click', function() {
                    // Disable all options in this question
                    options.forEach(o => o.disabled = true);
                    
                    if (this.getAttribute('data-correct') === 'true') {
                        this.classList.add('correct');
                        score++;
                        if(scoreDisplay) scoreDisplay.textContent = score;
                    } else {
                        this.classList.add('incorrect');
                        // highlight the correct one
                        options.forEach(o => {
                            if (o.getAttribute('data-correct') === 'true') o.classList.add('correct');
                        });
                    }
                });
            });
        });
    });

    // Timer Logic
    let timerInterval;
    let seconds = 0;
    const timerDisplay = document.getElementById('timerDisplay');
    
    function updateTimer() {
        if(!timerDisplay) return;
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${m}:${s}`;
    }
    
    const startTimerBtn = document.getElementById('startTimer');
    if(startTimerBtn) {
        startTimerBtn.addEventListener('click', () => {
            if (!timerInterval) {
                timerInterval = setInterval(() => { seconds++; updateTimer(); }, 1000);
            }
        });
    }
    
    const pauseTimerBtn = document.getElementById('pauseTimer');
    if(pauseTimerBtn) {
        pauseTimerBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            timerInterval = null;
        });
    }
    
    const resetTimerBtn = document.getElementById('resetTimer');
    if(resetTimerBtn) {
        resetTimerBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            timerInterval = null;
            seconds = 0;
            updateTimer();
        });
    }
});

// --- Dynamic Event Delegation for V4 ---
document.addEventListener('click', function(e) {
    // Flashcard Flip (Mobile Support)
    let flashcard = e.target.closest('.flashcard');
    if(flashcard) {
        const inner = flashcard.querySelector('.flashcard-inner');
        if (inner.style.transform === 'rotateY(180deg)') {
            inner.style.transform = 'rotateY(0deg)';
        } else {
            inner.style.transform = 'rotateY(180deg)';
        }
    }
});

// Global Timer Logic
let globalTimerInterval = null;
let globalSeconds = 0;

function updateTimers() {
    const m = Math.floor(globalSeconds / 60).toString().padStart(2, '0');
    const s = (globalSeconds % 60).toString().padStart(2, '0');
    document.querySelectorAll('.timer-display').forEach(el => {
        el.textContent = `${m}:${s}`;
    });
}

document.addEventListener('click', function(e) {
    if(e.target.classList.contains('start-btn')) {
        if (!globalTimerInterval) {
            globalTimerInterval = setInterval(() => { globalSeconds++; updateTimers(); }, 1000);
        }
    } else if (e.target.classList.contains('pause-btn')) {
        clearInterval(globalTimerInterval);
        globalTimerInterval = null;
    } else if (e.target.classList.contains('reset-btn')) {
        clearInterval(globalTimerInterval);
        globalTimerInterval = null;
        globalSeconds = 0;
        updateTimers();
    }
});

// --- Professional UI/UX Enhancements ---

document.addEventListener('DOMContentLoaded', function() {
    // 1. Scroll Progress Bar
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = progress + '%';
        });
    }

    // 2. Initialize Ripple Effect for Buttons
    const buttons = document.querySelectorAll('button, .tab-btn, .show-ans-btn');
    buttons.forEach(btn => {
        btn.classList.add('ripple-btn');
        btn.addEventListener('click', createRipple);
    });

    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.querySelector('.ripple');
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
        
        // Remove ripple after animation completes
        setTimeout(() => {
            circle.remove();
        }, 600);
    }

    // 3. Scroll Reveal Animation using IntersectionObserver
    // Add .reveal class dynamically to important elements
    const elementsToReveal = document.querySelectorAll('.card, .example-card, .mcq-question, .law-box, .exercise-box');
    elementsToReveal.forEach((el, index) => {
        el.classList.add('reveal');
        // Add staggered transition delay based on index slightly
        el.style.transitionDelay = `${(index % 3) * 0.1}s`; 
    });

    const revealOptions = {
        threshold: 0.05, 
        rootMargin: "0px 0px -20px 0px"
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, revealOptions);

    elementsToReveal.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 4. Smart Search ---
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const text = e.target.value.toLowerCase();
            const searchableItems = document.querySelectorAll('.card, .example-card, .law-box, .mcq-question, .exercise-box');
            
            searchableItems.forEach(item => {
                if (item.textContent.toLowerCase().includes(text)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // --- 5. Progress Tracking ---
    const unitsList = ['unit3', 'unit4', 'unit5', 'unit6'];
    unitsList.forEach(unitId => {
        if (localStorage.getItem(unitId + '_done') === 'true') {
            const tabBtn = document.querySelector(`.tab-btn[data-target="${unitId}"]`);
            if (tabBtn) tabBtn.classList.add('completed');
            
            // Mark button in the unit as done
            const doneBtn = document.querySelector(`.mark-done-btn[data-unit="${unitId}"]`);
            if (doneBtn) {
                doneBtn.classList.add('done');
                doneBtn.textContent = 'تمت المذاكرة ومراجعة الوحدة بنجاح 🏆';
            }
        }
    });

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('mark-done-btn')) {
            const unitId = e.target.getAttribute('data-unit');
            const isDone = localStorage.getItem(unitId + '_done') === 'true';
            
            if (!isDone) {
                localStorage.setItem(unitId + '_done', 'true');
                e.target.classList.add('done');
                e.target.textContent = 'تمت المذاكرة ومراجعة الوحدة بنجاح 🏆';
                const tabBtn = document.querySelector(`.tab-btn[data-target="${unitId}"]`);
                if (tabBtn) tabBtn.classList.add('completed');
            } else {
                localStorage.removeItem(unitId + '_done');
                e.target.classList.remove('done');
                e.target.textContent = '✅ أتممت دراسة الوحدة';
                const tabBtn = document.querySelector(`.tab-btn[data-target="${unitId}"]`);
                if (tabBtn) tabBtn.classList.remove('completed');
            }
        }
        
        // --- 6. Mock Exam Logic ---
        if (e.target.id === 'submitMockExamBtn') {
            const mockExamContainer = document.getElementById('mockExamContainer');
            if (!mockExamContainer) return;
            
            const mcqs = mockExamContainer.querySelectorAll('.mcq-question');
            let correctAnswers = 0;
            let total = mcqs.length;
            
            mcqs.forEach(q => {
                const selected = q.querySelector('.option-btn.selected');
                if (selected && selected.getAttribute('data-correct') === 'true') {
                    correctAnswers++;
                    selected.classList.add('correct');
                } else if (selected) {
                    selected.classList.add('incorrect');
                }
                
                const options = q.querySelectorAll('.option-btn');
                options.forEach(opt => {
                    opt.disabled = true;
                    if (opt.getAttribute('data-correct') === 'true') {
                        opt.classList.add('correct');
                    }
                });
            });
            
            const resultDiv = document.getElementById('mockExamResult');
            resultDiv.style.display = 'block';
            if (correctAnswers === total) {
                resultDiv.innerHTML = `<span class="pass">ممتاز! نتيجتك ${correctAnswers}/${total} 🌟 لقد أتممت المنهج بنجاح.</span>`;
            } else if (correctAnswers >= total / 2) {
                resultDiv.innerHTML = `<span class="pass">جيد جداً! نتيجتك ${correctAnswers}/${total} 👍 واصل المراجعة.</span>`;
            } else {
                resultDiv.innerHTML = `<span class="fail">لدينا بعض الأخطاء. نتيجتك ${correctAnswers}/${total} 📚 يرجى مراجعة القوانين.</span>`;
            }
            e.target.style.display = 'none';
        }
    });

    // --- 7. Back to Top Button ---
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
