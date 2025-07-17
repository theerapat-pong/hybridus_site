// Alternative API route for debugging
import type { VercelRequest, VercelResponse } from '@vercel/node';

const SLIPOK_BRANCH_ID = '49571';
const SLIPOK_API_KEY = 'SLIPOKE0ICAL1';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test with simple curl equivalent
    const testUrl = `https://api.slipok.com/api/line/apikey/${SLIPOK_BRANCH_ID}`;
    
    // Log all request details for debugging
    console.log('=== DEBUG INFO ===');
    console.log('API URL:', testUrl);
    console.log('API Key:', SLIPOK_API_KEY);
    console.log('Request headers:', req.headers);
    console.log('Content-Type:', req.headers['content-type']);
    
    // Test API availability first
    const testResponse = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'x-authorization': SLIPOK_API_KEY,
      },
      body: req as any,
    });

    console.log('Response status:', testResponse.status);
    console.log('Response headers:', Object.fromEntries(testResponse.headers.entries()));

    const responseText = await testResponse.text();
    console.log('Response body:', responseText);

    // Try to parse as JSON
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.log('Failed to parse JSON:', parseError);
      return res.status(500).json({
        error: 'API returned non-JSON response',
        status: testResponse.status,
        body: responseText
      });
    }

    return res.status(testResponse.status).json(result);

  } catch (error) {
    console.error('Network error:', error);
    return res.status(500).json({ 
      error: 'Network error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
