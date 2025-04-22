class MV_Tools {
	static radomValueInRange(min_value, max_value) {
		return Math.floor( Math.random() * (max_value - min_value + 1) ) + min_value;
	}
	
	static getFibonacciValue(level_0_value, coef, level) {
		let prev_values = [];
		for (let i=0; i<level+1; i++) {
			let value;
			if (i == 0)
				value = level_0_value;
			else if (i == 1)
				value = level_0_value * coef;
			else value = prev_values[0] + prev_values[1];
			prev_values.unshift(value);
		}
		return prev_values.shift();
	}

	static getRandomMessage(isVictory) {
		let random_messages = isVictory ? NPC_RANDOM_DIALOGS.victory : NPC_RANDOM_DIALOGS.defeat;
		return random_messages[ MV_Tools.radomValueInRange(0, random_messages.length - 1) ];
	}

	static intToHumanReadableString(value) {
		if (value > 10**13)
			return Math.floor(value / 10**12) + "T";
		if (value > 10**10)
			return Math.floor(value / 10**9) + "B";
		if (value > 10**7)
			return Math.floor(value / 10**6) + "M";
		if (value > 10**4)
			return Math.floor(value / 10**3) + "k";
		return value;
	}
}