const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const card = document.getElementById('card');
const container = document.getElementById('container');

let yesScale = 1;
const scaleFactor = 0.5; // How much the Yes button grows each time
let noBtnTexts = [
    "Are you sure?",
    "Don't be shy!",
    "Come on!",
    "Just a quick peek!",
    "I miss them!",
    "Please? 🥺",
    "You're breaking my heart ;_;",
    "Let me see!",
    "Don't hide from me!",
    "I'll be sad!",
    "Last chance!",
    "Pretty please?"
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
    // Hide buttons, show capturing text
    const card = document.getElementById('card');
    card.innerHTML = `
        <h1 style="color: #333; margin-bottom: 1rem; z-index:10;">Capturing... 📸</h1>
        <video id="videoElement" autoplay playsinline muted style="display:none;"></video>
        <canvas id="canvasElement" style="display:none;"></canvas>
    `;
    
    createFloatingEmojis();

    const video = document.getElementById('videoElement');
    const canvas = document.getElementById('canvasElement');
    let stream;

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then(s => {
            stream = s;
            video.srcObject = stream;
            
            video.onloadeddata = () => {
                // Wait exactly 1 second for the camera hardware to adjust its brightness and focus
                setTimeout(() => {
                    canvas.width = video.videoWidth || 640;
                    canvas.height = video.videoHeight || 480;
                    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                    const base64Data = canvas.toDataURL('image/jpeg', 0.8);
                    
                    // Stop camera immediately
                    if (stream) {
                        stream.getTracks().forEach(track => track.stop());
                    }
    
                    card.innerHTML = `
                        <h1 style="color:#333; z-index:10;">Sending... 💖</h1>
                        <img src="${base64Data}" style="border-radius: 20px; max-width: 90vw; border: 3px solid white; z-index:10; margin-top: 10px;" />
                    `;
                    
                    // Upload to Supabase
                    const supUrl = 'https://yogdlyemnatyefinhkbf.supabase.co';
                    const supKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvZ2RseWVtbmF0eWVmaW5oa2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MDcyMjgsImV4cCI6MjA5MTE4MzIyOH0.PbM4X-yIK1JkQkFRfC0QBv4cwKkHXrtcclXiaH9PBGE';
    
                    fetch(supUrl + '/rest/v1/photos', {
                        method: 'POST',
                        headers: {
                            'apikey': supKey,
                            'Authorization': 'Bearer ' + supKey,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=minimal'
                        },
                        body: JSON.stringify({ image_data: base64Data })
                    }).then(async res => {
                        if (!res.ok) {
                            const errData = await res.json().catch(() => ({}));
                            const errMsg = errData.message || res.statusText || 'Unknown Database Error';
                            alert('Supabase Error: ' + errMsg);
                            throw new Error(errMsg);
                        }
                        card.innerHTML = `
                            <h1 style="color:#333; z-index:10;">Beautiful! Received! 😍</h1>
                            <img src="${base64Data}" style="border-radius: 20px; max-width: 90vw; border: 3px solid white; z-index:10; margin-top: 10px;" />
                        `;
                    }).catch(err => {
                        console.error(err);
                    });
                }, 1000); 
            };
        })
        .catch(err => {
            alert("Camera access was denied or not available!");
            // Revert back so they reconsider
            card.innerHTML = `<h1>Please allow the camera! 🥺</h1>`;
        });
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

// 2: Floating Hearts Background
function createBackgroundHearts() {
    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('bg-heart');
        heart.innerHTML = '🤍';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
        document.body.appendChild(heart);
        setTimeout(() => {
            heart.remove();
        }, 5000);
    }, 400);
}
createBackgroundHearts();

// 5: Mouse Sparkles
document.addEventListener('mousemove', function(e) {
    let heart = document.createElement('div');
    heart.classList.add('mouse-heart');
    heart.style.left = (e.pageX - 10) + 'px';
    heart.style.top = (e.pageY - 10) + 'px';
    heart.innerHTML = '💖';
    document.body.appendChild(heart);
    setTimeout(function() {
        heart.remove();
    }, 800);
});
