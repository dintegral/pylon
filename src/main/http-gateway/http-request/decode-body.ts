import * as pako from 'pako';

function getContentEncoding(headers: Record<string, string>): string {
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase().trim() === 'content-encoding') {
      return value.trim();
    }
  }

  return '';
}

export function decodeBody(
  body: Buffer,
  headers: Record<string, string>,
): Buffer {
  const encoding = getContentEncoding(headers);

  switch (encoding) {
    case '':
    case 'identity':
      return body;
    case 'gzip':
    case 'deflate':
      return Buffer.from(pako.inflate(body));
    default:
      throw new Error(`Unsupported encoding: "${encoding}"`);
  }
}
