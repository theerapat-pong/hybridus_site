import generatePayload from 'promptpay-qr';

const E_WALLET_ID = '004999036911146';

// Use our API route to handle SlipOK API calls (avoids CORS issues)
const VERIFY_SLIP_URL = '/api/verify-slip-v3';

export interface VerificationResult {
    success: boolean;
    errorKey?: string;
}

/**
 * Generates a randomized amount based on a 5 THB base price.
 * e.g., 5.01, 5.87. This helps prevent replay attacks with old slips.
 * @returns {number} A randomized amount between 5.01 and 5.99.
 */
export const generateRandomAmount = (): number => {
    const randomCents = Math.floor(Math.random() * 99) + 1; // 1 to 99
    const amount = 5 + randomCents / 100;
    return parseFloat(amount.toFixed(2));
};

/**
 * Generates the string payload for a PromptPay QR code.
 * @param amount - The amount for the transaction.
 * @returns {string} The PromptPay payload string.
 */
export const generatePromptPayPayload = (amount: number): string => {
    return generatePayload(E_WALLET_ID, { amount });
};


/**
 * Verifies a payment slip using the SlipOK API, according to the official documentation.
 * @param slipFile The image file of the slip.
 * @param expectedAmount The amount that should be on the slip.
 * @returns {Promise<VerificationResult>} Result of the verification.
 */
export const verifySlip = async (slipFile: File, expectedAmount: number): Promise<VerificationResult> => {
    const formData = new FormData();
    formData.append('files', slipFile);
    // Add amount and log as per the documentation for better verification and preventing replays
    formData.append('amount', expectedAmount.toString());
    formData.append('log', 'true');

    console.log('Verifying slip with SlipOK API:', {
        amount: expectedAmount,
        fileName: slipFile.name,
        fileSize: slipFile.size,
        apiUrl: VERIFY_SLIP_URL
    });

    try {
        const response = await fetch(VERIFY_SLIP_URL, {
            method: 'POST',
            body: formData, // Don't set Content-Type header, let browser set it with boundary
        });

        console.log('SlipOK API Response Status:', response.status, response.statusText);

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('SlipOK API returned non-JSON response:', await response.text());
            return { success: false, errorKey: 'errorVerificationFailed' };
        }

        const result = await response.json();
        console.log('SlipOK API Response Data:', result);

        // Check HTTP status code first for success/failure
        if (!response.ok) {
            console.error('SlipOK API Error Response:', result);
            // Map SlipOK error codes to our internal error keys
            if (result.code) {
                switch (result.code) {
                    case 1012: // Repeated slip
                        return { success: false, errorKey: 'errorDuplicateSlip' };
                    case 1013: // The amount sent is not the same with the amount of the slip
                        return { success: false, errorKey: 'errorAmountMismatch' };
                    case 1002: // Incorrect Authorization Header
                    case 1001: // No branch found
                        return { success: false, errorKey: 'errorVerificationFailed' };
                    case 1005: // Not image file
                    case 1006: // Incorrect image
                    case 1007: // No QR Code image
                        return { success: false, errorKey: 'errorInvalidSlip' };
                    default:
                        return { success: false, errorKey: 'errorVerificationFailed' };
                }
            }
            return { success: false, errorKey: 'errorVerificationFailed' };
        }
        
        // At this point, response.ok is true (status 200)
        // Check for success in the response
        if (result.success === true || (result.data && result.data.success === true)) {
            console.log('SlipOK verification successful');
            return { success: true };
        } else {
            console.error('SlipOK verification failed despite 200 OK status:', result);
            return { success: false, errorKey: 'errorVerificationFailed' };
        }

    } catch (error) {
        console.error('Error during slip verification fetch request:', error);
        // This catches network errors, CORS issues, or if response isn't JSON
        return { success: false, errorKey: 'errorVerificationFailed' };
    }
};