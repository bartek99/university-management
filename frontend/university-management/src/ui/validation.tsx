const checkSum = (digits: number[]) => {
    const digit11 = digits[10];
    digits.pop();

    const times = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    const reducer = (accumulator: number, currentValue: number, index: number) => accumulator + (currentValue * times[index]);

    let sum = digits.reduce(reducer);

    sum %= 10;
    sum = 10 - sum;
    sum %= 10;

    if (sum === digit11) {
        return true;
    } else {
        return false;
    }
}

function peselToDigits(value: string): number[] {
    return value.split("").map(item => parseInt(item))
}

export function validatePesel(value: string): boolean {
    const digits = peselToDigits(value);

    if (digits.length !== 11 && digits.every(item => !isNaN(item))) {
        return false;
    }

    return checkSum(digits);
}

