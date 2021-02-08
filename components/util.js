

export const isInt = (n) => {
    return Number(n) === n && n % 1 === 0;
}

export const isFloat = (n) => {
    return Number(n) === n && n % 1 !== 0;
}


export const dealWithPercentage = (input) => {
    var result;
    if (input.includes("%")) {
        return parseFloat(input.slice(0, -1)) / 100;
    }
    return parseFloat(input) / 100;
}

export const parseCurrency = (input) => {
	if (isInt(input) || isFloat(input)) {
		return input;
	}
    return Number(input.replace(/[^0-9\.-]+/g,""));
}