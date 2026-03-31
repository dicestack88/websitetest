// Particle effect system inspired by Celeste
class Particle {
  constructor(canvas, settings) {
    this.canvas = canvas;
    this.settings = settings;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height - canvas.height;
    this.size = Math.random() * (settings.particleSize / 2) + 1;
    this.speedY = Math.random() * (settings.particleSpeed * 0.5) + (settings.particleSpeed * 0.3);
    this.speedX = (Math.random() - 0.5) * (settings.particleSpeed * 0.5);
    this.opacity = Math.random() * 0.5 + 0.3;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.02 + 0.01;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.wobble) * 0.3;
    this.wobble += this.wobbleSpeed;
    
    this.opacity -= 0.001;
    
    if (this.y > this.canvas.height) {
      this.y = -10;
      this.x = Math.random() * this.canvas.width;
      this.opacity = Math.random() * 0.5 + 0.3;
    }
  }

  draw(ctx) {
    const [r, g, b] = this.settings.particleColor;
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class ParticleSystem {
  constructor() {
    // Default settings
    this.settings = {
      enabled: true,
      particleCount: 50,
      particleSpeed: 1,
      particleSize: 3,
      particleColor: [0, 255, 191] // Cyan
    };

    // Load saved settings
    this.loadSettings();

    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '-1';
    document.body.prepend(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.createParticles();
    this.animate();
    this.createSettingsUI();
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.settings.particleCount; i++) {
      this.particles.push(new Particle(this.canvas, this.settings));
    }
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  animate() {
    if (this.settings.enabled) {
      this.ctx.fillStyle = 'rgba(11, 11, 11, 0.1)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      for (let particle of this.particles) {
        particle.update();
        particle.draw(this.ctx);
      }
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    requestAnimationFrame(() => this.animate());
  }

  createSettingsUI() {
    // Settings button
    const settingsBtn = document.createElement('button');
    settingsBtn.innerHTML = '⚙️';
    settingsBtn.style.cssText = `
      position: fixed;
      top: 30px;
      right: 30px;
      z-index: 1000;
      width: 45px;
      height: 45px;
      border-radius: 50%;
      border: 2px solid #00ffbf;
      background: rgba(11, 11, 11, 0.9);
      color: #00ffbf;
      font-size: 1.3rem;
      cursor: pointer;
      transition: 0.3s;
    `;
    settingsBtn.onmouseover = () => {
      settingsBtn.style.background = 'rgba(0, 255, 191, 0.2)';
      settingsBtn.style.transform = 'scale(1.1) rotate(20deg)';
    };
    settingsBtn.onmouseout = () => {
      settingsBtn.style.background = 'rgba(11, 11, 11, 0.9)';
      settingsBtn.style.transform = 'scale(1) rotate(0deg)';
    };
    document.body.prepend(settingsBtn);

    // Settings modal
    const modal = document.createElement('div');
    modal.style.cssText = `
      display: none;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999;
      background: rgba(20, 20, 30, 0.98);
      border: 2px solid #00ffbf;
      border-radius: 16px;
      padding: 30px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 0 40px rgba(0, 255, 191, 0.3);
    `;

    const title = document.createElement('h2');
    title.textContent = 'Particle Settings';
    title.style.cssText = `
      color: #00ffbf;
      font-family: 'Orbitron', sans-serif;
      margin-bottom: 25px;
      font-size: 1.5rem;
    `;
    modal.appendChild(title);

    // Enable/Disable toggle
    const enableLabel = document.createElement('label');
    enableLabel.style.cssText = `
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      cursor: pointer;
      color: #ddd;
    `;
    const enableCheckbox = document.createElement('input');
    enableCheckbox.type = 'checkbox';
    enableCheckbox.checked = this.settings.enabled;
    enableCheckbox.style.cssText = `
      width: 20px;
      height: 20px;
      margin-right: 10px;
      cursor: pointer;
    `;
    enableCheckbox.onchange = () => {
      this.settings.enabled = enableCheckbox.checked;
      this.saveSettings();
    };
    enableLabel.appendChild(enableCheckbox);
    enableLabel.appendChild(document.createTextNode('Enable Particles'));
    modal.appendChild(enableLabel);

    // Particle Count
    const countLabel = document.createElement('div');
    countLabel.style.cssText = 'margin-bottom: 15px;';
    countLabel.innerHTML = `<label style="color: #bbb; display: block; margin-bottom: 8px;">Particle Count: <span id="countValue">${this.settings.particleCount}</span></label>`;
    modal.appendChild(countLabel);
    const countSlider = document.createElement('input');
    countSlider.type = 'range';
    countSlider.min = '10';
    countSlider.max = '200';
    countSlider.value = this.settings.particleCount;
    countSlider.style.cssText = 'width: 100%; cursor: pointer; margin-bottom: 20px;';
    countSlider.oninput = () => {
      document.getElementById('countValue').textContent = countSlider.value;
      this.settings.particleCount = parseInt(countSlider.value);
      this.createParticles();
      this.saveSettings();
    };
    modal.appendChild(countSlider);

    // Particle Speed
    const speedLabel = document.createElement('div');
    speedLabel.style.cssText = 'margin-bottom: 15px;';
    speedLabel.innerHTML = `<label style="color: #bbb; display: block; margin-bottom: 8px;">Particle Speed: <span id="speedValue">${this.settings.particleSpeed.toFixed(1)}</span>x</label>`;
    modal.appendChild(speedLabel);
    const speedSlider = document.createElement('input');
    speedSlider.type = 'range';
    speedSlider.min = '0.2';
    speedSlider.max = '2';
    speedSlider.step = '0.1';
    speedSlider.value = this.settings.particleSpeed;
    speedSlider.style.cssText = 'width: 100%; cursor: pointer; margin-bottom: 20px;';
    speedSlider.oninput = () => {
      document.getElementById('speedValue').textContent = speedSlider.value;
      this.settings.particleSpeed = parseFloat(speedSlider.value);
      this.createParticles();
      this.saveSettings();
    };
    modal.appendChild(speedSlider);

    // Particle Size
    const sizeLabel = document.createElement('div');
    sizeLabel.style.cssText = 'margin-bottom: 15px;';
    sizeLabel.innerHTML = `<label style="color: #bbb; display: block; margin-bottom: 8px;">Particle Size: <span id="sizeValue">${this.settings.particleSize}</span>px</label>`;
    modal.appendChild(sizeLabel);
    const sizeSlider = document.createElement('input');
    sizeSlider.type = 'range';
    sizeSlider.min = '1';
    sizeSlider.max = '8';
    sizeSlider.value = this.settings.particleSize;
    sizeSlider.style.cssText = 'width: 100%; cursor: pointer; margin-bottom: 20px;';
    sizeSlider.oninput = () => {
      document.getElementById('sizeValue').textContent = sizeSlider.value;
      this.settings.particleSize = parseInt(sizeSlider.value);
      this.createParticles();
      this.saveSettings();
    };
    modal.appendChild(sizeSlider);

    // Color picker
    const colorLabel = document.createElement('label');
    colorLabel.style.cssText = 'display: block; color: #bbb; margin-bottom: 8px;';
    colorLabel.textContent = 'Particle Color:';
    modal.appendChild(colorLabel);
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = this.rgbToHex(this.settings.particleColor);
    colorPicker.style.cssText = 'width: 100%; height: 40px; border: none; border-radius: 8px; cursor: pointer; margin-bottom: 20px;';
    colorPicker.oninput = () => {
      this.settings.particleColor = this.hexToRgb(colorPicker.value);
      this.saveSettings();
    };
    modal.appendChild(colorPicker);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.cssText = `
      width: 100%;
      padding: 12px;
      background: #00ffbf;
      color: #0b0b0b;
      border: none;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      transition: 0.3s;
      font-family: 'Inter', sans-serif;
    `;
    closeBtn.onmouseover = () => closeBtn.style.background = '#00e6a8';
    closeBtn.onmouseout = () => closeBtn.style.background = '#00ffbf';
    closeBtn.onclick = () => modal.style.display = 'none';
    modal.appendChild(closeBtn);

    document.body.appendChild(modal);

    // Toggle modal on button click
    settingsBtn.onclick = () => {
      modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
    };

    // Close modal when clicking outside
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    };
  }

  rgbToHex(rgb) {
    return '#' + rgb.map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 255, 191];
  }

  saveSettings() {
    localStorage.setItem('particleSettings', JSON.stringify(this.settings));
  }

  loadSettings() {
    const saved = localStorage.getItem('particleSettings');
    if (saved) {
      this.settings = JSON.parse(saved);
    }
  }
}

// Initialize particle system when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
  });
} else {
  new ParticleSystem();
}
