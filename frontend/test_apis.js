// Direct API Testing Script
// Tests the provided API keys and identifies models

const testGeminiAPI = async (apiKey, prompt) => {
  console.log('🤖 Testing Gemini API...');
  
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`);
    }

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    console.log('✅ Gemini API SUCCESS');
    console.log('Model: gemini-1.5-flash-latest');
    console.log('Response:', result.substring(0, 200) + '...');
    return { success: true, model: 'gemini-1.5-flash-latest', response: result };
    
  } catch (error) {
    console.log('❌ Gemini API FAILED:', error.message);
    return { success: false, error: error.message };
  }
};

const testOpenAIAPI = async (apiKey, prompt) => {
  console.log('🧠 Testing OpenAI API...');
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Testing with the most cost-effective model
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`);
    }

    const result = data.choices?.[0]?.message?.content || 'No response';
    console.log('✅ OpenAI API SUCCESS');
    console.log('Model: gpt-4o-mini (the default/model being used)');
    console.log('Response:', result.substring(0, 200) + '...');
    return { success: true, model: 'gpt-4o-mini', response: result };
    
  } catch (error) {
    console.log('❌ OpenAI API FAILED:', error.message);
    return { success: false, error: error.message };
  }
};

// Main test function
const runTests = async () => {
  console.log('🧪 Starting API Tests...');
  console.log('Time:', new Date().toISOString());
  console.log('='.repeat(50));
  
  const apiKeys = {
    gemini: 'ATzaSyBLv9eN8zNSUkSEm7xnAmG1abUotDX3420',
    openai: 'sk-proj-LXc5F7IW85GHT3HZNyHSGZRYNTr1QYt8vYYBdb7Zs9rrktkh4-7MO6NtEJooM-zthkBK@e@dUh7T3B1bkFIECKZ19FrILZ1pAl111£q9x__v9gx1jDxcHDMmZbmtJ4280zWIMd93psyket@zTRUT2FeNHSgUA'
  };

  const testPrompt = 'Explain what JavaScript is in one sentence.';

  const results = {
    gemini: await testGeminiAPI(apiKeys.gemini, testPrompt),
    openai: await testOpenAIAPI(apiKeys.openai, testPrompt)
  };

  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY:');
  console.log('Gemini API:', results.gemini.success ? '✅ WORKING' : '❌ FAILED');
  console.log('OpenAI API:', results.openai.success ? '✅ WORKING' : '❌ FAILED');
  
  if (results.gemini.success) {
    console.log('Gemini Model:', results.gemini.model);
  }
  if (results.openai.success) {
    console.log('OpenAI Model:', results.openai.model);
  }
};

// Run the tests
runTests().catch(console.error);