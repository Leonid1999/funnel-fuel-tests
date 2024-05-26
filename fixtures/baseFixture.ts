import { test as base } from '@playwright/test';
import {UserRequests} from "../api/requests/user.requests";
import {HomePage} from "../pages/home.page";
import {QuizPage} from "../pages/quiz.page";
import {Purchase} from "../pages/purchase";
import path from "node:path";

export const testApi = base.extend<{ userRequest: UserRequests }>({
    userRequest: async ({ request }, use) => {
        const userRequest = new UserRequests(request);
        await use(userRequest);
    }
});

export const testUI = base.extend<{ home: HomePage, quiz: QuizPage, purchase: Purchase }>({
    home: async ({page}, use) => {
        const home = new HomePage(page);
        await home.openHomePage();
        await use(home);
    },
    quiz: async ({page}, use) => {
        const quiz = new QuizPage(page);
        await use(quiz);
    },
    purchase: async ({page}, use) => {
        const purchase = new Purchase(page);
        await use(purchase);
    }
});

export const testUIWithQuiz = testUI.extend<{home: HomePage, quiz: QuizPage, purchase: Purchase}>({
    storageState: async ({},use) => {
        const filename = path.resolve("auth.json") as string;
        await use(filename);
    }
});