const { dcDNS } = require('dc-over-dns');
const fs = require('fs');
const path = require('path');

const validTLDs = new Set();
const tldFilePath = path.join(__dirname, 'tlds-alpha-by-domain.txt');

fs.readFileSync(tldFilePath, 'utf-8')
  .split('\n')
  .forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      validTLDs.add(trimmedLine.toLowerCase());
    }
  });

const isValidTLD = (name) => {
  const parts = name.split('.');
  if (parts.length < 2) return false;
  const tld = parts[parts.length - 1].toLowerCase();
  return validTLDs.has(tld);
};

exports.handleRequest = async (name, res) => {
  if (!isValidTLD(name)) {
    return res.status(400).json({ error: 'The provided domain contains an invalid TLD' });
  }

  try {
    const value = await dcDNS.jsonResolve(name);
    // Parse the JSON string to remove escape characters
    const parsedValue = JSON.parse(value);
    res.status(200).json(parsedValue);
  } catch (error) {
    let errorMessage;
    if (error.message.startsWith('Failure:')) {
      errorMessage = error.message.replace('Failure:', '').trim();
      res.status(400).json({ Failure: errorMessage });
    } else if (error.message.startsWith('Rejection:')) {
      errorMessage = error.message.replace('Rejection:', '').trim();
      res.status(400).json({ Rejection: errorMessage });
    } else {
      // For unexpected errors
      errorMessage = 'Internal server error';
      res.status(500).json({ error: errorMessage });
    }
  }
};
