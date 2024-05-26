import {randomBytes, randomUUID} from "node:crypto";

export const getUUID = (): string => {
    return randomUUID();
}

export const getRandomEmail = (): string => {
    return `test${randomBytes(4).toString('hex')}@gmail.com`;
}

export const getRandomName = (): string => {
    return `Test${randomBytes(4).toString('hex')}`;
}

export const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min)) + min;
}