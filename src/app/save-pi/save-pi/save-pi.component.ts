import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-save-pi',
  templateUrl: './save-pi.component.html',
  styleUrls: ['./save-pi.component.scss']
})
export class SavePiComponent implements OnInit, AfterViewInit {
  canvas: any;
  // -----------------------------
  // 	SFX & Music
  // -----------------------------
  // sfx from: https://github.com/KilledByAPixel/ZzFX
  // music from: https://www.fesliyanstudios.com/
  sfx = [, , 925, .04, .3, .6, 1, .3, , 6.27, -184, .09, .17];
  audio = new Audio('https://assets.codepen.io/539557/2019-12-11_-_Retro_Platforming_-_David_Fesliyan.mp3');

  // -----------------------------
  // 	Config
  // -----------------------------
  keys: any = {};
  r = 190;
  score: any;
  highscore: any;
  collision = false;
  gameDur = 60000; // 1 min
  pi_600_decimals =
    "141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273724587006606315588174881520920962829254091715364367892590360011330530548820466521384146951941511609433057270365759591953092186117381932611793105118548074462379962749567351885752724891227938183011949129833673362440656643086021394946395224737190702179860943702770539217176293176752384674818467669405132";

  // -----------------------------
  //		Character
  // -----------------------------
  piGuy = {
    x: 190, // initial x pos
    y: 100, // initial y pos
    w: 30, // width
    h: 30, // height
    velY: 0, // velocity X
    velX: 0, // velocity Y
    speed: 2, // Speed multiplier
    friction: 0.75
  };
  dialog: any;
  scoreSpan: any;
  resetBtn: any;
  startBtn: any;
  detector: any;
  ctx: any;

  ngOnInit(): void {
    this.audio.volume = 0.1;
    this.audio.loop = true;
    this.audio.oncanplaythrough = <any>this.audio.play();

    // -----------------------------
    // 	Detector
    // -----------------------------
    this.detector = {
      ang: 90,
      arc: 30,
      s: this.degreesToRad(90 - 30 / 2),
      e: this.degreesToRad(90 + 30 / 2)
    };
  }

  ngAfterViewInit(): void {
    this.dialog = document.getElementById('dialog');
    this.scoreSpan = document.getElementById('score');
    this.resetBtn = document.getElementById('reset');
    this.startBtn = document.getElementById('start');

    this.canvas = <HTMLCanvasElement>document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.canvas.width = this.canvas.height = 400;

    // -----------------------------
    // 	Events
    // -----------------------------
    const self = this;
    document.addEventListener('keydown', function (e) {
      if (e.key.match(/(Arrow)/gi)) {
        e.preventDefault();
        self.keys[e.key] = true;
      }
    });
    document.addEventListener('keyup', function (e) {
      if (e.key.match(/(Arrow)/gi)) {
        e.preventDefault();
        self.keys[e.key] = false;
      }
    });
    document.getElementById('start')?.addEventListener('click', function (e: any) {
      e.target.classList.add('hide');
      self.play(self.gameDur);
    });
    document.getElementById('mute')?.addEventListener('change', function (e: any) {
      self.audio.muted = !self.audio.muted;
    });
  }

  degreesToRad = (ang: number) => ang * (Math.PI / 180);
  // -----------------------------
  // 	Update
  // -----------------------------

  update(dt: any) {
    // movement	
    if (this.keys.ArrowUp) {
      if (this.piGuy.velY > - this.piGuy.speed) {
        this.piGuy.velY--;
      }
    }
    if (this.keys.ArrowDown) {
      if (this.piGuy.velY < this.piGuy.speed) {
        this.piGuy.velY++;
      }
    }
    if (this.keys.ArrowRight) {
      if (this.piGuy.velX < this.piGuy.speed) {
        this.piGuy.velX++;
      }
    }
    if (this.keys.ArrowLeft) {
      if (this.piGuy.velX > - this.piGuy.speed) {
        this.piGuy.velX--;
      }
    }
    // piGuy Velocity
    this.piGuy.velY *= this.piGuy.friction;
    this.piGuy.velX *= this.piGuy.friction;
    // vectors of piGuy
    const v: [[number, number], [number, number], [number, number], [number, number]] = [
      [this.piGuy.x, this.piGuy.y], // top left 
      [this.piGuy.x + this.piGuy.w, this.piGuy.y], // top right
      [this.piGuy.x + this.piGuy.w, this.piGuy.y + this.piGuy.h], // bottom right
      [this.piGuy.x, this.piGuy.y + this.piGuy.h] // bottom left
    ];
    // Move piGuy within bounds
    if (this.piGuy.velX < 0 && this.inCircle(...v[0]) && this.inCircle(...v[3])) {
      this.piGuy.x += this.piGuy.velX;
    } else if (this.piGuy.velX > 0 && this.inCircle(...v[1]) && this.inCircle(...v[2])) {
      this.piGuy.x += this.piGuy.velX;
    }
    if (this.piGuy.velY < 0 && this.inCircle(...v[0]) && this.inCircle(...v[1])) {
      this.piGuy.y += this.piGuy.velY;
    } else if (this.piGuy.velY > 0 && this.inCircle(...v[2]) && this.inCircle(...v[3])) {
      this.piGuy.y += this.piGuy.velY;
    }
    // Detector position
    this.detector.s = this.degreesToRad(this.detector.ang - this.detector.arc / 2);
    this.detector.e = this.degreesToRad(this.detector.ang + this.detector.arc / 2);
    // Detector Size 	
    this.detector.arc = 30 + (330 * dt);
    // direction & speed
    if (dt < 0.33) {
      this.detector.ang += 1;
    } else if (dt < 0.66) {
      this.detector.ang -= 1.2;
      this.piGuy.speed = 2.2;
    } else if (dt < 1) {
      this.detector.ang += 1.4;
      this.piGuy.speed = 2.4;
    }

    // draw 	
    this.draw();
    // collision detection
    let arcPoints: [[number, number, number, number], [number, number, number, number]] = [
      [200, 200, Math.cos(this.detector.s) * this.r + 200, Math.sin(this.detector.s) * this.r + 200],
      [200, 200, Math.cos(this.detector.e) * this.r + 200, Math.sin(this.detector.e) * this.r + 200],
    ];
    this.collision = this.detectCollision(v, arcPoints);
    this.collision && this.GAME_OVER();
  }

