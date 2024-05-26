import {PageHolder} from "../pages/pageHolder";
import {expect, Locator, Page} from "@playwright/test";

export class ErrorComponent extends PageHolder {
    private errorMessage: Locator;

    constructor(page: Page, parentLocator: Locator) {
        super(page);
        this.errorMessage = parentLocator.locator('.error-text');
    }

    async assertionErrorMessage(errors: string[]){
        for (const error of errors) {
            await expect(this.errorMessage.filter({hasText: new RegExp(`${error}`)})).toBeVisible();
        }
    }
}