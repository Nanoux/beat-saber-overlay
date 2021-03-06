const ui = (() => {
	var main = document.getElementById("overlay");

	const performance = (() => {
		var rank = document.getElementById("rank");
		var percentage = document.getElementById("percentage");
		var score = document.getElementById("score");
		var combo = document.getElementById("combo");

		function format(number) {
			return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}

		return (data) => {
			score.innerText = format(data.score);
			combo.innerText = data.combo;
			rank.innerText = data.rank;
			percentage.innerText = (data.currentMaxScore > 0 ? (Math.floor((data.score / data.currentMaxScore) * 1000) / 10) : 0) + "%";
		}
	})();

	const timer = (() => {
		const radius = 30;
		const circumference = radius * Math.PI * 2;

		var bar = document.getElementById("progress");
		var text = document.getElementById("progress-text");

		var active = false;

		var began;
		var duration;
		var rate;

		var display;

		function format(time) {
			var minutes = Math.floor(time / 60);
			var seconds = time % 60;

			if (seconds < 10) {
				seconds = "0" + seconds;
			}

			return `${minutes}:${seconds}`;
		}

		function update(time) {
			time = time || Date.now();

			var delta = (time - began)*rate;

			var progress = Math.floor(delta / 1000);
			var percentage = Math.min(delta / (duration*rate), 1);

			bar.setAttribute("style", `stroke-dashoffset: ${(1 - percentage) * circumference}px`);

			// Minor optimization
			if (progress != display) {
				display = progress;
				text.innerText = format(progress);
			}
		}

		function loop() {
			if (active) {
				update();
				requestAnimationFrame(loop);
			}
		}

		return {
			start(time, length, songSpeedMultiplier) {
				active = true;
				
				began = time;
				duration = length;
				rate = songSpeedMultiplier || rate || 1;

				loop();
			},

			pause(time) {
				active = false;

				update(time);
			},

			stop() {
				active = false;
				began = undefined;
				duration = undefined;
			}
		}
	})();

	const beatmap = (() => {
		var cover = document.getElementById("image");

		var title = document.getElementById("title");
		var subtitle = document.getElementById("subtitle");
		var artist = document.getElementById("artist");

		var difficulty = document.getElementById("difficulty");
		var bpm = document.getElementById("bpm");
		var speed = document.getElementById("speed");

		function format(number) {
			if (Number.isNaN(number)) {
				return "NaN";
			}

			if (Math.floor(number) !== number) {
				return number.toFixed(2);
			}

			return number.toString();
		}

		return (data, time, data2) => {
			if (data.difficulty === "ExpertPlus") {
				data.difficulty = "Expert+";
			}
			
			var mul = data2.songSpeedMultiplier * 100;
			mul = mul.toFixed(0);

			cover.setAttribute("src", `data:image/png;base64,${data.songCover}`);

			title.innerText = data.songName;
			subtitle.innerText = data.songSubName;
			artist.innerText = data.songAuthorName;

			difficulty.innerText = data.difficulty;
			bpm.innerText = `${format(data.songBPM)} BPM`;
			speed.innerText = mul + "% Speed";

			timer.start(Date.now(), data.length,data2.songSpeedMultiplier);
		}
	})();

	return {
		hide() {
			main.classList.add("hidden");
		},

		show() {
			main.classList.remove("hidden");
		},

		performance,
		timer,
		beatmap
	}
})();
