import {APIResponse, expect} from "@playwright/test";
import {testApi} from "../../fixtures/baseFixture";
import {getUUID} from "../../utils/generator.utils";
import {findUserNegativeData, userCreationNegativeData, userCreationPositiveData} from "../../data/user.data";

testApi.describe('User API positive tests', () => {
    let createdUserId: string;

    for (const {testName, user} of userCreationPositiveData) {
        testApi(`[POST] User creation ${testName}`, async ({userRequest}) => {
            const response: APIResponse = await userRequest.create(user);

            expect(response.status()).toBe(201);
            createdUserId = user.id;
            expect(await response.json()).toEqual({
                id: user.id,
                email: user.email,
                name: user.name ? user.name : '',
                createdAt: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/)
            });
        });
    }

    testApi('[GET] Find user exist', async ({userRequest}) => {
        expect(createdUserId).toBeDefined();
        const response: APIResponse = await userRequest.find(createdUserId);

        expect(response.status()).toBe(200);
        expect(await response.text()).toEqual('true');
    });

    testApi('[GET] Find user not found', async ({userRequest}) => {
        const response: APIResponse = await userRequest.find(getUUID());

        expect(response.status()).toBe(200);
        expect(await response.text()).toEqual('false');
    });
});

testApi.describe.parallel('User API negative tests', () => {

    for (const {id, email, name} of userCreationNegativeData) {
        testApi(`[POST] User creation validation with: email: '${email}', name: '${name}'`, async ({userRequest}) => {
            const response: APIResponse = await userRequest.create({id, email, name});

            expect(response.status()).toBe(400);
            expect(await response.json()).toEqual({
                statusCode: 400,
                message: '[UserService]Create user was failed',
                error: 'Bad Request',
            });
        });
    }

    for (const {testName, id} of findUserNegativeData) {
        testApi(`[GET] Find user validation with id: ${testName}`, async ({userRequest}) => {
            const response: APIResponse = await userRequest.find(id);

            expect(response.status()).toBe(404);
            expect(await response.json()).toEqual({
                statusCode: 404,
                message: `[UserService] Can not find user with id: ${id}`,
                error: 'Not Found',
            });
        });
    }
});
