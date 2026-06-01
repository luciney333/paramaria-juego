// ============================================================
// MOTOR DEL JUEGO - Las aventuras de María y Lucía
// ============================================================

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;

    // Estado
    this.running = false;
    this.frameCount = 0;
    this.recuerdoActual = 0;
    this.animFrameId = null;

    // Personaje
    this.player = {
      x: 80,
      y: 0,
      width: 36,
      height: 48,
      vy: 0,
      onGround: false,
      jumpCount: 0,
    };

    // Suelo y físicas
    this.groundY = this.height - 80;
    this.gravity = 0.55;
    this.jumpForce = -13;

    // Obstáculos
    this.obstacles = [];
    this.framesSinceLastObstacle = 0;

    // Fondo - capas parallax
    this.bgLayers = [
      { x: 0, speed: 0.3, color: "#1a1a2e" },
      { x: 0, speed: 0.6 },
      { x: 0, speed: 1.0 },
    ];

    // Estrellas de fondo
    this.stars = Array.from({ length: 60 }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * (this.groundY - 40),
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.7 + 0.3,
    }));

    // Nubes decorativas
    this.clouds = Array.from({ length: 5 }, (_, i) => ({
      x: (i * this.width) / 4,
      y: 40 + Math.random() * 80,
      w: 80 + Math.random() * 60,
      speed: 0.4 + Math.random() * 0.3,
    }));

    // Partículas de salto
    this.particles = [];

    // Inicializar posición del jugador
    this.player.y = this.groundY - this.player.height;
  }

  start() {
    this.running = true;
    this.frameCount = 0;
    this.obstacles = [];
    this.player.y = this.groundY - this.player.height;
    this.player.vy = 0;
    this.player.onGround = true;
    this.player.jumpCount = 0;
    this.loop();
  }

  stop() {
    this.running = false;
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
  }

  jump() {
    if (!this.running) return;
    if (this.player.jumpCount < 2) {
      this.player.vy = this.jumpForce;
      this.player.onGround = false;
      this.player.jumpCount++;
      this.spawnJumpParticles();
    }
  }

  spawnJumpParticles() {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: this.player.x + this.player.width / 2,
        y: this.player.y + this.player.height,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * -3 - 1,
        life: 1,
        color: `hsl(${280 + Math.random() * 60}, 80%, 70%)`,
        r: Math.random() * 4 + 2,
      });
    }
  }

  spawnObstacle() {
    const tipos = ["cactus", "bloque", "doble"];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    const alturas = { cactus: 50, bloque: 36, doble: 70 };
    const h = alturas[tipo];

    this.obstacles.push({
      x: this.width + 20,
      y: this.groundY - h,
      width: tipo === "doble" ? 28 : 24,
      height: h,
      tipo,
      color: tipo === "bloque"
        ? `hsl(${200 + Math.random() * 40}, 60%, 50%)`
        : `hsl(${120 + Math.random() * 40}, 55%, 40%)`,
    });
  }

  checkCollision(a, b) {
    const margin = 6;
    return (
      a.x + margin < b.x + b.width - margin &&
      a.x + a.width - margin > b.x + margin &&
      a.y + margin < b.y + b.height &&
      a.y + a.height - margin > b.y + margin
    );
  }

  update() {
    this.frameCount++;

    // Mover fondo / nubes
    this.clouds.forEach((c) => {
      c.x -= c.speed;
      if (c.x + c.w < 0) c.x = this.width + 20;
    });

    // Físicas del jugador
    this.player.vy += this.gravity;
    this.player.y += this.player.vy;

    if (this.player.y >= this.groundY - this.player.height) {
      this.player.y = this.groundY - this.player.height;
      this.player.vy = 0;
      this.player.onGround = true;
      this.player.jumpCount = 0;
    }

    // Obstáculos
    this.framesSinceLastObstacle++;
    const interval =
      CONFIG.frecuenciaObstaculos - Math.min(this.frameCount / 200, 30);
    if (this.framesSinceLastObstacle > interval) {
      this.spawnObstacle();
      this.framesSinceLastObstacle = 0;
    }

    this.obstacles.forEach((o) => (o.x -= CONFIG.velocidadJuego));
    this.obstacles = this.obstacles.filter((o) => o.x + o.width > -10);

    // Colisiones
    for (const o of this.obstacles) {
      if (this.checkCollision(this.player, o)) {
        this.onDeath();
        return;
      }
    }

    // Partículas
    this.particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15;
      p.life -= 0.04;
    });
    this.particles = this.particles.filter((p) => p.life > 0);

    // Condición de victoria: sobrevivir 1400 frames (~23s a 60fps)
    if (this.frameCount > 1400) {
      this.stop();
      if (typeof onWin === "function") onWin();
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Fondo degradado
    const grad = ctx.createLinearGradient(0, 0, 0, this.groundY);
    grad.addColorStop(0, "#0d0d1a");
    grad.addColorStop(1, "#1a0a2e");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.groundY);

    // Estrellas
    this.stars.forEach((s) => {
      ctx.globalAlpha = s.alpha * (0.7 + 0.3 * Math.sin(this.frameCount * 0.02 + s.x));
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Nubes
    this.clouds.forEach((c) => {
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.beginPath();
      ctx.ellipse(c.x + c.w / 2, c.y, c.w / 2, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(c.x + c.w * 0.3, c.y + 5, c.w * 0.3, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Suelo con brillo
    const groundGrad = ctx.createLinearGradient(0, this.groundY, 0, this.height);
    groundGrad.addColorStop(0, "#2d1b4e");
    groundGrad.addColorStop(0.3, "#1a0a2e");
    groundGrad.addColorStop(1, "#0d0620");
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, this.groundY, this.width, this.height - this.groundY);

    // Línea del suelo con glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#9b59b6";
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, this.groundY);
    ctx.lineTo(this.width, this.groundY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Obstáculos
    this.obstacles.forEach((o) => {
      this.drawObstacle(o);
    });

    // Partículas
    this.particles.forEach((p) => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Personaje (muñequita)
    this.drawPlayer();

    // HUD - barra de progreso
    this.drawProgressBar();
  }

  drawObstacle(o) {
    const ctx = this.ctx;
    ctx.shadowBlur = 12;
    ctx.shadowColor = o.color;
    ctx.fillStyle = o.color;

    if (o.tipo === "cactus") {
      // Cuerpo principal
      ctx.fillRect(o.x + 8, o.y, 8, o.height);
      // Brazos
      ctx.fillRect(o.x, o.y + 14, 24, 6);
      ctx.fillRect(o.x, o.y + 8, 8, 12);
      ctx.fillRect(o.x + 16, o.y + 8, 8, 12);
    } else if (o.tipo === "bloque") {
      ctx.beginPath();
      ctx.roundRect(o.x, o.y, o.width, o.height, 4);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      // Doble obstáculo
      ctx.fillRect(o.x + 4, o.y, 8, o.height);
      ctx.fillRect(o.x + 4, o.y, 20, 14);
      ctx.fillRect(o.x + 4, o.y + o.height - 14, 20, 14);
    }
    ctx.shadowBlur = 0;
  }

  drawPlayer() {
    const ctx = this.ctx;
    const p = this.player;
    const cx = p.x + p.width / 2;
    const cy = p.y;
    const bounce = p.onGround ? Math.sin(this.frameCount * 0.15) * 2 : 0;

    // Glow del personaje
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#e879f9";

    // Cuerpo
    const bodyGrad = ctx.createLinearGradient(p.x, cy, p.x + p.width, cy + p.height);
    bodyGrad.addColorStop(0, "#f0abfc");
    bodyGrad.addColorStop(1, "#c026d3");
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.roundRect(p.x + 4, cy + 16 + bounce, p.width - 8, p.height - 20, 6);
    ctx.fill();

    // Cabeza
    ctx.fillStyle = "#fde68a";
    ctx.beginPath();
    ctx.arc(cx, cy + 10 + bounce, 14, 0, Math.PI * 2);
    ctx.fill();

    // Pelo
    ctx.fillStyle = "#92400e";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 2 + bounce, 14, 8, 0, Math.PI, 0);
    ctx.fill();
    // Coleta
    ctx.beginPath();
    ctx.ellipse(cx + 10, cy + 6 + bounce, 6, 4, 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Ojos
    ctx.fillStyle = "#1e1e3f";
    ctx.beginPath();
    ctx.arc(cx - 4, cy + 10 + bounce, 2, 0, Math.PI * 2);
    ctx.arc(cx + 4, cy + 10 + bounce, 2, 0, Math.PI * 2);
    ctx.fill();

    // Sonrisa
    ctx.strokeStyle = "#92400e";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy + 13 + bounce, 4, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Piernas animadas
    const legSwing = p.onGround ? Math.sin(this.frameCount * 0.25) * 8 : 0;
    ctx.fillStyle = "#7c3aed";
    ctx.beginPath();
    ctx.roundRect(cx - 9, cy + p.height - 14 + bounce, 8, 14 + legSwing * 0.3, 3);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(cx + 1, cy + p.height - 14 + bounce, 8, 14 - legSwing * 0.3, 3);
    ctx.fill();

    ctx.shadowBlur = 0;
  }

  drawProgressBar() {
    const ctx = this.ctx;
    const progress = Math.min(this.frameCount / 1400, 1);
    const barW = this.width - 40;
    const barH = 6;
    const barX = 20;
    const barY = 14;

    // Fondo barra
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 3);
    ctx.fill();

    // Relleno
    const fillGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
    fillGrad.addColorStop(0, "#c026d3");
    fillGrad.addColorStop(1, "#7c3aed");
    ctx.fillStyle = fillGrad;
    ctx.shadowBlur = 6;
    ctx.shadowColor = "#c026d3";
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW * progress, barH, 3);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Texto de hint
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "11px 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("TAP / ESPACIO para saltar (doble salto disponible)", this.width / 2, this.height - 10);
  }

  loop() {
    if (!this.running) return;
    this.update();
    this.draw();
    this.animFrameId = requestAnimationFrame(() => this.loop());
  }
}
