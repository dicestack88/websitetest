// Particle effect system inspired by Celeste
class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height - canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedY = Math.random() * 0.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.02 + 0.01;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.wobble) * 0.3;
    this.wobble += this.wobbleSpeed;
    
    // Fade out as it falls
    this.opacity -= 0.001;
    
    // Reset if off screen
    if (this.y > this.canvas.height) {
      this.y = -10;
      this.x = Math.random() * this.canvas.width;
      this.opacity = Math.random() * 0.5 + 0.3;
    }
  }

  draw(ctx) {
    ctx.fillStyle = `rgba(0, 255, 191, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class ParticleSystem {
  constructor(particleCount = 50) {
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '1';
    document.body.prepend(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    
    // Set canvas size
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(this.canvas));
    }

    this.animate();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  animate() {
    // Clear canvas
    this.ctx.fillStyle = 'rgba(11, 11, 11, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    for (let particle of this.particles) {
      particle.update();
      particle.draw(this.ctx);
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize particle system when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem(50);
  });
} else {
  new ParticleSystem(50);
}
