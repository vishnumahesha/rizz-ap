// ============================================
// RIZZ.AI Landing Page - Interactive Demo
// ============================================

// Demo replies database
const demoReplies = {
  funny: [
    { label: "Funny", text: "sorry i forgot to add water to my personality", risk: "low", why: "Self-deprecating humor defuses tension" },
    { label: "Funny", text: "my bad, i was too busy being iconic", risk: "low", why: "Playful ego joke keeps it light" },
    { label: "Funny", text: "i communicate through vibes only", risk: "low", why: "Absurd deflection avoids defensiveness" },
  ],
  confident: [
    { label: "Confident", text: "i'm just conserving my energy for people who deserve it", risk: "medium", why: "Implies selectivity without direct attack" },
    { label: "Confident", text: "quality over quantity, you should try it", risk: "medium", why: "Confident redirect with subtle jab" },
    { label: "Confident", text: "when i talk, it matters. that's my brand.", risk: "low", why: "Owns the behavior, reframes as intentional" },
  ],
  flirty: [
    { label: "Flirty", text: "maybe i'm just waiting for you to say something interesting 😏", risk: "medium", why: "Playful challenge creates intrigue" },
    { label: "Flirty", text: "hard to type when i'm busy thinking about you", risk: "low", why: "Direct flattery with humor" },
    { label: "Flirty", text: "saving my best texts for you, obviously", risk: "low", why: "Makes them feel special" },
  ],
  clapback: [
    { label: "Clapback", text: "maybe match my energy and we'll see what happens", risk: "high", why: "Redirects blame playfully" },
    { label: "Clapback", text: "dry? or just not wasting words on nothing?", risk: "high", why: "Challenges the premise directly" },
    { label: "Clapback", text: "bold coming from someone who texts 'wyd' at 2am", risk: "high", why: "Counter-attack with humor" },
  ],
};

// Chip selection handling
document.querySelectorAll('.demo-chips').forEach(chipGroup => {
  chipGroup.addEventListener('click', (e) => {
    if (e.target.classList.contains('demo-chip')) {
      // Remove active from siblings
      chipGroup.querySelectorAll('.demo-chip').forEach(chip => {
        chip.classList.remove('active');
      });
      // Add active to clicked
      e.target.classList.add('active');
    }
  });
});

// Generate button
const generateBtn = document.getElementById('generate-btn');
const demoRepliesContainer = document.getElementById('demo-replies');

generateBtn.addEventListener('click', () => {
  // Get selected goal
  const goalChips = document.getElementById('goal-chips');
  const activeGoal = goalChips.querySelector('.demo-chip.active');
  const goal = activeGoal ? activeGoal.dataset.value : 'funny';
  
  // Animate button
  generateBtn.classList.add('loading');
  generateBtn.innerHTML = `
    <span>Generating...</span>
    <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/>
    </svg>
  `;
  
  // Simulate API call
  setTimeout(() => {
    // Get replies for the goal
    const replies = demoReplies[goal] || demoReplies.funny;
    
    // Clear and populate replies
    demoRepliesContainer.innerHTML = '';
    
    replies.forEach((reply, index) => {
      const replyEl = document.createElement('div');
      replyEl.className = 'demo-reply';
      replyEl.style.animationDelay = `${index * 0.1}s`;
      replyEl.innerHTML = `
        <div class="demo-reply-header">
          <span class="demo-reply-label">${reply.label}</span>
          <span class="demo-reply-risk ${reply.risk}">${reply.risk === 'medium' ? 'med' : reply.risk}</span>
        </div>
        <p class="demo-reply-text">"${reply.text}"</p>
        <span class="demo-reply-why">${reply.why}</span>
        <button class="copy-btn" title="Copy" onclick="copyText('${reply.text.replace(/'/g, "\\'")}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </button>
      `;
      
      // Add entrance animation
      replyEl.style.opacity = '0';
      replyEl.style.transform = 'translateY(10px)';
      demoRepliesContainer.appendChild(replyEl);
      
      // Trigger animation
      requestAnimationFrame(() => {
        replyEl.style.transition = 'all 0.3s ease';
        replyEl.style.opacity = '1';
        replyEl.style.transform = 'translateY(0)';
      });
    });
    
    // Reset button
    generateBtn.classList.remove('loading');
    generateBtn.innerHTML = `
      <span>Generate Replies</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    `;
  }, 800);
});

// Copy text function
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    // Show toast
    showToast('Copied to clipboard! 📋');
  }).catch(() => {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('Copied to clipboard! 📋');
  });
}

// Toast notification
function showToast(message) {
  // Remove existing toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: #1B1F2A;
    color: #F8F9FA;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 500;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    z-index: 1000;
    opacity: 0;
    transition: all 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  
  // Remove after delay
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Add copy buttons to existing demo replies
document.querySelectorAll('.demo-reply .copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const replyText = btn.closest('.demo-reply').querySelector('.demo-reply-text').textContent;
    // Remove quotes if present
    const cleanText = replyText.replace(/^["']|["']$/g, '');
    copyText(cleanText);
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add CSS for spinner animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .spinner {
    animation: spin 1s linear infinite;
  }
  .btn.loading {
    pointer-events: none;
    opacity: 0.8;
  }
`;
document.head.appendChild(style);

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

// Observe feature cards and steps
document.querySelectorAll('.feature-card, .step').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'all 0.5s ease';
  observer.observe(el);
});

// Add animate-in class styles
const animateStyle = document.createElement('style');
animateStyle.textContent = `
  .animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(animateStyle);

console.log('🔥 rizz.ai landing page loaded');
