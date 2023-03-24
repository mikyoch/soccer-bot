import { Application, Color } from 'pixi.js';
import { Playground } from './Playground';

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	antialias: true,
	backgroundColor: new Color("rgb(74, 161, 118, 1)"),
	width: screenWidth,
	height: screenHeight,
});

let playground = new Playground();
app.stage.addChild(playground);

const resizeScreen = () => {
	screenWidth = window.innerWidth;
	screenHeight = window.innerHeight;
	let ratio = Math.min(screenWidth / 3, screenHeight / 2) * 0.8;
	playground.width = ratio * 3;
	playground.height = ratio * 2;
	playground.x = (screenWidth - playground.width) / 2;
	playground.y = (screenHeight - playground.height) / 2;
}

window.addEventListener("resize", () => {
	resizeScreen();
});

app.ticker.add((delta: number) => {
	playground.onTimer(delta);
})
resizeScreen();