import { Color } from "pixi.js";

export const YARD_WIDTH = 1200;
export const YARD_HEIGHT = 800;

export const UNIT = 10;
export const FEET = 10 / 3;

export const PLAYER_RADIUS = 12;
export const BALL_RADIUS = 5;

export const YARD_COLOR = new Color("rgb(74, 161, 118, 1)");
export const TEAM_RED_COLOR = new Color("rgb(250, 57, 48, 1)");
export const TEAM_BLUE_COLOR = new Color("rgb(52, 66, 92, 1)");
export const BALL_COLOR = new Color("rgb(255, 255, 0, 1)");

export const PLAYER_SPEED = 1.2;
export const PLAYER_ROTATION_SPEED = 0.03;
export const BALL_INITIAL_SPEED = 20;

export const BALL_MAX_MOVE_TIME = 100;

export const initialPosition: any = {
  "red": [
    { x: 2 * UNIT, y: 40 * UNIT },
    { x: 20 * UNIT, y: 16 * UNIT },
    { x: 20 * UNIT, y: 40 * UNIT },
    { x: 20 * UNIT, y: 64 * UNIT },
    { x: 50 * UNIT, y: 20 * UNIT },
    { x: 40 * UNIT, y: 40 * UNIT },
    { x: 50 * UNIT, y: 60 * UNIT },
  ],
  "blue": [
    { x: 118 * UNIT, y: 40 * UNIT },
    { x: 100 * UNIT, y: 16 * UNIT },
    { x: 100 * UNIT, y: 40 * UNIT },
    { x: 100 * UNIT, y: 64 * UNIT },
    { x: 70 * UNIT, y: 20 * UNIT },
    { x: 80 * UNIT, y: 40 * UNIT },
    { x: 70 * UNIT, y: 60 * UNIT },
  ],
}