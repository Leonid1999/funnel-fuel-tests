import {PageHolder} from "../pages/pageHolder";
import {expect, FrameLocator, Locator, Page, TestInfo} from "@playwright/test";
import {ErrorComponent} from "./error.component";

export class PaymentComponent extends PageHolder {
    private oldPriceLabel: Locator;
    private discountValueLabel: Locator;
    private totalPriceLabel: Locator;
    private discountInfoMessage: Locator;
    private creditCardButton: Locator;
    private cardNumberInput: Locator;
    private cardExpiryDateInput: Locator;
    private cardCvvInput: Locator;
    private cardHolderInput: Locator;
    private continueButton: Locator;
    private paymentSuccessfulMessage: Locator;
    cardViewErrorMessage: ErrorComponent;
    cartHolderErrorMessage: ErrorComponent;

    constructor(page: Page) {
        super(page);
        const cartHolderDataTestId:string= 'cardHolder';
        this.oldPriceLabel = page.locator('[class*=non-trial-discount-info_value__]');
        this.discountValueLabel = page.locator('[class*=non-trial-discount-info_discountPrice__]');
        this.totalPriceLabel = page.locator('xpath=//*[text()=\'Total\']//..//span');
        this.discountInfoMessage = page.locator('.text-attention p');
        const iframeLocator: FrameLocator = page.frameLocator('#solid-payment-form-iframe');
        this.creditCardButton = page.getByRole('button', { name: 'Credit Card' });
        this.cardNumberInput = iframeLocator.getByTestId('cardNumber').getByRole('textbox');
        this.cardExpiryDateInput = iframeLocator.getByTestId('cardExpiryDate').getByRole('textbox');
        this.cardCvvInput = iframeLocator.getByTestId('cardCvv').getByRole('textbox');
        this.cardHolderInput = iframeLocator.getByTestId(cartHolderDataTestId).getByRole('textbox');
        this.continueButton = iframeLocator.getByTestId('submit-button');
        this.paymentSuccessfulMessage = page.getByTestId('success-status-page-title');
        this.cardViewErrorMessage = new ErrorComponent(page, iframeLocator.locator('.body_errors'));
        this.cartHolderErrorMessage = new ErrorComponent(page, iframeLocator.getByTestId(cartHolderDataTestId));
    }

    async assertionPaymentPricesWithoutDiscount(totalPrice: number) {
        for (const paymentItem of [this.oldPriceLabel, this.discountValueLabel, this.discountInfoMessage]) {
            await expect(paymentItem).toBeHidden();
        }
        await expect(this.totalPriceLabel).toHaveText(`${totalPrice} USD`);
    }

    async assertionPaymentPricesWithDiscount(oldPrice: number, newPrice: number, discountPercentage: number) {
        const discountValue: string = (oldPrice - newPrice).toFixed(2);
        await expect(this.oldPriceLabel).toHaveText(`${oldPrice} USD`);
        await expect(this.discountValueLabel).toHaveText(`-${(discountValue)} USD`);
        await expect(this.totalPriceLabel).toHaveText(`${(newPrice)} USD`);
        await expect(this.discountInfoMessage).toHaveText(`You just saved USD ${discountValue} (${discountPercentage}% off)`);
    }

    async clickCreditCardButton(){
        await this.creditCardButton.click();
    }

    async enterPaymentData(paymentData: PaymentData) {
        await this.cardNumberInput.fill(paymentData.number);
        await this.cardExpiryDateInput.fill(paymentData.expireDate);
        await this.cardCvvInput.fill(paymentData.cvv);
        await this.cardHolderInput.fill(paymentData.holder);
    }

    async clickContinueButton() {
        await this.continueButton.click();
    }

    async paymentIsSuccessful() {
        await expect(this.paymentSuccessfulMessage).toHaveText('Payment successful');
    }

    async attachScreenshot(testInfo: TestInfo) {
        const screenshot = await this.page.screenshot();
        await testInfo.attach('screenshot', {body: screenshot, contentType: 'image/png'});
    }
}

export interface PaymentData {
    number: string,
    expireDate: string,
    cvv: string,
    holder: string
}