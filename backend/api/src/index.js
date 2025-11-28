const express = require('express');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/prompts', async (req, res) => {
  const { prompt } = req.body;
  
  // TODO: Queue this for processing
  res.json({ 
    message: 'Prompt received',
    promptId: 'temp-' + Date.now(),
    status: 'queued'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
});
