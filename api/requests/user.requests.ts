import {APIRequestContext} from "@playwright/test";
import {UserRequest} from "../models/user.model";

export class UserRequests {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async create(user: UserRequest) {
        return await this.request.post(
            '/user',
            {
                data: user
            }
        )
    }

    async find(id: string){
        return await this.request.get(
            `/user/${id}`
        )
    }
}