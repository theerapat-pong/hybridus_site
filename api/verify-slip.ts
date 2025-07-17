import type { VercelRequest, VercelResponse } from '@vercel/node';

const SLIPOK_BRANCH_ID = '49571';
const SLIPOK_API_KEY = 'SLIPOKE0ICAL1';
const SLIPOK_API_URL = `https://api.slipok.com/api/line/apikey/${SLIPOK_BRANCH_ID}`;

// Disable default body parser to handle multipart data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Proxying request to SlipOK API...');
    
    // Get content type from request
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return res.status(400).json({ error: 'Content-Type must be multipart/form-data' });
    }

    // Forward the request body to SlipOK API
    const response = await fetch(SLIPOK_API_URL, {
      method: 'POST',
      headers: {
        'x-authorization': SLIPOK_API_KEY,
        'content-type': contentType,
      },
      body: req as any, // Forward raw request body
    });

    console.log('SlipOK API responded with status:', response.status);

    // Check if response is JSON
    const responseContentType = response.headers.get('content-type');
    let result;
    
    if (responseContentType && responseContentType.includes('application/json')) {
      result = await response.json();
    } else {
      const textResult = await response.text();
      console.log('Non-JSON response from SlipOK:', textResult);
      return res.status(500).json({ 
        error: 'SlipOK API returned non-JSON response',
        response: textResult 
      });
    }
    
    console.log('SlipOK API Response:', {
      status: response.status,
      statusText: response.statusText,
      data: result
    });

    // Return the result to client with same status code
    return res.status(response.status).json(result);

  } catch (error) {
    console.error('Error in verify-slip API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
