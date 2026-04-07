const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const card = document.getElementById('card');
const container = document.getElementById('container');

let yesScale = 1;
const scaleFactor = 0.5; // How much the Yes button grows each time
let noBtnTexts = [
    "Are you sure?",
    "Really sure?",
    "Think again!",
    "Last chance!",
    "Surely not?",
    "You might regret this!",
    "Give it another thought!",
    "Are you absolutely certain?",
    "This could be a mistake!",
    "Have a heart!",
    "Don't be so cold!",
    "Change of heart?",
    "Wouldn't you reconsider?",
    "Is that your final answer?",
    "You're breaking my heart ;_;"
];
let clickCount = 0;

noBtn.addEventListener('click', () => {
    // Increase the size of the Yes button
    yesScale += scaleFactor;
    yesBtn.style.transform = `scale(${yesScale})`;
    
    // Create a bit of space around the button as it grows to not push other things weirdly initially
    yesBtn.style.margin = `${yesScale * 5}px`;

    // Change the No button text
    if (clickCount < noBtnTexts.length - 1) {
        noBtn.textContent = noBtnTexts[clickCount];
        clickCount++;
    } else {
        // Eventually just keep repeating the last message or hide it
        noBtn.textContent = noBtnTexts[noBtnTexts.length - 1];
    }
    
    // Add a little shake effect to the card
    card.style.animation = 'none';
    card.offsetHeight; // trigger reflow
    card.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';

    // If Yes button gets too big, let's take over the screen
    if (yesScale > 10) {
        // Make it full screen
        yesBtn.style.position = 'fixed';
        yesBtn.style.top = '0';
        yesBtn.style.left = '0';
        yesBtn.style.width = '100vw';
        yesBtn.style.height = '100vh';
        yesBtn.style.borderRadius = '0';
        yesBtn.style.zIndex = '9999';
        yesBtn.style.fontSize = '10rem'; // Giant text
        yesBtn.textContent = 'Yes! 🥰';
    }
});

yesBtn.addEventListener('click', () => {
    // Hide everything and show final screen
    document.body.innerHTML = `
        <div class="success-screen" style="display: flex;">
            <h1>I knew it! ❤️</h1>
            <div class="img-container">
                <img src="success.gif" alt="Cute Bears Hugging">
            </div>
        </div>
    `;
    
    createFloatingEmojis();
});

function createFloatingEmojis() {
    const emojis = ['❤️', '💖', '🥰', '😍', '💕'];
    
    setInterval(() => {
        const emoji = document.createElement('div');
        emoji.classList.add('emoji-float');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        emoji.style.left = Math.random() * 100 + 'vw';
        emoji.style.top = '100vh'; // Start from bottom
        
        document.body.appendChild(emoji);
        
        setTimeout(() => {
            emoji.remove();
        }, 3000);
    }, 300);
}

// Add shake animation dynamically
const style = document.createElement('style');
style.innerHTML = `
    @keyframes shake {
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
        40%, 60% { transform: translate3d(4px, 0, 0); }
    }
`;
document.head.appendChild(style);
