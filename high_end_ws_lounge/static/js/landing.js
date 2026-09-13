document.addEventListener('DOMContentLoaded', function () {
    // -------------------------------------------------------------------------
    // Element Selectors
    // -------------------------------------------------------------------------
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginNavBtn = document.getElementById('loginNavBtn');
    const registerNavBtn = document.getElementById('registerNavBtn');
    const bookNowBtn = document.getElementById('bookNowBtn');
    const closeLogin = document.getElementById('closeLogin');
    const closeRegister = document.getElementById('closeRegister');
    const toRegisterBtn = document.getElementById('toRegister');
    const toLoginBtn = document.getElementById('toLogin');
    
    // Mobile Drawer Navigation Selectors
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navContainer = document.querySelector('.nav-container');

    // -------------------------------------------------------------------------
    // Mobile Navigation Drawer Functionality
    // -------------------------------------------------------------------------
    if (mobileToggle && navContainer) {
        mobileToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            navContainer.classList.toggle('active');
            
            // Switch toggle icon between bars and times (close)
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                if (navContainer.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close mobile drawer when clicking any link inside it
        navContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navContainer.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!navContainer.contains(e.target) && !mobileToggle.contains(e.target)) {
                navContainer.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // -------------------------------------------------------------------------
    // Modal Management Utilities Testing
    // -------------------------------------------------------------------------
    function showModal(modal) {
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Auto-focus first input element for better UX
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }
    }

    function hideModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    function clearFlashAlerts() {
        document.querySelectorAll(".modal-flash, .alert-wrapper").forEach(el => {
            el.style.display = "none";
        });
    }

    // Modal Trigger Listeners
    if (loginNavBtn) {
        loginNavBtn.addEventListener('click', function (e) {
            e.preventDefault();
            showModal(loginModal);
        });
    }

    if (registerNavBtn) {
        registerNavBtn.addEventListener('click', function (e) {
            e.preventDefault();
            showModal(registerModal);
        });
    }

    if (bookNowBtn) {
        bookNowBtn.addEventListener('click', function (e) {
            e.preventDefault();
            showModal(registerModal);
        });
    }

    document.querySelectorAll('.btn-apply').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            showModal(registerModal);
        });
    });

    if (closeLogin) {
        closeLogin.addEventListener('click', () => hideModal(loginModal));
    }

    if (closeRegister) {
        closeRegister.addEventListener('click', () => hideModal(registerModal));
    }

    // Modal Switchers
    if (toRegisterBtn) {
        toRegisterBtn.addEventListener('click', function (e) {
            e.preventDefault();
            clearFlashAlerts();
            hideModal(loginModal);
            showModal(registerModal);
        });
    }

    if (toLoginBtn) {
        toLoginBtn.addEventListener('click', function (e) {
            e.preventDefault();
            clearFlashAlerts();
            hideModal(registerModal);
            showModal(loginModal);
        });
    }

    // Close modals on outside click
    window.addEventListener('click', function (e) {
        if (e.target === loginModal) hideModal(loginModal);
        if (e.target === registerModal) hideModal(registerModal);
    });

    // Close modals on Escape key
    window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            hideModal(loginModal);
            hideModal(registerModal);
        }
    });

    // Handle initial state from backend datasets
    const showRegister = document.body.dataset.showRegister === 'true';
    const showLogin = document.body.dataset.showLogin === 'true';

    if (showRegister) showModal(registerModal);
    if (showLogin) showModal(loginModal);

    // -------------------------------------------------------------------------
    // Smooth Scroll for Anchor Links
    // -------------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // -------------------------------------------------------------------------
    // Live Password Strength & Match Validation
    // -------------------------------------------------------------------------
    document.addEventListener("input", function (e) {
        const regModal = e.target.closest("#registerModal");
        if (!regModal) return;

        const passInputs = regModal.querySelectorAll("input[type='password'], input[data-pass='true']");
        if (passInputs.length < 2) return;

        const regPass = passInputs[0];
        const regConfirm = passInputs[1];

        const regBar = document.getElementById("reg-strength-bar");
        const regText = document.getElementById("reg-strength-text");
        const regMatch = document.getElementById("reg-match-text");

        // Strength Meter Logic
        if ((e.target === regPass || e.target === regConfirm) && regBar && regText) {
            const val = regPass.value;
            let score = 0;

            if (!val) {
                regBar.style.width = "0%";
                regText.textContent = "";
            } else {
                const hasLetters = /[a-zA-Z]/.test(val);
                const hasNumbers = /[0-9]/.test(val);
                const isLong = val.length >= 8;

                if (isLong) score += 33;
                if (hasLetters) score += 33;
                if (hasNumbers) score += 34;

                regBar.style.width = score + "%";

                if (!hasLetters || !hasNumbers || !isLong) {
                    regBar.style.backgroundColor = "#ef4444";
                    regText.style.color = "#ef4444";
                    regText.textContent = "Must be 8+ characters with letters & numbers";
                } else if (val.length < 10) {
                    regBar.style.backgroundColor = "#f59e0b";
                    regText.style.color = "#d97706";
                    regText.textContent = "Good Alphanumeric Password";
                } else {
                    regBar.style.backgroundColor = "#10b981";
                    regText.style.color = "#10b981";
                    regText.textContent = "Strong Password!";
                }
            }
        }

        // Live Match Checker Logic
        if (regMatch) {
            const pVal = regPass.value;
            const cVal = regConfirm.value;

            if (!cVal) {
                regMatch.textContent = "";
                return;
            }

            if (pVal === cVal) {
                regMatch.style.color = "#10b981";
                regMatch.innerHTML = '<i class="fa-solid fa-circle-check me-1"></i> Passwords match!';
                return;
            }

            if (cVal.length < pVal.length) {
                regMatch.textContent = "";
                return;
            }

            regMatch.style.color = "#ef4444";
            regMatch.innerHTML = '<i class="fa-solid fa-circle-xmark me-1"></i> Passwords do not match';
        }
    });

    // -------------------------------------------------------------------------
    // Password Visibility Toggle (Show / Hide Eye)
    // -------------------------------------------------------------------------
    document.querySelectorAll('.toggle-password-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const container = this.closest('.password-wrapper') || this.parentElement;
            const input = container.querySelector('input');
            const icon = this.querySelector('i') || this;

            if (input) {
                const isPassword = input.getAttribute('type') === 'password';
                input.setAttribute('type', isPassword ? 'text' : 'password');

                if (icon) {
                    if (isPassword) {
                        icon.classList.remove('fa-eye');
                        icon.classList.add('fa-eye-slash');
                    } else {
                        icon.classList.remove('fa-eye-slash');
                        icon.classList.add('fa-eye');
                    }
                }
            }
        });
    });

    // -------------------------------------------------------------------------
    // Auto-Dismiss Flash Messages
    // -------------------------------------------------------------------------
    function autoDismissAlerts() {
        const alerts = document.querySelectorAll(".alert, .flash-message, [role='alert'], .modal-flash");

        alerts.forEach(function (alert) {
            if (alert.dataset.dismissing === "true") return;
            alert.dataset.dismissing = "true";

            setTimeout(function () {
                alert.style.transition = "opacity 0.5s ease, transform 0.5s ease";
                alert.style.opacity = "0";
                alert.style.transform = "translateY(-8px)";

                setTimeout(function () {
                    alert.remove();
                }, 500);
            }, 3500);
        });
    }

    autoDismissAlerts();

    // Observe DOM for dynamic flash alert injections
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length) {
                autoDismissAlerts();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
});