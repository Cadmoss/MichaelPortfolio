// Navigation functionality
document.addEventListener("DOMContentLoaded", function () {
    // Mobile navigation toggle
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", function () {
            navMenu.classList.toggle("active");
            hamburger.classList.toggle("active");
        });

        // Close mobile menu when clicking on links
        document.querySelectorAll(".nav-link").forEach((link) => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                hamburger.classList.remove("active");
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 100) {
                navbar.style.background = "linear-gradient(135deg, rgba(43, 20, 115, 0.98), rgba(109, 68, 166, 0.98))";
                navbar.style.boxShadow = "0 4px 25px rgba(43, 20, 115, 0.4)";
            } else {
                navbar.style.background = "linear-gradient(135deg, rgba(43, 20, 115, 0.95), rgba(109, 68, 166, 0.95))";
                navbar.style.boxShadow = "0 4px 20px rgba(43, 20, 115, 0.2)";
            }
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in");
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll(".project-card, .timeline-item, .stat-item").forEach((el) => {
        observer.observe(el);
    });

    // Start auto-play after page load
    setTimeout(autoPlayCarousels, 2000);
});

// Carousel functionality
let currentSlides = {
    carousel1: 0,
    carousel2: 0,
};

function updateCarousel(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const track = carousel.querySelector(".carousel-track");
    const slides = carousel.querySelectorAll(".carousel-slide");
    
    if (!track || !slides.length) return;
    
    const slideWidth = 100;
    track.style.transform = `translateX(-${currentSlides[carouselId] * slideWidth}%)`;
}

function nextSlide(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll(".carousel-slide");
    if (!slides.length) return;
    
    const maxSlide = slides.length - 1;

    if (currentSlides[carouselId] >= maxSlide) {
        currentSlides[carouselId] = 0;
    } else {
        currentSlides[carouselId]++;
    }

    updateCarousel(carouselId);
}

function previousSlide(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll(".carousel-slide");
    if (!slides.length) return;
    
    const maxSlide = slides.length - 1;

    if (currentSlides[carouselId] <= 0) {
        currentSlides[carouselId] = maxSlide;
    } else {
        currentSlides[carouselId]--;
    }

    updateCarousel(carouselId);
}

// Auto-play carousel
function autoPlayCarousels() {
    setInterval(() => {
        Object.keys(currentSlides).forEach((carouselId) => {
            nextSlide(carouselId);
        });
    }, 5000);
}

// Toggle chatbot open/close
function toggleChatbot() {
    const chatbot = document.getElementById("chatbot");
    if (chatbot) {
        chatbot.classList.toggle("active");
    }
}

// Close chatbot when clicking outside
document.addEventListener("click", function (event) {
    const chatbot = document.getElementById("chatbot");
    const chatbotContainer = document.querySelector(".chatbot-container");

    if (chatbot && chatbotContainer && !chatbotContainer.contains(event.target)) {
        chatbot.classList.remove("active");
    }
});

