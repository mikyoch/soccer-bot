import { Container, Graphics } from "pixi.js";
import { Player } from "./Player";
import { YARD_HEIGHT, YARD_WIDTH, UNIT, FEET, YARD_COLOR, PLAYER_RADIUS, BALL_RADIUS, PLAYER_ROTATION_SPEED, initialPosition, PLAYER_SPEED } from "./helpers/const";
import { Ball } from "./Ball";

export class Playground extends Container {
  private players: Player[] = [];
  private currentPlayerId: number = -1;
  private keys: any = {};
  private ball: Ball = new Ball();
  private ballHoldingTeam: string = "none";

  constructor() {
    super();
    let graphics = new Graphics();
    // graphics.x = 30;
    // graphics.y = 20;
    graphics.beginFill(YARD_COLOR);
    graphics.lineStyle(3, 0xffffff, 1);
    graphics.drawRect(0, 0, YARD_WIDTH, YARD_HEIGHT);
    graphics.endFill();
    graphics.moveTo(YARD_WIDTH / 2, 0);
    graphics.lineTo(YARD_WIDTH / 2, YARD_HEIGHT);
    graphics.drawRect(0, 18 * UNIT, 18 * UNIT, 44 * UNIT);
    graphics.drawRect(YARD_WIDTH - 18 * UNIT, 18 * UNIT, 18 * UNIT, 44 * UNIT);
    graphics.drawRect(0, 30 * UNIT, 6 * UNIT, 20 * UNIT);
    graphics.drawRect(YARD_WIDTH - 6 * UNIT, 30 * UNIT, 6 * UNIT, 20 * UNIT);
    graphics.drawCircle(YARD_WIDTH / 2, YARD_HEIGHT / 2, 10 * UNIT);
    graphics.drawRect(-8 * FEET, (YARD_HEIGHT - 24 * FEET) / 2, 8 * FEET, 24 * FEET);
    graphics.drawRect(YARD_WIDTH, (YARD_HEIGHT - 24 * FEET) / 2, 8 * FEET, 24 * FEET);
    graphics.moveTo(18 * UNIT, 31 * UNIT);
    graphics.quadraticCurveTo(25 * UNIT, 40 * UNIT, 18 * UNIT, 49 * UNIT);
    graphics.moveTo(102 * UNIT, 31 * UNIT);
    graphics.quadraticCurveTo(95 * UNIT, 40 * UNIT, 102 * UNIT, 49 * UNIT);
    graphics.beginFill("0xfff");
    graphics.drawCircle(12 * UNIT, 40 * UNIT, 3);
    graphics.drawCircle(60 * UNIT, 40 * UNIT, 3);
    graphics.drawCircle(108 * UNIT, 40 * UNIT, 3);
    graphics.endFill();

    this.addChild(graphics);
    Object.keys(initialPosition).forEach((team: string) => {
      for (let pos of initialPosition[team]) this.players.push(new Player(pos.x, pos.y, team));
    });
    for (let player of this.players)
      this.addChild(player);
    this.ball.x = YARD_WIDTH / 2;
    this.ball.y = YARD_HEIGHT / 2;
    this.addChild(this.ball);

    this.currentPlayerId = 5;
    window.addEventListener("keydown", (e) => this.onKeyDown(e));
    window.addEventListener("keyup", (e) => this.onKeyUp(e));
  }

  private onKeyDown(e: KeyboardEvent) {
    this.keys[e.key] = true;
  }

  private onKeyUp(e: KeyboardEvent) {
    this.keys[e.key] = false;
  }

  private controlCurrentPlayer(deltaMS: number) {
    // movement
    let currentPlayer = this.players[this.currentPlayerId];

    let dir = 0;
    if (this.keys["ArrowRight"]) {
      currentPlayer.rotation += PLAYER_ROTATION_SPEED;
    }
    if (this.keys["ArrowLeft"]) {
      currentPlayer.rotation -= PLAYER_ROTATION_SPEED;
    }
    if (this.keys["ArrowDown"]) {
      dir = -1;
    }
    if (this.keys["ArrowUp"]) {
      dir = 1;
    }
    currentPlayer.move(dir * deltaMS);

    // kick the ball
    if (this.keys["a"] && currentPlayer.hasBall) {
      this.ball.startMove(currentPlayer.rotation);
      currentPlayer.hasBall = false;
    }
  }

  private updatePlayground() {
    // ball owner
    this.ballHoldingTeam = "none";
    for (let player of this.players)
      if (player.checkPlayerWithBall(this.ball)) {
        this.ball.stopMove();
        this.ballHoldingTeam = player.team;
        this.ball.x = player.x + (PLAYER_RADIUS - BALL_RADIUS) * 0.8 * Math.sin(player.rotation);
        this.ball.y = player.y - (PLAYER_RADIUS - BALL_RADIUS) * 0.8 * Math.cos(player.rotation);
      }
    this.teamAction();
    if (this.ballHoldingTeam == "red") {
      this.ball.x = Math.random() * 1200;
      this.ball.y = Math.random() * 800;
    }
  }

  private teamAction() {
    // this.manageHolderTeam();
    // this.manageNonHolderTeam();
    this.blueAction();
  }

  private blueAction() {
    if (this.ballHoldingTeam != "blue") this.trackBall("blue");
    else {
      for (let player of this.players)
        if (player.hasBall && player.team == "blue") {
          let goalRad = Math.atan2((0 - player.x), -(400 - player.y));
          this.ball.startMove(goalRad);
        }
    }
  }

  public getPlayersByTeam(team: string) {
    let players: Player[] = [];
    for (let player of this.players)
      if (player.team == team) players.push(player);
    return players;
  }

  // private manageHolderTeam() {
  //   // let players = this.getPlayersByTeam(this.ballHoldingTeam);
  // }
  // private manageNonHolderTeam() {
  //   // let players = this.getPlayersByTeam(this.ballHoldingTeam);
  // }

  private trackBall(team: string) {
    let players = this.getPlayersByTeam(team);
    let nearestPlayer = players[0];
    let distance = 1e100;
    for (let player of players) {
      let curDistance = Math.hypot(this.ball.x - player.x, this.ball.y - player.y);
      if (curDistance < distance) {
        nearestPlayer = player;
        distance = curDistance;
      }
    }
    for (let player of players) {
      let goalRad = Math.atan2(-(player.x - this.ball.x), (player.y - this.ball.y));
      // if (Math.sign(Math.sin(player.rotation)) != Math.sign(this.ball.x - player.x)) goalRad = goalRad - Math.PI;
      player.rotation = goalRad;
    }
    nearestPlayer.move(PLAYER_SPEED);
  }

  public onTimer(deltaMS: number) {
    this.updatePlayground();
    this.controlCurrentPlayer(deltaMS);

    for (let player of this.players) player.onTimer(deltaMS);
    this.ball.onTimer(deltaMS);
  }
}