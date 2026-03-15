// 3D Background Initialization (Vanta.js)
const init3DBackground = () => {
    if (typeof VANTA !== 'undefined') {
        VANTA.NET({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: true,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xd4af37, // Gold
            backgroundColor: 0x050505, // Pure Black
            points: 12.00,
            maxDistance: 22.00,
            spacing: 16.00,
            showDots: true
        });
    }
};

// Language Toggle Logic
const langToggle = document.getElementById('lang-toggle');
let currentLang = 'en';

if (langToggle) {
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ar' : 'en';
        document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', currentLang);
        langToggle.innerText = currentLang === 'en' ? 'AR' : 'EN';
        
        // Update all elements with translations
        document.querySelectorAll('[data-en]').forEach(el => {
            el.innerText = el.getAttribute(`data-${currentLang}`);
        });

        // Update form placeholders
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        if (currentLang === 'ar') {
            if(nameInput) nameInput.placeholder = 'اسمك';
            if(emailInput) emailInput.placeholder = 'بريدك الإلكتروني';
            if(messageInput) messageInput.placeholder = 'رسالتك';
        } else {
            if(nameInput) nameInput.placeholder = 'Your Name';
            if(emailInput) emailInput.placeholder = 'Your Email';
            if(messageInput) messageInput.placeholder = 'Your Message';
        }
    });
}

// Navbar Toggle (Mobile Menu)
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    // Toggle Nav
    nav.classList.toggle('nav-active');

    // Animate Links
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });

    // Burger Animation
    burger.classList.toggle('toggle');
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70, // Adjust for sticky header
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if(nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                navLinks.forEach(link => link.style.animation = '');
            }
        }
    });
});

// Realtime Updates Implementation
const setupRealtime = () => {
    const supabase = window.supabaseClient;
    if (!supabase) return;

    // Subscribe to inserts in 'contact_messages' table
    const channel = supabase
        .channel('schema-db-changes')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'contact_messages',
            },
            (payload) => {
                console.log('New message received!', payload.new);
                // You can add logic here to update the UI in real-time
            }
        )
        .subscribe();
};

// Initialize everything
if (document.readyState === 'complete') {
    setupRealtime();
    init3DBackground();
} else {
    window.addEventListener('load', () => {
        setupRealtime();
        init3DBackground();
    });
}

// Form Submission with Supabase
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Use the global supabase client from supabaseClient.js
        const supabase = window.supabaseClient;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        const submitBtn = contactForm.querySelector('button');
        const originalBtnText = submitBtn.innerText;
        
        // Disable button during submission
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        try {
            const { data, error } = await supabase
                .from('contact_messages')
                .insert([
                    { name: name, email: email, message: message }
                ]);

            if (error) throw error;

            alert(`Thank you, ${name}! Your message has been sent successfully.`);
            contactForm.reset();
        } catch (error) {
            console.error('Error:', error.message);
            alert('Oops! There was a problem sending your message: ' + error.message);
        } finally {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// Optional: Dynamic Year in Footer
document.querySelector('footer p').innerHTML = `&copy; ${new Date().getFullYear()} Media Buyer Portfolio. All rights reserved.`;
