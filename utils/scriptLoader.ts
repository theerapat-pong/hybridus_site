// A global promise to avoid re-injecting the script
let omiseScriptPromise: Promise<void> | null = null;
const SCRIPT_URL = 'https://cdn.omise.co/omise.js';

/**
 * Polls for the existence of window.Omise.checkout, which can take a moment to initialize
 * after the script has loaded.
 */
function pollForOmiseCheckout(resolve: () => void, reject: (reason?: any) => void) {
    const timeout = 15000; // Increased timeout to 15 seconds for slower networks/devices
    const interval = 100;
    let elapsedTime = 0;

    const checkInterval = setInterval(() => {
        // Check if Omise and its checkout property are available
        if (window.Omise && window.Omise.checkout) {
            clearInterval(checkInterval);
            resolve();
        } else {
            elapsedTime += interval;
            if (elapsedTime >= timeout) {
                clearInterval(checkInterval);
                // Reset promise on timeout to allow for a retry if the component remounts
                omiseScriptPromise = null; 
                reject(new Error('Timed out waiting for Omise.checkout to become available.'));
            }
        }
    }, interval);
}


export const loadOmiseScript = (): Promise<void> => {
  // If Omise.js is already loaded and ready, we can resolve immediately.
  if (window.Omise && window.Omise.checkout) {
    return Promise.resolve();
  }

  // If a loading promise already exists, return it. This prevents multiple
  // instances of the script from being added to the page.
  if (omiseScriptPromise) {
    return omiseScriptPromise;
  }

  omiseScriptPromise = new Promise((resolve, reject) => {
    // Check if the script tag is already in the DOM (e.g., from a previous mount)
    const existingScript = document.querySelector(`script[src="${SCRIPT_URL}"]`);

    if (existingScript) {
        // The script tag is there, but Omise.checkout is not ready. This means it's either
        // still loading or it failed on a previous attempt. We'll start polling for it.
        pollForOmiseCheckout(resolve, reject);
        return;
    }

    // If no script tag exists, create and append it.
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;

    script.onload = () => {
      // The script has finished downloading. Now, poll for the Omise.checkout object to be initialized.
      pollForOmiseCheckout(resolve, reject);
    };

    script.onerror = () => {
      // If the script fails to load, remove the element and reject the promise.
      script.remove();
      omiseScriptPromise = null; // Reset promise to allow a future attempt
      reject(new Error(`Failed to load the Omise.js script.`));
    };

    document.body.appendChild(script);
  });

  return omiseScriptPromise;
};
