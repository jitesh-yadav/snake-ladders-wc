import { AfterViewInit, Component, OnInit } from '@angular/core';
import gsap from "gsap";

@Component({
  selector: 'app-snake-ladders',
  templateUrl: './snake-ladders.component.html',
  styleUrls: ['./snake-ladders.component.scss']
})
export class SnakeLaddersComponent implements OnInit, AfterViewInit {
  wrapper: any;
  resetGameBtn: any;
  diceDisplay: any;
  playerDisplay: any;
  message: any;
  canvas: any;
  ctx: any;

  height = 500;
  width = 500;
  gridSize = 50;
  gridMid = 25;
  walking: any;
  walkSpeed = 450;
  locked = false;
  slideSpeed = .5;
  rolled: number | string = '';
  rolling: any;
  rollCount: any;
  rollMax: any;
  rollSpeed = 85;
  activePlayer: any;

  player1 = { current: 0, target: 0, x: 0, y: 0, colour: '#f36d', id: 'You' };
  player2 = { current: 0, target: 0, x: 0, y: 0, colour: '#8a2d', id: 'AutoBot' };

  obstacles = [
    { type: 'snake', start: 97, end: 78 },
    { type: 'snake', start: 95, end: 56 },
    { type: 'snake', start: 88, end: 24 },
    { type: 'snake', start: 62, end: 18 },
    { type: 'snake', start: 48, end: 26 },
    { type: 'snake', start: 36, end: 6 },
    { type: 'snake', start: 32, end: 10 },
    { type: 'ladder', start: 1, end: 38 },
    { type: 'ladder', start: 4, end: 14 },
    { type: 'ladder', start: 8, end: 30 },
    { type: 'ladder', start: 21, end: 42 },
    { type: 'ladder', start: 28, end: 76 },
    { type: 'ladder', start: 50, end: 67 },
    { type: 'ladder', start: 71, end: 92 },
    { type: 'ladder', start: 80, end: 99 }
  ];

  ngOnInit(): void {
    this.activePlayer = this.player1;
  }

  ngAfterViewInit(): void {
    this.wrapper = document.querySelector('.wrapper');
    this.resetGameBtn = document.querySelector('#reset');
    this.diceDisplay = document.querySelector('#diceThrow');
    this.playerDisplay = document.querySelector('.playerName');
    this.message = document.querySelector('.message');

    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx.strokeStyle = '#555';
    this.ctx.lineWidth = 2;
    this.wrapper.style.width = `${this.width}px`;

    this.diceDisplay.addEventListener('click', this.rollDice);
    this.resetGameBtn.addEventListener('click', this.resetGame);

    this.setPlayerID();
  }

  setLocked = (tf: any) => {
    this.locked = tf;
  }

  boustrophedonWalk = (cols: number, rows: number) => {
    let temp: any[] = [];
    for(let row=0; row<rows; row++){
      let t = Array.apply(null, Array(cols)).map((x, col) => {
        return {id:col+row*cols, y:this.height - this.gridSize - row*this.gridSize, x:col*this.gridSize};
      });
      t = row % 2 ? t.reverse() : t;
      temp = [...temp, ...t];
    }
    return temp;
  }
  
