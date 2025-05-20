export async function handler(event) {
  try {
    const response = await fetch('http://52.20.217.81:8000/upload', {
      method: 'POST',
      headers: {
        'Content-Type': event.headers['content-type'],
      },
      body: event.body,
    });

    const contentType = response.headers.get('content-type') || 'application/json';
    const buffer = await response.arrayBuffer();

    return {
      statusCode: 200,
      headers: { 'Content-Type': contentType },
      body: Buffer.from(buffer).toString('base64'),
      isBase64Encoded: true,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}

