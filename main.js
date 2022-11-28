// I really ought to document this, but it's like 3:11 AM and I'm tired

// -5 10 5 10 500

let unspeed = -5;
let size = 15;
let spacing = -5;
let ratio = 10;
let range = 500;
let stretchRatio = 1;

// -7 30 [0.05, 0.8] "opaque" "h"
let colorUnspeed = 20;
let colorStretch = 30;
let colorRange = [0.03, 0.5];
let colorMode = "transparent";
let direction = "v";
let align = "r";
let margin = 100;

let breadth, stretch;

const {floor, ceil, round, abs, sin, cos, PI: pi} = Math;

let getColor;
if (colorMode == "transparent") {
	getColor = (shift) => `rgba(255, 255, 255, ${shift})`;
} else {
	getColor = (shift) => {
		const floored = floor(shift * 255);
		return `rgb(${floored}, ${floored}, ${floored})`;
	}
}

function remap(value, oldMin, oldMax, newMin, newMax) {
	return (value - oldMin) / (oldMax - oldMin) * (newMax - newMin) + newMin;
}

class Main {
	static init(selector) {
		this.canvas = $(selector)[0];
		this.ctx = this.canvas.getContext("2d");
		this.adjust();
	}

	static resize(factor = 1) {
		const newWidth = window.innerWidth * factor;
		const newHeight = window.innerHeight * factor;

		stretch = window.innerHeight / 6 * window.devicePixelRatio * stretchRatio;
		breadth = stretch / ratio;

		if (this.width == newWidth && this.height == newHeight) {
			return;
		}

		this.width = newWidth;
		this.height = newHeight;
		this.canvas.style.width = `${window.innerWidth}px`;
		this.canvas.style.height = `${window.innerHeight}px`;
	}

	static adjust() {
		const pixelRatio = window.devicePixelRatio;

		if (1 < pixelRatio) {
			this.resize(pixelRatio);
			return true;
		}


		this.resize(1);
		return false;
	}

	static get width() { return this.canvas.width; }
	static get height() { return this.canvas.height; }
	static set width(to) { this.canvas.width = to; }
	static set height(to) { this.canvas.height = to; }

	static get midX() {
		if (align == "r") {
			return this.width - floor(stretch) - margin;
		}
		
		return floor(this.width / 2);
	}

	static get midY() { return floor(this.height / 2); }

	static clear() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	}

	static fill(color) {
		this.ctx.fillStyle = color;
		this.ctx.fill();
	}

	static stroke(color, thicc /* sorry. */) {
		this.ctx.strokeStyle = color;
		
		if (thicc) {
			// when the stroke line thicc 😩
			this.ctx.lineWidth = thicc;
		}

		this.ctx.stroke();
	}

	static circle(xOffset = 0, y = 0, radius = size, color = "#fff") {
		this.ctx.beginPath();
		if (direction == "h") {
			this.ctx.arc(floor(y), floor(this.midY + xOffset), radius, 0, 2 * pi);
		} else {
			this.ctx.arc(floor(this.midX + xOffset), floor(y), radius, 0, 2 * pi);
		}

		this.ctx.closePath();
		this.fill(color);
	}

	static line(x1, y1, x2, y2, color = "#fff", width = 1.5 * size) {
		this.ctx.beginPath();
		if (direction == "h") {
			this.ctx.moveTo(floor(y1), floor(this.midY + x1));
			this.ctx.lineTo(floor(y2), floor(this.midY + x2));
		} else {
			this.ctx.moveTo(floor(this.midX + x1), floor(y1));
			this.ctx.lineTo(floor(this.midX + x2), floor(y2));
		}
		this.ctx.closePath();
		this.stroke(color, width);
	}

	static render() {
		const {ctx} = this;

		this.clear();

		const n = this.visiblePairs * 2;
		const gap = size + spacing;

		const shiftS = [];
		const shiftC = [];
		const time = [];

		for (let i = 0; i < n; i++) {
			shiftS.push(remap(cos((i + (new Date().getTime() / colorUnspeed)) / colorStretch), -1, 1, ...colorRange));
			shiftC.push(remap(sin((i + (new Date().getTime() / colorUnspeed)) / colorStretch), -1, 1, ...colorRange));
			time.push(new Date().getTime() / unspeed);
		}

		let prev = [remap(sin(2 * pi * (time[0] % range) / range), -1, 1, -stretch, stretch), 0];

		for (let i = 0; i < n; i++) {
			const x = remap(sin(i / breadth + 2 * pi * (time[i] % range) / range), -1, 1, -stretch, stretch);
			const y = i * gap;
			this.line(...prev, x, y, getColor(shiftS[i]));
			prev = [x, y];
		}

		prev = [remap(cos(2 * pi * (time[0] % range) / range), -1, 1, -stretch, stretch), 0];

		for (let i = 0; i < n; i++) {
			const x = remap(cos(i / breadth + 2 * pi * (time[i] % range) / range), -1, 1, -stretch, stretch);
			const y = i * gap;
			this.line(...prev, x, y, getColor(shiftC[i]));
			prev = [x, y];
		}
	}

	static get visiblePairs() {
		return ceil((direction == "h"? this.width : this.height) / (size + spacing));
	}
}

class BasePair {
	constructor(y = 0, z = 0) {
		this.y = y;
		this.z = z;
	}

	render() {
		const {ctx} = Main;
	}
}

$(() => {
	Main.init("canvas");

	const renderLoop = () => {
		Main.render();
		window.requestAnimationFrame(renderLoop);
	}

	renderLoop();
});

$(window).on("resize", () => Main.adjust());
