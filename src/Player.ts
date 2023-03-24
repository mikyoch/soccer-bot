import { Container, Graphics } from "pixi.js";
import { Ball } from "./Ball";
import { PLAYER_RADIUS, TEAM_RED_COLOR, TEAM_BLUE_COLOR, YARD_WIDTH, YARD_HEIGHT, PLAYER_SPEED } from "./helpers/const";

export class Player extends Container {
  public hasBall: boolean = false;
  public dx: number = 0;
  public dy: number = 1
  public team: string = "red";

  constructor(x = 0, y = 0, team: string = "red") {
    super();
    let graphics = new Graphics();
    graphics.beginFill(team == "red" ? TEAM_RED_COLOR : TEAM_BLUE_COLOR);
    graphics.drawCircle(0, 0, PLAYER_RADIUS);
    graphics.endFill();
    graphics.beginFill(team == "red" ? TEAM_RED_COLOR : TEAM_BLUE_COLOR, 0.7);
    graphics.drawEllipse(0, 0, PLAYER_RADIUS * 2, PLAYER_RADIUS / 2);
    graphics.endFill();

    this.addChild(graphics);

    this.x = x;
    this.y = y;
    this.team = team;
    if (this.team == "red") {
      this.rotation = Math.PI / 2;
      this.dx = 0;
      this.dy = 1;
    } else {
      this.rotation = -Math.PI / 2;
      this.dx = 0;
      this.dy = -1;
    }
  }

  public checkPlayerWithBall(ball: Ball): boolean {
    this.hasBall = Math.hypot(this.x - ball.x, this.y - ball.y) <= PLAYER_RADIUS;
    return this.hasBall;
  }

  public onTimer(deltaMS: number) {
    this.rotation += deltaMS * 0.00;
    this.boundaryOperation();
  }

  public boundaryOperation() {
    this.x = Math.max(0, this.x);
    this.y = Math.max(0, this.y);
    this.x = Math.min(YARD_WIDTH, this.x);
    this.y = Math.min(YARD_HEIGHT, this.y);
  }

  public move(dir: number = 1) {
    this.x += dir * PLAYER_SPEED * Math.sin(this.rotation);
    this.y -= dir * PLAYER_SPEED * Math.cos(this.rotation);
  }
}
