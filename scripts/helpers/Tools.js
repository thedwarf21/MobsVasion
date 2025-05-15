class Tools {
	static radomValueInRange(min_value, max_value) {
		return Math.floor( Math.random() * (max_value - min_value + 1) ) + min_value;
	}
	
	static getFibonacciValue(level_0_value, coef, level) {
		const prev_values = [];
		for (let i=0; i<level+1; i++) {
			let value;
			if (i === 0)
				value = level_0_value;
			else if (i === 1)
				value = level_0_value * coef;
			else value = prev_values[0] + prev_values[1];
			prev_values.unshift(value);
		}
		return prev_values.shift();
	}

	static getRandomMessage(isVictory) {
		const random_messages = isVictory ? NPC_RANDOM_DIALOGS.victory : NPC_RANDOM_DIALOGS.defeat;
		return random_messages[ Tools.radomValueInRange(0, random_messages.length - 1) ];
	}

	static intToHumanReadableString(value) {
		let display_number = value;
		let display_unit = "";

		if (value > 10**12) {
			display_number = value / 10**12;
			display_unit = "T";
		} else if (value > 10**9) {
			display_number = value / 10**9;
			display_unit = "B";
		} else if (value > 10**6) {
			display_number = value / 10**6;
			display_unit = "M";
		} else if (value > 10**3){
			display_number = value / 10**3;
			display_unit = "k";
		}

		return Tools.prepareFloatForDisplay(display_number, display_unit);
	}

	static prepareFloatForDisplay(number, unit) {
		if (number === Math.floor(number))
			return number + unit;
		
		return number.toFixed(2) + unit;
	}
}