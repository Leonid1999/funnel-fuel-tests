const paymentNegativeData = [
    {
        paymentData: {
            number: '',
            expireDate: '',
            cvv: '',
            holder: ''
        },
        errors: {
            cardView: ['Enter your card number', 'Enter your card expiration date', 'Enter your card\'s security code'],
            cartHolder: ['Field is required']
        }
    },
    {
        paymentData: {
            number: '1234123412341234',
            expireDate: '12/23',
            cvv: 'ABC',
            holder: 'MR'
        },
        errors: {
            cardView: ['Your card number is not valid', 'The expiration date has already passed', 'Enter your card\'s security code'],
            cartHolder: ['The cardholder\'s name is required']
        }
    },
    {
        paymentData: {
            number: '4242',
            expireDate: '12/80',
            cvv: '12',
            holder: 'TEST.'
        },
        errors: {
            cardView: ['Your card number is incomplete', 'Your card expiry date is not valid', 'Your card\'s security code is incomplete'],
            cartHolder: ['The cardholder\'s name is required']
        }
    },
    {
        paymentData: {
            number: '4242424242424242442',
            expireDate: '23/24',
            cvv: '12344',
            holder: 'TEST-'
        },
        errors: {
            cardView: ['Your card number is not valid', 'Your card expiry date is not valid'],
            cartHolder: ['The cardholder\'s name is required']
        }
    }
];

export {paymentNegativeData};