let speed = 1;

class Main {
	static init(selector) {
		this.canvas = $(selector)[0];
		this.ctx = this.canvas.getContext("2d");
		this.adjust();
	}

	static resize(factor = 1) {
		this.canvas.width = window.innerWidth * factor;
		this.canvas.height = window.innerHeight * factor;
		this.canvas.style.width = `${window.innerWidth}px`;
		this.canvas.style.height = `${window.innerHeight}px`;
	}

	static adjust() {
		console.log("hi.");
		const ratio = window.devicePixelRatio;

		if (1 < ratio) {
			this.resize(ratio);
			return true;
		}

		this.resize(1);
		return false;
	}

	static render() {

	}
}

$(() => {
	Main.init("canvas");
});

$(window).on("resize", () => Main.adjust());