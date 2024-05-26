import {getRandomEmail} from "../../utils/generator.utils";
import {PaymentData} from "../../components/payment.component";
import {paymentNegativeData} from "../../data/payment.data";
import {testUI, testUIWithQuiz} from "../../fixtures/baseFixture";

const paymentData: PaymentData = {
    number: '5200828282828210',
    expireDate: '12/43',
    cvv: '777',
    holder: 'TESTER'
};

testUI('Get plan with discount', async ({home, quiz, purchase}) => {
    await home.startQuizWithRandomBodyType();
    await quiz.selectRandomAnswers();
    await quiz.questionModal.acceptAllModals();
    await quiz.clickContinueButton();
    await quiz.enterEmail(getRandomEmail());
    await quiz.clickGetMyPlanButton();
    await quiz.clickGoItButton();
    await purchase.checkAllPlansAndPricesIsDisplayed(true);
    const prices = await purchase.selectRandomPlanAndCheckPricesWithDiscount();
    await purchase.clickGetYourPlan();
    await purchase.paymentForm.assertionPaymentPricesWithDiscount(prices.oldPrice, prices.newPrice, prices.discountPercentage);
    await purchase.paymentForm.clickCreditCardButton();
    await purchase.paymentForm.enterPaymentData(paymentData);
    await purchase.paymentForm.clickContinueButton();
    await purchase.paymentForm.paymentIsSuccessful();
});

testUIWithQuiz('Get plan without discount', async ({purchase}) => {
    await purchase.openPurchasePage();
    await purchase.checkAllPlansAndPricesIsDisplayed(false);
    const prices = await purchase.selectRandomPlanAndCheckPricesWithoutDiscount();
    await purchase.clickGetYourPlan();
    await purchase.paymentForm.assertionPaymentPricesWithoutDiscount(prices.totalPrice);
    await purchase.paymentForm.clickCreditCardButton();
    await purchase.paymentForm.enterPaymentData(paymentData);
    await purchase.paymentForm.clickContinueButton();
    await purchase.paymentForm.paymentIsSuccessful();
});

for (const {paymentData, errors} of paymentNegativeData) {
    testUIWithQuiz(`Payment form validation with: card: '${paymentData.number}', date: '${paymentData.expireDate}', cvv: '${paymentData.cvv}', name: '${paymentData.holder}'`, async ({purchase}, testInfo) => {
        await purchase.openPurchasePage();
        await purchase.clickGetYourPlan();
        await purchase.paymentForm.clickCreditCardButton();
        await purchase.paymentForm.enterPaymentData(paymentData);
        await purchase.paymentForm.clickContinueButton();
        await purchase.paymentForm.cardViewErrorMessage.assertionErrorMessage(errors.cardView);
        await purchase.paymentForm.cartHolderErrorMessage.assertionErrorMessage(errors.cartHolder);
        await purchase.paymentForm.attachScreenshot(testInfo)
    });
}