  drawPlayers = () => {
    this.ctx.clearRect(0, 0, this.width, this.height);
    if(this.player1.current > 0) {
      this.ctx.fillStyle = this.player1.colour;
      this.ctx.beginPath();
      this.ctx.arc(this.player1.x+this.gridMid, this.player1.y+this.gridMid, 16, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.stroke();
    }
    if(this.player2.current > 0) {
      this.ctx.fillStyle = this.player2.colour;
      this.ctx.beginPath();
      if(this.player2.current === this.player1.current){
        this.ctx.arc(this.player2.x+this.gridMid, this.player2.y+this.gridMid, 16, 45, Math.PI + 45);
      } 
      else {
        this.ctx.arc(this.player2.x+this.gridMid, this.player2.y+this.gridMid, 16, 0, 2 * Math.PI);
      }
      this.ctx.fill();
      this.ctx.stroke();
    }
  }
  
  walk = () => {
    let activeCounter = this.activePlayer.current++;
    let sliding = false;
    this.activePlayer.x = this.walkSequence[activeCounter].x;
    this.activePlayer.y = this.walkSequence[activeCounter].y;
    this.drawPlayers();
    
    if(activeCounter === 99){
      clearInterval(this.walking);
      this.showWinner();
      return;
    }
    
    if(this.activePlayer.current >= this.activePlayer.target){
      clearInterval(this.walking);
      
      // check obstacles
      for(let i=0; i < this.obstacles.length; i++){
        if(this.obstacles[i].start === this.activePlayer.target){
          let endSquare = this.obstacles[i].end;
          this.activePlayer.target = this.obstacles[i].end;
          sliding = true;
          this.slide(this.activePlayer, this.walkSequence[endSquare-1].x, this.walkSequence[endSquare-1].y, this.slideSpeed);
          break;
        }
      }
      if(!sliding){
        this.resetTurn();
        this.togglePlayer();
      }
    }
  }
  
  showWinner = () => {
    this.setPlayerID('is the winner!');
    this.resetGameBtn.classList.remove('hidden');
  }
  
  setPlayerID = (msg='') => {
    this.playerDisplay.innerHTML = `${this.activePlayer.id} ${msg}`;
    this.message.innerHTML = "Click dice to play";
    document.body.classList.value = '';
    document.body.classList.add(`player${this.activePlayer.id}`);
  }
  
  resetTurn = () => {
    this.setLocked(false);
  }
  
  slide = (element: any, dX: any, dY: any, dur=1) => {
    gsap.to(element, {x:dX, y:dY, duration:dur, delay: 0.25, onUpdate:this.doOnUpdate, onComplete:this.doOnComplete});
  }
  doOnUpdate = () => {
    this.drawPlayers();
  }
  doOnComplete = () => {
    this.activePlayer.current = this.activePlayer.target;
    this.drawPlayers();
    this.resetTurn();
    this.togglePlayer();
  }
  
  togglePlayer = () => {
    this.activePlayer = this.activePlayer.id === this.player1.id ? this.player2 : this.player1;
    this.setPlayerID();
    
    if(this.activePlayer === this.player2){
      this.rollDice();
    }
  }
  
  rollDice = (evt?: { preventDefault: () => void; }) => {
    if(evt) evt.preventDefault();
    if (this.locked) return;
    this.setLocked(true);
    
    this.message.innerHTML = this.activePlayer === this.player1 ? "Rolling..." : 'Auto rolling...';
    
    this.rollCount = 0;
    this.rollMax = Math.random()*10 + 15;
    this.rolling = setInterval(this.doRoll, this.rollSpeed);
  }
  
  doRoll = () => {
    this.rolled = Math.floor(Math.random() * 6 + 1);
    this.diceRollDisplay(this.rolled);
    if(this.rollCount++ >= this.rollMax){
      clearInterval(this.rolling);
      this.message.innerHTML = "Moving...";
      this.activePlayer.target += this.rolled;
      this.walking = setInterval(this.walk, this.walkSpeed);
    }
  }
  
  diceRollDisplay = (spots: any) => {
    this.diceDisplay.classList = `s${spots}`
  }
  
  resetGame = () => {
    this.player1.current = 0;
    this.player1.target = 0;
    this.player1.x = 0;
    this.player1.y = 0;
    this.player2.current = 0;
    this.player2.target = 0;
    this.player2.x = 0;
    this.player2.y = 0;
    this.activePlayer = this.player1;
    this.locked = false;
    this.diceRollDisplay('');
    this.setPlayerID();
    
    this.drawPlayers();
    
    this.resetGameBtn.classList.add('hidden');
  }
  
  walkSequence = this.boustrophedonWalk(10, 10);
  
  // Test method to show obstacles
  drawObstacles = () => {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for(let i=0; i < this.obstacles.length; i++){
      let ob = this.obstacles[i];
      this.ctx.strokeStyle = ob.type === 'snake' ? '#d00' : '#0d0';
      this.ctx.beginPath();
      this.ctx.moveTo(this.walkSequence[ob.start-1].x+this.gridSize*.5, this.walkSequence[ob.start-1].y+this.gridSize*.5);
      this.ctx.lineTo(this.walkSequence[ob.end-1].x+this.gridSize*.5, this.walkSequence[ob.end-1].y+this.gridSize*.5);
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

}