  // -----------------------------
  // 	Draw
  // -----------------------------

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Arena
    this.ctx.beginPath();
    this.ctx.arc(200, 200, 190, 0, 2 * Math.PI);
    this.ctx.strokeStyle = '#461877';
    this.ctx.lineWidth = 6;
    this.ctx.fillStyle = '#321155';
    this.ctx.fill();
    this.ctx.stroke();
    // Detector
    this.ctx.beginPath();
    this.ctx.moveTo(200, 200);
    this.ctx.arc(200, 200, 187, this.detector.s, this.detector.e);
    this.ctx.lineTo(200, 200);
    this.ctx.fillStyle = '#EF476F';
    this.ctx.fill();
    // PI Guy
    this.ctx.beginPath();
    this.ctx.rect(this.piGuy.x, this.piGuy.y, 30, 10);
    this.ctx.rect(this.piGuy.x + 4, this.piGuy.y + 10, 8, 20);
    this.ctx.rect(this.piGuy.x + 18, this.piGuy.y + 10, 8, 16);
    this.ctx.rect(this.piGuy.x + 22, this.piGuy.y + 22, 8, 8);
    this.ctx.fillStyle = '#fcc74c';
    this.ctx.fill();
  }

  // -----------------------------
  // 	Play
  // -----------------------------

  play(duration: number) {
    let start = performance.now();
    let secs = '-0';
    let i = 1;
    const self = this;
    requestAnimationFrame(function play(time) {
      let ms = time - start;
      let progress = ms / duration;
      if (progress > 1) progress = 1;
      // keeping score
      if (secs !== (ms / 1000).toFixed(0)) {
        secs = (ms / 1000).toFixed(0);
        i += Number.parseInt(secs) / 3;
        self.score = i;
      }
      // update
      self.update(progress);
      // step		
      if (progress < 1 && !self.collision) requestAnimationFrame(play);
    });
  }

  // -----------------------------
  // 	Reset
  // -----------------------------

  resetScene() {
    this.score = 0;
    this.collision = false;
    this.piGuy.x = 190;
    this.piGuy.y = 100;
    this.piGuy.velX = 0;
    this.piGuy.velY = 0;
    this.piGuy.speed = 2;
    this.detector.ang = 90;
    this.detector.arc = 30;
    this.detector.s = this.degreesToRad(90 - 30 / 2);
    this.detector.e = this.degreesToRad(90 - 30 / 2);
    this.draw();
  }
  // init
  // resetScene();

  // -----------------------------
  // 	Game over
  // -----------------------------

  GAME_OVER() {
    if (this.score > this.highscore || this.highscore === undefined) {
      this.dialog.classList.add('ishighscore');
      this.highscore = this.score;
    }
    // !this.audio.muted && zzfx(...this.sfx);
    this.scoreSpan.textContent = `3.${this.pi_600_decimals.substr(0, this.score)}`;
    setTimeout(() => {
      this.dialog.showModal();
    }, 250);
    this.resetBtn.addEventListener('click', (e: any) => {
      this.dialog.close();
      this.resetScene();
      this.startBtn.classList.remove('hide');
      this.dialog.classList.remove('ishighscore');
    });
  }

  // -----------------------------
  // 	Collision detection
  // -----------------------------
  inCircle(x1: number, y1: number, x0 = 200, y0 = 200, r = 190) {
    // test coordinates (x1,y1), center of circle (x0,y0), radius (r)
    return Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0)) < r;
  }

  detectCollision(c: [[number, number], [number, number], [number, number], [number, number]],
    a: [[number, number, number, number], [number, number, number, number]]) {
    // check each character line against both arc lines
    for (let i = 0; i < c.length; i += 2) {
      for (let j = c.length - 1; j > 0; j -= 2) {
        if (this.intersect(...c[i], ...c[j], ...a[0]) ||
          this.intersect(...c[i], ...c[j], ...a[1])) {
          return true;
        }
      }
    }
    return false;
  }

  // Source: Paul Bourke
  // http://paulbourke.net/geometry/pointlineplane/
  intersect(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {
    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
      return false
    }
    const denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
    // Lines are parallel
    if (denominator === 0) {
      return false
    }
    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator
    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
      return false
    }
    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)
    return { x, y }
  }
}
