import type { VercelRequest, VercelResponse } from '@vercel/node';
import multiparty from 'multiparty';
import fs from 'fs';

const SLIPOK_BRANCH_ID = '49571';
const SLIPOK_API_KEY = 'SLIPOKE0ICAL1';
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

  try {
    console.log('Processing multipart form data...');
    
    // Parse multipart form data
    const form = new multiparty.Form();
    
    const parseFormData = (): Promise<{ fields: any; files: any }> => {
      return new Promise((resolve, reject) => {
        form.parse(req, (err: any, fields: any, files: any) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });
    };

    const { fields, files } = await parseFormData();
    
    console.log('Parsed form data:', {
      fields: Object.keys(fields),
      files: Object.keys(files)
    });

    // Get amount and log from fields
    const amount = fields.amount?.[0];
    const log = fields.log?.[0] || 'true';
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    // Get uploaded file
    const fileArray = files.files;
    if (!fileArray || fileArray.length === 0) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const uploadedFile = fileArray[0];
    
    console.log('File details:', {
      originalFilename: uploadedFile.originalFilename,
      size: uploadedFile.size,
      type: uploadedFile.headers['content-type']
    });

    // Create new FormData for SlipOK API
    const formData = new FormData();
    
    // Read file and create blob
    const fileBuffer = fs.readFileSync(uploadedFile.path);
    const fileBlob = new Blob([fileBuffer], { 
      type: uploadedFile.headers['content-type'] || 'image/jpeg' 
    });
    
    formData.append('files', fileBlob, uploadedFile.originalFilename || 'slip.jpg');
    formData.append('amount', amount);
    formData.append('log', log);

    console.log('Sending request to SlipOK API:', {
      amount,
      filename: uploadedFile.originalFilename,
      fileSize: uploadedFile.size
    });

    // Call SlipOK API with proper fetch options
    const response = await fetch(SLIPOK_API_URL, {
      method: 'POST',
      headers: {
        'x-authorization': SLIPOK_API_KEY,
      },
      body: formData,
      duplex: 'half',
    } as RequestInit);

    console.log('SlipOK API Response Status:', response.status);

    // Clean up temporary file
    try {
      fs.unlinkSync(uploadedFile.path);
    } catch (cleanupError) {
      console.warn('Could not cleanup temp file:', cleanupError);
    }

    // Parse response
    const responseContentType = response.headers.get('content-type');
    let result;
    
    if (responseContentType && responseContentType.includes('application/json')) {
      result = await response.json();
    } else {
      const textResult = await response.text();
      console.log('Non-JSON response from SlipOK:', textResult);
      return res.status(response.status).json({ 
        error: 'SlipOK API returned non-JSON response',
        response: textResult 
      });
    }
    
    console.log('SlipOK API Response Data:', result);

    // Return the result to client with same status code
    return res.status(response.status).json(result);

  } catch (error) {
    console.error('Error in verify-slip-v2 API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
