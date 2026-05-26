'use strict';
const axios = require('axios');

module.exports = async function webSearch(query) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return "Error: TAVILY_API_KEY not configured.";

  try {
    const res = await axios.post('https://api.tavily.com/search', {
      api_key: apiKey,
      query: query,
      search_depth: 'advanced'
    });
    return res.data.results.map(r => `${r.title}: ${r.content}`).join('\n\n');
  } catch (err) {
    return `Search failed: ${err.message}`;
  }
};
