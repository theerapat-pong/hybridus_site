import type { VercelRequest, VercelResponse } from '@vercel/node';

// Use environment variables in production
const SLIPOK_BRANCH_ID = process.env.SLIPOK_BRANCH_ID || '49571';
const SLIPOK_API_KEY = process.env.SLIPOK_API_KEY || 'SLIPOKE0ICAL1';
const SLIPOK_API_URL = `https://api.slipok.com/api/line/apikey/${SLIPOK_BRANCH_ID}`;

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

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Log for debugging (remove in production)
  console.log('SlipOK API Request:', {
    url: SLIPOK_API_URL,
    hasKey: !!SLIPOK_API_KEY,
    contentType: req.headers['content-type']
  });

  try {
    const response = await fetch(SLIPOK_API_URL, {
      method: 'POST',
      headers: {
        'x-authorization': SLIPOK_API_KEY,
        'content-type': req.headers['content-type'] || '',
      },
      body: req as any,
    });

    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      console.log('SlipOK Response:', { status: response.status, success: result.success });
      return res.status(response.status).json(result);
    } else {
      const text = await response.text();
      console.log('Non-JSON response:', text);
      return res.status(response.status).json({ 
        error: 'Non-JSON response from SlipOK',
        body: text 
      });
    }

  } catch (error) {
    console.error('SlipOK API Error:', error);
    return res.status(500).json({ 
      error: 'API request failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
