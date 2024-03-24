const { dcDNS } = require('dc-over-dns');

exports.handleRequest = async (content, res) => {
  try {
    const value = await dcDNS.jsonResolve(content);
    // Parse the JSON string to remove escape characters
    const parsedValue = JSON.parse(value);
    res.status(200).json(parsedValue);
  } catch (error) {
    let errorMessage;
    if (error.message.startsWith('Failure:')) {
      errorMessage = error.message.replace('Failure:', '').trim();
      res.status(500).json({ error: errorMessage });
    } else if (error.message.startsWith('Rejection:')) {
      errorMessage = error.message.replace('Rejection:', '').trim();
      res.status(400).json({ error: errorMessage });
    } else {
      // For unexpected errors
      errorMessage = 'Internal server error';
      res.status(500).json({ error: errorMessage });
    }
  }
};
