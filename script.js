document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    // Theme Toggle
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        updateThemeIcon(savedTheme);
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light-mode');
            updateThemeIcon('light-mode');
        } else {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
            updateThemeIcon('dark-mode');
        }
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        const profilePic = document.getElementById('hero-profile-img');

        if (theme === 'dark-mode') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            if (profilePic) profilePic.src = 'assets/images/dark-mode-profile-pic.jpg';
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            if (profilePic) profilePic.src = 'assets/images/light-mode-profile-pic.jpg';
        }
    }

    // Mobile Menu
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        body.classList.toggle('no-scroll');
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            body.classList.remove('no-scroll');
        });
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll Animations (smooth, with staggered reveal)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(`
        .section-headings,
        .hero-text,
        .hero-image-container,
        .project-card,
        .about-content,
        .contact-form,
        .tech-item
    `);

    animatedElements.forEach((el, index) => {
        el.classList.add('hidden-animate');
        // Faster, capped stagger to reduce perceived delay
        const delay = Math.min(index * 0.04, 0.25);
        el.style.transitionDelay = `${delay}s`;
        observer.observe(el);
    });

    // Modal Logic
    const modal = document.getElementById('project-modal');
    const closeModal = modal.querySelector('.close-modal');
    const projectCards = document.querySelectorAll('.project-card');
    const resumeModal = document.getElementById('resume-modal');
    const resumeTrigger = document.getElementById('resume-trigger');
    const resumeCloseModal = document.querySelector('.resume-close-modal');

    function showModal(modalElement) {
        if (!modalElement) {
            return;
        }

        modalElement.style.display = 'flex';
        setTimeout(() => {
            modalElement.classList.add('show');
        }, 10);
    }

    function hideModal(modalElement) {
        if (!modalElement) {
            return;
        }

        modalElement.classList.remove('show');
        setTimeout(() => {
            modalElement.style.display = 'none';

            if (modalElement === modal) {
                document.getElementById('modal-tiktok-container').innerHTML = '';
            }
        }, 300);
    }

    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevent modal opening if clicking on specific buttons
            if (e.target.closest('.github-btn') || e.target.closest('.tiktok-btn')) {
                return;
            }

            const img = card.querySelector('img').src;
            const title = card.querySelector('h3').innerText;
            const role = card.querySelector('.project-role').innerText;
            const date = card.querySelector('.project-date').innerText;
            const desc = card.querySelector('p').innerText;

            // Get links
            const githubLink = card.querySelector('.github-btn') ? card.querySelector('.github-btn').href : '#';
            const tiktokId = card.getAttribute('data-tiktok-id');

            // Populate Modal
            document.getElementById('modal-image').src = img;
            document.getElementById('modal-title').innerText = title;
            document.getElementById('modal-role').innerText = role;
            document.getElementById('modal-date').innerText = date;
            document.getElementById('modal-description').innerText = desc;
            document.getElementById('modal-github').href = githubLink;

            // Handle TikTok Embed in Modal
            const tiktokContainer = document.getElementById('modal-tiktok-container');
            tiktokContainer.innerHTML = ''; // Clear previous video

            if (tiktokId) {
                const blockquote = document.createElement('blockquote');
                blockquote.className = 'tiktok-embed';
                blockquote.setAttribute('cite', `https://www.tiktok.com/@kevscode.tech/video/${tiktokId}`);
                blockquote.setAttribute('data-video-id', tiktokId);
                blockquote.style.maxWidth = '605px';
                blockquote.style.minWidth = '325px';

                blockquote.innerHTML = `<section> <a target="_blank" title="@kevscode.tech" href="https://www.tiktok.com/@kevscode.tech?refer=embed">@kevscode.tech</a> </section>`;

                tiktokContainer.appendChild(blockquote);

                // Re-load TikTok script to render the new embed
                const script = document.createElement('script');
                script.src = 'https://www.tiktok.com/embed.js';
                script.async = true;
                tiktokContainer.appendChild(script);
            }

            // Show Modal
            showModal(modal);
        });
    });

    closeModal.addEventListener('click', () => {
        hideModal(modal);
    });

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            hideModal(modal);
        }

        if (e.target == resumeModal) {
            hideModal(resumeModal);
        }
    });

    if (resumeTrigger) {
        resumeTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            showModal(resumeModal);
        });
    }

    if (resumeCloseModal) {
        resumeCloseModal.addEventListener('click', () => {
            hideModal(resumeModal);
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (resumeModal && resumeModal.classList.contains('show')) {
                hideModal(resumeModal);
            }

            if (modal.classList.contains('show')) {
                hideModal(modal);
            }
        }
    });

    // Tab Switching Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show corresponding content
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Contact Form Handler
    // Contact Form Handler - Handled by Formspree in HTML
    // const contactForm = document.querySelector('.contact-form');
    // if (contactForm) {
    //     ...
    // }

    // Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with slight delay
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 150, fill: "forwards" });
        });

        // Add hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .tech-item, input, textarea, .logo');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering');
            });
        });
    }

    // Parallax Effect for Hero Section
    const heroSection = document.querySelector('.dev-hero');
    const blob = document.querySelector('.profile-blob');
    const floatingCards = document.querySelectorAll('.floating-card');

    if (heroSection && blob) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;

            // Move Blob
            blob.style.transform = `translate(${x * 2}px, ${y * 2}px)`;

            // Move Cards with different speeds for depth
            floatingCards.forEach((card, index) => {
                const speed = (index + 1) * 2;
                card.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    }

    // Hide Sidebar on Home Section
    const sidebar = document.querySelector('.social-sidebar');
    if (heroSection && sidebar) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    sidebar.classList.add('hidden');
                } else {
                    sidebar.classList.remove('hidden');
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% of hero is visible

        observer.observe(heroSection);
    }
});
