import type { VercelRequest, VercelResponse } from '@vercel/node';

const SLIPOK_BRANCH_ID = '49571';
const SLIPOK_API_KEY = 'SLIPOKE0ICAL1';
const SLIPOK_API_URL = `https://api.slipok.com/api/line/apikey/${SLIPOK_BRANCH_ID}`;

export const config = {
  api: {
    bodyParser: false,
  },
};

// Function to collect request body as Buffer
function collectRequestBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });
    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    req.on('error', reject);
  });
}

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

  try {
    console.log('Processing request to SlipOK API...');
    
    // Get content type from request
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return res.status(400).json({ error: 'Content-Type must be multipart/form-data' });
    }

    console.log('Content-Type:', contentType);

    // Collect the request body
    const bodyBuffer = await collectRequestBody(req);
    console.log('Body buffer size:', bodyBuffer.length);

    // Forward to SlipOK API using fetch with proper options
    const response = await fetch(SLIPOK_API_URL, {
      method: 'POST',
      headers: {
        'x-authorization': SLIPOK_API_KEY,
        'content-type': contentType,
        'content-length': bodyBuffer.length.toString(),
      },
      body: new Uint8Array(bodyBuffer),
      // @ts-ignore - duplex is required for Node.js 18+
      duplex: 'half',
    });

    console.log('SlipOK API Response Status:', response.status);

    // Parse response
    const responseContentType = response.headers.get('content-type');
    let result;
    
    if (responseContentType && responseContentType.includes('application/json')) {
      result = await response.json();
      console.log('SlipOK API Response Data:', result);
    } else {
      const textResult = await response.text();
      console.log('Non-JSON response from SlipOK:', textResult);
      return res.status(response.status).json({ 
        error: 'SlipOK API returned non-JSON response',
        response: textResult,
        status: response.status
      });
    }

    // Return the result to client with same status code
    return res.status(response.status).json(result);

  } catch (error) {
    console.error('Error in verify-slip-v3 API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}
