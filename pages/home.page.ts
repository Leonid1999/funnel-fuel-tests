import {Locator, Page} from "@playwright/test";
import {PageHolder} from "./pageHolder";
import {getRandomNumber} from "../utils/generator.utils";

export class HomePage extends PageHolder {
    private bodyTypeButton: Locator;

    constructor(page: Page) {
        super(page);
        this.bodyTypeButton = page.locator('[class*=home-dream-page_options__]').getByRole('button');
    }

    async openHomePage() {
        await this.page.goto('/', {
            waitUntil: "domcontentloaded" , timeout: 60000
        });
    }

    async startQuizWithRandomBodyType() {
        const countButtons = await this.bodyTypeButton.count();
        await this.bodyTypeButton.nth(getRandomNumber(0, countButtons - 1)).click();
    }
}