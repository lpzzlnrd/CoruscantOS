export class FlappyApp {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.bird = { x: 50, y: 150, velocity: 0, gravity: 0.6, jump: -8, size: 30 };
    this.pipes = [];
    this.score = 0;
    this.gameOver = false;
    this.frame = 0;
    
    this.copilotImg = new Image();
    // Using a public URL for copilot logo, fallback to drawing a robot
    this.copilotImg.src = "https://github.githubassets.com/images/modules/site/copilot/copilot.png";
  }

  render() {
    return `
      <div style="display: flex; flex-direction: column; height: 100%; align-items: center; justify-content: center; position: relative;" class="js-flappy-container">
        <canvas id="flappy-canvas" width="300" height="500" style="background: #87CEEB; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);"></canvas>
        <div class="js-flappy-overlay" style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.5); border-radius: 15px; pointer-events: none;">
          <h2 style="color: white; font-size: 3rem; margin: 0; text-shadow: 2px 2px 0 #000;">Flappy Copilot</h2>
          <p style="color: white; font-size: 1.2rem;">Toca para saltar</p>
        </div>
      </div>
    `;
  }

  onMount(container) {
    this.canvas = container.querySelector('#flappy-canvas');
    this.ctx = this.canvas.getContext('2d');
    const overlay = container.querySelector('.js-flappy-overlay');

    const jump = (e) => {
      e.preventDefault();
      if (this.gameOver) {
        this.reset();
        overlay.style.display = 'none';
      } else {
        this.bird.velocity = this.bird.jump;
        overlay.style.display = 'none';
      }
    };

    this.canvas.addEventListener('mousedown', jump);
    this.canvas.addEventListener('touchstart', jump);

    this.reset();
    this.loop();
  }

  onUnmount() {
    cancelAnimationFrame(this.animationId);
  }

  reset() {
    this.bird.y = 150;
    this.bird.velocity = 0;
    this.pipes = [];
    this.score = 0;
    this.gameOver = false;
    this.frame = 0;
  }

  loop() {
    if (!this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.gameOver) {
      this.bird.velocity += this.bird.gravity;
      this.bird.y += this.bird.velocity;

      // Generate pipes
      if (this.frame % 90 === 0) {
        const gap = 120;
        const topHeight = Math.random() * (this.canvas.height - gap - 100) + 50;
        this.pipes.push({ x: this.canvas.width, topHeight, gap, width: 50 });
      }

      // Update pipes
      for (let i = this.pipes.length - 1; i >= 0; i--) {
        const p = this.pipes[i];
        p.x -= 3;

        // Collision
        if (
          this.bird.x + this.bird.size > p.x && 
          this.bird.x < p.x + p.width && 
          (this.bird.y < p.topHeight || this.bird.y + this.bird.size > p.topHeight + p.gap)
        ) {
          this.gameOver = true;
        }

        // Score
        if (p.x === this.bird.x) this.score++;

        // Remove off-screen pipes
        if (p.x + p.width < 0) this.pipes.splice(i, 1);
      }

      // Floor collision
      if (this.bird.y + this.bird.size > this.canvas.height || this.bird.y < 0) {
        this.gameOver = true;
      }
    }

    // Draw pipes
    this.ctx.fillStyle = '#2ecc71';
    this.pipes.forEach(p => {
      this.ctx.fillRect(p.x, 0, p.width, p.topHeight);
      this.ctx.fillRect(p.x, p.topHeight + p.gap, p.width, this.canvas.height);
    });

    // Draw bird (Copilot)
    if (this.copilotImg.complete && this.copilotImg.naturalHeight !== 0) {
      this.ctx.drawImage(this.copilotImg, this.bird.x, this.bird.y, this.bird.size + 10, this.bird.size + 10);
    } else {
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '30px Arial';
      this.ctx.fillText('🤖', this.bird.x, this.bird.y + this.bird.size);
    }

    // Draw score
    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 40px Arial';
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.score, this.canvas.width / 2, 50);
    this.ctx.strokeText(this.score, this.canvas.width / 2, 50);

    if (this.gameOver) {
      this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = '#fff';
      this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.font = '20px Arial';
      this.ctx.fillText('Toca para reiniciar', this.canvas.width / 2, this.canvas.height / 2 + 40);
    }

    this.frame++;
    this.animationId = requestAnimationFrame(() => this.loop());
  }
}
