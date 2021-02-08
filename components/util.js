


export const dealWithPercentage = (input) => {
    var result;
    if (input.includes("%")) {
        return parseFloat(input.slice(0, -1)) / 100;
    }
    return parseFloat(input) / 100;
}

export const parseCurrency = (input) => {
    return Number(input.replace(/[^0-9\.-]+/g,""));
}