// Handle chatbot form submission
document.addEventListener("DOMContentLoaded", function() {
    const chatbotForm = document.querySelector(".chatbot-form");

    if (chatbotForm) {
        chatbotForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector(".chatbot-submit");
            const messageInput = this.querySelector('textarea[name="message"]');
            const emailInput = this.querySelector('input[name="email"]');
            const chatMessages = document.querySelector("#chat-messages");
            const originalText = submitBtn.textContent;

            if (!messageInput.value.trim()) {
                submitBtn.textContent = "Please enter a message";
                submitBtn.style.background = "#dc2626";
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = "#2563eb";
                }, 2000);
                return;
            }

            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;

            const formData = new FormData(this);
            const email = emailInput.value;

            fetch("https://formspree.io/f/xqalpgrk", {
                method: "POST",
                body: formData,
                headers: { Accept: "application/json" },
            })
            .then(async (response) => {
                const data = await response.json().catch(() => ({}));

                if (response.ok) {
                    submitBtn.textContent = "Message Sent!";
                    submitBtn.style.background = "#10b981";
                    chatbotForm.reset();

                    if (chatMessages) {
                        const botMsg = document.createElement("div");
                        botMsg.classList.add("bot-message");
                        botMsg.innerHTML = `<p>${email ? 
                            `Thanks for your message! I'll follow up with you at ${email} soon.` : 
                            "Thanks for your message! I'll get back to you soon."}</p>`;
                        chatMessages.appendChild(botMsg);
                    }

                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = "linear-gradient(135deg, #2b1473, #6d44a6)";
                        submitBtn.disabled = false;
                        // Close chatbot after message is sent
                        toggleChatbot();
                    }, 2000);
                } else {
                    throw new Error(data.error || "Formspree error");
                }
            })
            .catch((error) => {
                console.error("Submission error:", error);
                submitBtn.textContent = "Error - Try Again";
                submitBtn.style.background = "#dc2626";

                if (chatMessages) {
                    const botMsg = document.createElement("div");
                    botMsg.classList.add("bot-message");
                    botMsg.innerHTML = "<p>Failed to send message. Please check your inputs and try again.</p>";
                    chatMessages.appendChild(botMsg);
                }

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = "linear-gradient(135deg, #2b1473, #6d44a6)";
                    submitBtn.disabled = false;
                }, 3000);
            });
        });
    }
});

// Keyboard navigation for carousels
document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
        Object.keys(currentSlides).forEach((carouselId) => {
            previousSlide(carouselId);
        });
    } else if (e.key === "ArrowRight") {
        Object.keys(currentSlides).forEach((carouselId) => {
            nextSlide(carouselId);
        });
    }
});

// Touch/swipe support for carousels
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", function (e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", function (e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            Object.keys(currentSlides).forEach((carouselId) => {
                nextSlide(carouselId);
            });
        } else {
            // Swipe right - previous slide
            Object.keys(currentSlides).forEach((carouselId) => {
                previousSlide(carouselId);
            });
        }
    }
}

// Project card hover effects
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".project-card").forEach((card) => {
        card.addEventListener("mouseenter", function () {
            this.style.transform = "translateY(-8px) scale(1.02)";
        });

        card.addEventListener("mouseleave", function () {
            this.style.transform = "translateY(0) scale(1)";
        });
    });
});

// Form validation
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll("form").forEach((form) => {
        // Skip validation for forms that handle their own submission
        if (form.classList.contains("chatbot-form") || form.classList.contains("contact-form")) {
            return;
        }
        
        form.addEventListener("submit", function (e) {
            const inputs = this.querySelectorAll("input[required], textarea[required]");
            let isValid = true;

            inputs.forEach((input) => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = "#dc2626";

                    setTimeout(() => {
                        input.style.borderColor = "#e5e7eb";
                    }, 3000);
                }
            });

            if (!isValid) {
                e.preventDefault();
            }
        });
    });
});

// Lazy loading for images
document.addEventListener("DOMContentLoaded", function() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove("lazy");
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
        imageObserver.observe(img);
    });
});

// Back to Top Button
document.addEventListener("DOMContentLoaded", function() {
  const backToTopButton = document.getElementById("backToTop");
  
  // Show/hide button based on scroll position
  window.addEventListener("scroll", function() {
    if (window.pageYOffset > 200) {
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  });
  
  // Smooth scroll to top when clicked
  backToTopButton.addEventListener("click", function() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});

// Hamburger menu animation
document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.querySelector(".hamburger");
    
    if (hamburger) {
        hamburger.addEventListener("click", function() {
            this.classList.toggle("active");
            
            const spans = this.querySelectorAll("span");
            if (this.classList.contains("active")) {
                spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
                spans[1].style.opacity = "0";
                spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
            } else {
                spans[0].style.transform = "none";
                spans[1].style.opacity = "1";
                spans[2].style.transform = "none";
            }
        });
    }
});

// Prevent form resubmission on page reload
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}
