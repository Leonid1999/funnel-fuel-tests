import {getRandomEmail, getRandomName, getUUID} from "../utils/generator.utils";

const userCreationPositiveData = [
    {
        testName: 'with name',
        user: {
            id: getUUID(),
            email: getRandomEmail(),
            name: getRandomName()
        }
    },
    {
        testName: 'without name',
        user: {
            id: getUUID(),
            email: getRandomEmail()
        }
    }
];

const userCreationNegativeData = [
    {
        id: '',
        email: '',
        name: ''
    },
    {
        id: 'invalid-id',
        email: 'invalid-email',
        name: '123'
    },
    {
        id: '123',
        email: 'invalid.email',
        name: 'Test'
    },
    {
        id: getUUID(),
        email: 'invalid@',
        name: 'A'
    },
    {
        id: getUUID(),
        email: 'test.email@gmail.com',
        name: 'Test@$!'
    }
];

const findUserNegativeData = [
    {
        testName: 'empty',
        id: ''
    },
    {
        testName: 'only number',
        id: '123'
    },
    {
        testName: 'only characters',
        id: 'invalidId'
    },
    {
        testName: 'length uuid is one character shorter',
        id: `b5c82ed1-12d5-4a0d-b9cc-73cfd5b0981`
    },
    {
        testName: 'length uuid is longer than one character',
        id: `${getUUID()}1`
    }
];

export {userCreationPositiveData, userCreationNegativeData, findUserNegativeData};

