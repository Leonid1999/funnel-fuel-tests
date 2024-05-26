import {PageHolder} from "./pageHolder";
import {Locator, Page} from "@playwright/test";
import {QuestionModal} from "../modals/question.modal";
import {getRandomNumber} from "../utils/generator.utils";

export class QuizPage extends PageHolder {
    private quizForm: Locator;
    private quizProgressBar: Locator;
    private quizProgressValue: Locator;
    private quizAnswerOption: Locator;
    private continueButton: Locator;
    private emailInput: Locator;
    private getMyPlanButton: Locator;
    private goItButton: Locator;
    questionModal: QuestionModal;

    constructor(page: Page) {
        super(page);
        this.quizForm = page.locator('#quiz-page');
        this.quizProgressBar = page.locator('.progress-bar-actions_count__wrmXt');
        this.quizProgressValue = this.quizProgressBar.locator('span');
        this.quizAnswerOption = page.locator('.text-quiz-option-text');
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.emailInput = page.locator('#email');
        this.getMyPlanButton = page.getByRole('button', { name: 'Get my plan' });
        this.goItButton = page.getByRole('button', { name: 'got it' });
        this.questionModal = new QuestionModal(page, page.locator('div.modal_modalContent__RvjD9'));
    }

    async waitQuizForm() {
        await this.quizForm.waitFor();
    }

    private async getTotalQuestionsValue() {
        const progressBarText: string | null = await this.quizProgressBar.textContent();
        if (progressBarText) {
            return Number(progressBarText?.replace(new RegExp('\\d+\\/'), ''));
        }
        return 0;
    }

    private async getRandomQuizOption() {
        const countAnswers = await this.quizAnswerOption.count();
        return this.quizAnswerOption.nth(getRandomNumber(0, countAnswers - 1));
    }

    async selectRandomAnswers() {
        await this.waitQuizForm();
        const totalQuestions: number = await this.getTotalQuestionsValue();
        let progress: number = 0;
        do {
            const answerOption: Locator = await this.getRandomQuizOption();
            await answerOption.click();
            progress++;
            if (progress < totalQuestions)
                await this.quizProgressValue.getByText(progress.toString()).waitFor();
            else
                break;
        } while (await this.quizForm.isVisible())
    }

    async clickContinueButton() {
        await this.continueButton.click();
    }

    async enterEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async clickGetMyPlanButton() {
        await this.getMyPlanButton.click();
    }

    async clickGoItButton() {
        await this.goItButton.click();
    }
}