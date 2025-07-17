import { Buffer } from 'node:buffer';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();

  const { token } = req.body;
  const secretKey = process.env.OMISE_SECRET_KEY;

  if (!token || !secretKey) {
    return res.status(400).json({ error: 'Missing token or secret key' });
  }

  try {
    const response = await fetch('https://api.omise.co/charges', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 500,
        currency: 'THB',
        card: token,
        description: 'Mahabote Chat Question',
      }),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Omise API error', details: error });
  }
}
