import {PageHolder} from "./pageHolder";
import {expect, Locator, Page} from "@playwright/test";
import {PaymentComponent} from "../components/payment.component";
import {getRandomNumber} from "../utils/generator.utils";

export class Purchase extends PageHolder {
    private getYourPlanBlock: Locator;
    private getYourButton: Locator;
    private planButton: Locator;
    private planMainInfoBlock: Locator;
    private priceLabel: Locator;
    private fullPriceLabel: Locator;
    private priceWithDiscountLabel: Locator;
    private pricePerDayLabel: Locator;
    private discountLabel: Locator
    paymentForm: PaymentComponent;

    constructor(page: Page) {
        super(page);
        this.getYourPlanBlock = page.locator('[class*=minimal-burger_burgerSectionContent__]');
        this.getYourButton = this.getYourPlanBlock.getByRole('button', {name: 'get your plan'});
        this.planButton = this.getYourPlanBlock.locator('[class*=subscription-card_card__]');
        this.planMainInfoBlock = page.locator('[class*=subscription-card_mainInfo__]');
        this.priceLabel = this.planMainInfoBlock.locator('[class*=subscription-card_secondaryText__]');
        this.fullPriceLabel = this.priceLabel.locator('span:nth-child(1)');
        this.priceWithDiscountLabel = this.priceLabel.locator('span:nth-child(2)');
        this.pricePerDayLabel = page.locator('[class*=subscription-card_cardContentPricePart__]');
        this.discountLabel = page.locator('[class*=subscription-card_discount__]');
        this.paymentForm = new PaymentComponent(page);
    }

    async openPurchasePage() {
        await this.page.goto('/purchase', {
            waitUntil: "domcontentloaded", timeout: 60000
        });
    }

    async clickGetYourPlan() {
        await this.getYourButton.click()
    }

    private async getFullPriceValue(planButton: Locator) {
        const fullPrice = await planButton.locator(this.fullPriceLabel).textContent();
        return Number(fullPrice?.replace('USD', '').trim());
    }

    private async getPriceWithDiscountValue(planButton: Locator) {
        const priceWithDiscount = await planButton.locator(this.priceWithDiscountLabel).textContent();
        return Number(priceWithDiscount?.replace('USD', '').trim());
    }

    private async checkPricePerDay(planButton: Locator) {
        await expect(planButton.locator(this.pricePerDayLabel)).toHaveText(/\d+.\d+USDper day/);
    }

    async selectRandomPlan() {
        const countPlanButtons: number = await this.planButton.count();
        const planButton: Locator = this.planButton.nth(getRandomNumber(0, countPlanButtons - 1))
        await planButton.click()
        return planButton;
    }

    async selectRandomPlanAndCheckPricesWithoutDiscount() {
        const planButton: Locator = await this.selectRandomPlan();
        await expect(planButton.locator(this.priceWithDiscountLabel)).toBeHidden();
        await expect(planButton.locator(this.discountLabel)).toBeHidden();
        await this.checkPricePerDay(planButton);
        const totalPrice: number = await this.getFullPriceValue(planButton);
        return {
            totalPrice: totalPrice
        };
    }

    async selectRandomPlanAndCheckPricesWithDiscount() {
        const planButton: Locator = await this.selectRandomPlan();
        await this.checkPricePerDay(planButton);
        const fullPrice: number = await this.getFullPriceValue(planButton);
        const newPrice: number = await this.getPriceWithDiscountValue(planButton);
        const discountPercentage: number = Math.round(((fullPrice - newPrice) / fullPrice) * 100);
        await expect(planButton.locator(this.discountLabel)).toHaveText(`SAVE - ${discountPercentage}%`);
        return {
            oldPrice: fullPrice,
            newPrice: newPrice,
            discountPercentage: discountPercentage
        };
    }

    async checkAllPlansAndPricesIsDisplayed(withDiscount: boolean) {
        await this.getYourPlanBlock.focus();
        await expect(this.planButton.locator(this.priceLabel)).toHaveCount(3);
        await expect(this.planButton.locator(this.pricePerDayLabel)).toHaveCount(3);
        if (withDiscount) {
            await expect(this.planButton.locator(this.discountLabel)).toHaveCount(1);
        }
    }
}
