import { Container, Graphics } from "pixi.js";
import { BALL_INITIAL_SPEED, BALL_MAX_MOVE_TIME, BALL_COLOR, BALL_RADIUS, YARD_WIDTH, YARD_HEIGHT } from "./helpers/const";
import { BALL_STATE } from "./helpers/state";

export class Ball extends Container {
  public sx: number = 0;
  public sy: number = 0;
  public timeElapsed: number = 0;
  public state: BALL_STATE = BALL_STATE.FREE;

  constructor() {
    super();
    let graphics = new Graphics();
    graphics.beginFill(BALL_COLOR);
    graphics.drawCircle(0, 0, BALL_RADIUS);
    graphics.endFill();

    this.addChild(graphics);
  }

  public onTimer(deltaMS: number) {
    if (this.state == BALL_STATE.MOVING) {
      const acc = 0.97;
      this.x += this.sx;
      this.y += this.sy;
      this.sx *= acc * deltaMS;
      this.sy *= acc * deltaMS;
      this.timeElapsed += deltaMS;
      if (this.timeElapsed > BALL_MAX_MOVE_TIME) {
        this.stopMove();
      }
      this.boundaryOperation();
    }
  }

  public startMove(rad: number) {
    this.state = BALL_STATE.MOVING;
    this.timeElapsed = 0;
    this.sx = BALL_INITIAL_SPEED * Math.sin(rad);
    this.sy = -BALL_INITIAL_SPEED * Math.cos(rad);
  }

  public stopMove() {
    this.sx = this.sy = 0;
    this.timeElapsed = 0;
    this.state = BALL_STATE.FREE;
  }

  public boundaryOperation() {
    if (this.x < 0 || this.x > YARD_WIDTH || this.y < 0 || this.y > YARD_HEIGHT) {
      this.stopMove();
      this.x = Math.random() * YARD_WIDTH;
      this.y = Math.random() * YARD_HEIGHT;
    }
    this.x = Math.max(0, this.x);
    this.y = Math.max(0, this.y);
    this.x = Math.min(YARD_WIDTH, this.x);
    this.y = Math.min(YARD_HEIGHT, this.y);
  }
}