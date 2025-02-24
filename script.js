// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Function to scroll to contact section
function scrollToContact() {
    document.querySelector('#contact').scrollIntoView({
        behavior: 'smooth'
    });
}

// Form submission handler
function handleSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value;
    
    // Basic form validation
    if (!name || !phone || !service) {
        alert('Please fill in all required fields');
        return false;
    }
    
    // Update to UAE phone format
const phoneRegex = /^(?:\+971|00971|0)?(?:50|51|52|55|56|2|3|4|6|7|9)\d{7}$/;
    if (!phoneRegex.test(phone)) {
        alert('Please enter a valid 10-digit phone number');
        return false;
    }
    
    // Here you would typically send the form data to a server
    // For now, we'll just show a success message
    alert('Thank you for your request! We will contact you shortly.');
    event.target.reset();
    return false;
}

// Review Modal Functions
function openReviewModal() {
    document.getElementById('reviewModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeReviewModal() {
    document.getElementById('reviewModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Handle star rating
const ratingStars = document.querySelectorAll('.rating-input i');
let selectedRating = 0;

ratingStars.forEach(star => {
    star.addEventListener('mouseover', function() {
        const rating = this.dataset.rating;
        updateStars(rating);
    });

    star.addEventListener('mouseout', function() {
        updateStars(selectedRating);
    });

    star.addEventListener('click', function() {
        selectedRating = this.dataset.rating;
        document.getElementById('reviewRating').value = selectedRating;
        updateStars(selectedRating);
    });
});

function updateStars(rating) {
    ratingStars.forEach(star => {
        const starRating = star.dataset.rating;
        if (starRating <= rating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
}

// Handle review form submission
function handleReviewSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('reviewName').value;
    const rating = document.getElementById('reviewRating').value;
    const reviewText = document.getElementById('reviewText').value;
    const serviceType = document.getElementById('serviceType') ? 
        document.getElementById('serviceType').value : 'General';

    if (!rating) {
        alert('Please select a rating');
        return false;
    }

    // Send review to backend
    fetch('save_review.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            name, 
            rating, 
            reviewText,
            serviceType 
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Review submitted successfully!');
            loadReviews();
            // Reset form
            document.getElementById('reviewName').value = '';
            document.getElementById('reviewRating').value = '';
            document.getElementById('reviewText').value = '';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to submit review');
    });
}

function loadReviews() {
    fetch('get_reviews.php')
    .then(response => response.json())
    .then(reviews => {
        const reviewSlider = document.querySelector('.review-slider');
        reviewSlider.innerHTML = ''; // Clear existing reviews
        
        reviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'swiper-slide';
            reviewCard.innerHTML = `
                <div class="review-card">
                    <div class="review-profile">
                        <img src="images/default-avatar.jpg" alt="${review.name}" class="review-avatar">
                        <div class="review-info">
                            <h4>${review.name}</h4>
                            <div class="stars">
                                ${Array(5).fill().map((_, i) => `
                                    <i class="fas fa-star${i >= review.rating ? ' inactive' : ''}"></i>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    <p class="review-text">${review.reviewText}</p>
                    <span class="review-service-type">${review.serviceType}</span>
                </div>
            `;
            reviewSlider.appendChild(reviewCard);
        });
    })
    .catch(error => {
        console.error('Error loading reviews:', error);
    });
}

// Call loadReviews when the page loads
document.addEventListener('DOMContentLoaded', loadReviews);

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('reviewModal');
    if (event.target === modal) {
        closeReviewModal();
    }
}

// Review form submission handler
function handleReviewSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('reviewName').value;
    const rating = document.querySelector('input[name="rating"]:checked')?.value;
    const service = document.getElementById('reviewService').value;
    const reviewText = document.getElementById('reviewText').value;
    
    // Basic form validation
    if (!name || !rating || !service || !reviewText) {
        alert('Please fill in all fields and select a rating');
        return false;
    }
    
    // Create new review card
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card';
    
    // Add review content
    reviewCard.innerHTML = `
        <div class="review-profile">
            <div class="review-avatar">
                <i class="fas fa-user-circle"></i>
            </div>
            <div class="review-info">
                <h3>${name}</h3>
                <div class="review-stars">
                    ${Array(5).fill('').map((_, index) => 
                        `<i class="fas fa-star${index >= rating ? '-o' : ''}"></i>`
                    ).join('')}
                </div>
            </div>
        </div>
        <p class="review-text">"${reviewText}"</p>
        <span class="review-date">Just now</span>
    `;
    
    // Add the new review to the container
    const reviewContainer = document.querySelector('.review-container');
    reviewContainer.insertBefore(reviewCard, reviewContainer.firstChild);
    
    // Reset form
    event.target.reset();
    
    // Show success message
    alert('Thank you for your review! Your feedback helps us improve our services.');
    
    return false;
}

// Initialize star rating hover effect
document.querySelectorAll('.star-rating label').forEach((star, index) => {
    star.addEventListener('mouseover', () => {
        document.querySelectorAll('.star-rating label').forEach((s, i) => {
            s.style.color = i <= index ? '#ffc107' : '#ddd';
        });
    });
    
    star.addEventListener('mouseout', () => {
        const rating = document.querySelector('input[name="rating"]:checked')?.value;
        document.querySelectorAll('.star-rating label').forEach((s, i) => {
            s.style.color = i < rating ? '#ffc107' : '#ddd';
        });
    });
});

// WhatsApp click-to-chat functionality
function openWhatsAppChat() {
    const phoneNumber = "+971524358561"; // Your WhatsApp number without '+' and spaces
    const message = "Hello! I would like to inquire about your Locksmith services."; // Default message
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
}

// Add shadow to header on scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    }
});

// Animate services cards on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease-out';
    observer.observe(card);
});

// Mobile Menu Toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuBtn.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        menuBtn.classList.remove('active');
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuBtn.classList.remove('active');
    });
});

// Resize handler to reset mobile menu state
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 767) {
            navLinks.classList.remove('active');
            menuBtn.classList.remove('active');
        }
    }, 250);
});

// Dynamic Content Loading
function loadDynamicContent() {
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });

    lazyImages.forEach(img => imageObserver.observe(img));

    // Animate on scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach(el => scrollObserver.observe(el));
}

// Enhanced Form Validation
function enhancedFormValidation(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;

    inputs.forEach(input => {
        if (input.hasAttribute('required')) {
            if (!input.value.trim()) {
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        }

        // Additional specific validations
        if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                input.classList.add('error');
                isValid = false;
            }
        }

        if (input.type === 'tel') {
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(input.value)) {
                input.classList.add('error');
                isValid = false;
            }
        }
    });

    return isValid;
}

// Initialize all dynamic features
document.addEventListener('DOMContentLoaded', () => {
    loadDynamicContent();

    // Enhanced form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!enhancedFormValidation(form)) {
                e.preventDefault();
            }
        });
    });
});

const twilio = require("twilio");

const accountSid = "AC6a8b2b0b0e9f4b7a9b2b0b0e9f4b7a9";
const authToken = "b0b0e9f4b7a9b2b0b0e9f4b7a9b2b0b0";
const client = new twilio(accountSid, authToken);

function sendWhatsAppMessage(clientNumber, name, email, message) {
  client.messages
    .create({
      from: "whatsapp:+971502702634", // Twilio WhatsApp number
      to: `whatsapp:${clientNumber}`, // Client ka WhatsApp number
      body: `New Inquiry:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
    })
    .then((message) => console.log("WhatsApp Message Sent:", message.sid))
    .catch((error) => console.error("WhatsApp Error:", error));
}

app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  let sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
  db.query(sql, [name, email, message], (err, result) => {
    if (err) {
      res.status(500).send("Error saving data");
    } else {
      sendWhatsAppMessage("+971524358561", name, email, message); // Client ka WhatsApp number
      res.send("Message Saved & WhatsApp Notification Sent!");
    }
  });
});
