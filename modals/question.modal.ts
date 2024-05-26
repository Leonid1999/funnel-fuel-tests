import {PageHolder} from "../pages/pageHolder";
import {Locator, Page} from "@playwright/test";

export class QuestionModal extends PageHolder {
    private modalElement: Locator;
    private yesButton: Locator;
    private noButton: Locator;

    constructor(page: Page, parentLocator: Locator) {
        super(page);
        this.modalElement = parentLocator;
        this.yesButton = this.modalElement.getByRole('button', { name: 'Yes' });
        this.noButton = this.modalElement.getByRole('button', { name: 'No' });
    }

    private async popupHandlerByLocator(locator: Locator) {
        await this.page.addLocatorHandler(locator, async overlay => {
            await overlay.click();
        }, { times: 3, noWaitAfter: true });
    }

    async acceptAllModals() {
        await this.popupHandlerByLocator(this.yesButton);
    }

    async dismissAllModals() {
        await this.popupHandlerByLocator(this.noButton);
    }
}