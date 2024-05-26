import {Page} from "@playwright/test";

export abstract class PageHolder {
    protected constructor(protected page: Page) {}
}
