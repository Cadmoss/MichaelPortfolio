// Navigation functionality
document.addEventListener("DOMContentLoaded", function () {
  // Mobile navigation toggle
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

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
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 100) {
      navbar.style.background =
        "linear-gradient(135deg, rgba(43, 20, 115, 0.98), rgba(109, 68, 166, 0.98))";
      navbar.style.boxShadow = "0 4px 25px rgba(43, 20, 115, 0.4)";
    } else {
      navbar.style.background =
        "linear-gradient(135deg, rgba(43, 20, 115, 0.95), rgba(109, 68, 166, 0.95))";
      navbar.style.boxShadow = "0 4px 20px rgba(43, 20, 115, 0.2)";
    }
  });

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
  document
    .querySelectorAll(".project-card, .timeline-item, .stat-item")
    .forEach((el) => {
      observer.observe(el);
    });
});

// Carousel functionality
let currentSlides = {
  carousel1: 0,
  carousel2: 0,
};

function updateCarousel(carouselId) {
  const carousel = document.getElementById(carouselId);
  const track = carousel.querySelector(".carousel-track");
  const slides = carousel.querySelectorAll(".carousel-slide");
  const slideWidth = 100;

  track.style.transform = `translateX(-${
    currentSlides[carouselId] * slideWidth
  }%)`;
}

function nextSlide(carouselId) {
  const carousel = document.getElementById(carouselId);
  const slides = carousel.querySelectorAll(".carousel-slide");
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
  const slides = carousel.querySelectorAll(".carousel-slide");
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

// Start auto-play after page load
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(autoPlayCarousels, 2000);
});

// Chatbot functionality
function toggleChatbot() {
  const chatbot = document.getElementById("chatbot");
  chatbot.classList.toggle("active");
}

// Close chatbot when clicking outside
document.addEventListener("click", function (event) {
  const chatbot = document.getElementById("chatbot");
  const chatbotToggle = document.querySelector(".chatbot-toggle");
  const chatbotContainer = document.querySelector(".chatbot-container");

  if (!chatbotContainer.contains(event.target)) {
    chatbot.classList.remove("active");
  }
});

// Handle chatbot form submission
const form = document.querySelector(".chatbot-form");
if (!form) {
  console.error("Form with class 'chatbot-form' not found");
} else {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form elements
    const submitBtn = form.querySelector(".chatbot-submit");
    const messageInput = form.querySelector('input[name="message"], textarea[name="message"]');
    const emailInput = form.querySelector('input[name="email"]');
    const chatMessages = document.querySelector("#chat-messages");
    const originalText = submitBtn ? submitBtn.textContent : "Send Message";

    // Validate elements
    if (!submitBtn || !messageInput || !chatMessages) {
      console.error("Required elements not found:", {
        submitBtn: !!submitBtn,
        messageInput: !!messageInput,
        chatMessages: !!chatMessages,
      });
      return;
    }

    // Validate input
    if (!messageInput.value.trim()) {
      console.error("Message input is empty");
      submitBtn.textContent = "Please enter a message";
      submitBtn.style.background = "#dc2626";
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = "#2563EB";
      }, 2000);
      return;
    }

    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;

    // Get form data
    const formData = new FormData(form);
    const email = emailInput ? emailInput.value : "";

    // Submit to Formspree
    fetch("https://formspree.io/f/xqalpgrk", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          // Success
          submitBtn.textContent = "Message Sent!";
          submitBtn.style.background = "#10b981";
          form.reset();

          // Add success message
          const botMsg = document.createElement("div");
          botMsg.classList.add("bot-message");
          botMsg.textContent = email
            ? `Thanks for your message! I'll follow up with you at ${email} soon.`
            : "Thanks for your message! I'll get back to you soon.";
          chatMessages.appendChild(botMsg);
          chatMessages.scrollTop = chatMessages.scrollHeight;

          // Reset button after 2 seconds
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = "#2563EB";
            submitBtn.disabled = false;
          }, 2000);
        } else {
          return response.json().then((data) => {
            throw new Error(data.error || "Formspree response was not ok");
          });
        }
      })
      .catch((error) => {
        console.error("Form submission error:", error);
        submitBtn.textContent = "Error - Try Again";
        submitBtn.style.background = "#dc2626";

        // Add error message to chat
        const botMsg = document.createElement("div");
        botMsg.classList.add("bot-message", "error");
        botMsg.textContent = "Failed to send message. Please try again.";
        chatMessages.appendChild(botMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Reset button after 3 seconds
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = "#2563EB";
          submitBtn.disabled = false;
        }, 3000);
      });
  });
}
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
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-8px) scale(1.02)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});

// Parallax effect for hero section
window.addEventListener("scroll", function () {
  const scrolled = window.pageYOffset;
  const heroVisual = document.querySelector(".hero-visual");
  const rate = scrolled * 0.5;

  if (heroVisual) {
    heroVisual.style.transform = `translateY(${rate}px)`;
  }
});

// Form validation
document.querySelectorAll("form").forEach((form) => {
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

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove("lazy");
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll("img[data-src]").forEach((img) => {
  imageObserver.observe(img);
});
