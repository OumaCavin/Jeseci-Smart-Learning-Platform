// Updated API Testing Script with New Keys
// Tests the newly provided API keys and identifies models

const testGeminiAPI = async (apiKey, prompt) => {
  console.log('🤖 Testing Gemini API...');
  
  try {
    // Try multiple Gemini models to find which ones work
    const models = [
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro-latest', 
      'gemini-pro',
      'gemini-1.5-flash'
    ];

    let lastError = null;
    let workingModel = null;

    for (const model of models) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
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

        if (response.ok) {
          const data = await response.json();
          const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
          console.log('✅ Gemini API SUCCESS');
          console.log('Working Model:', model);
          console.log('Response Preview:', result.substring(0, 100) + '...');
          return { success: true, model: model, response: result };
        } else {
          const errorData = await response.json();
          lastError = `Model ${model}: HTTP ${response.status} - ${errorData.error?.message || 'Unknown error'}`;
        }
      } catch (error) {
        lastError = `Model ${model}: ${error.message}`;
      }
    }

    throw new Error(lastError || 'No working model found');
    
  } catch (error) {
    console.log('❌ Gemini API FAILED:', error.message);
    return { success: false, error: error.message };
  }
};

const testOpenAIAPI = async (apiKey, prompt) => {
  console.log('🧠 Testing OpenAI API...');
  
  try {
    // Try multiple OpenAI models to find which ones work
    const models = [
      'gpt-4o-mini',
      'gpt-3.5-turbo', 
      'gpt-4o',
      'gpt-4',
      'gpt-4-turbo'
    ];

    let lastError = null;
    let workingModel = null;

    for (const model of models) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 150
          })
        });

        if (response.ok) {
          const data = await response.json();
          const result = data.choices?.[0]?.message?.content || 'No response';
          console.log('✅ OpenAI API SUCCESS');
          console.log('Working Model:', model);
          console.log('Response Preview:', result.substring(0, 100) + '...');
          return { success: true, model: model, response: result };
        } else {
          const errorData = await response.json();
          lastError = `Model ${model}: HTTP ${response.status} - ${errorData.error?.message || 'Unknown error'}`;
        }
      } catch (error) {
        lastError = `Model ${model}: ${error.message}`;
      }
    }

    throw new Error(lastError || 'No working model found');
    
  } catch (error) {
    console.log('❌ OpenAI API FAILED:', error.message);
    return { success: false, error: error.message };
  }
};

// Main test function
const runTests = async () => {
  console.log('🧪 Starting NEW API Tests...');
  console.log('Time:', new Date().toISOString());
  console.log('='.repeat(60));
  
  const apiKeys = {
    gemini: 'AIzaSyDNaw9GB9-4u7NTsyIfyktlYC_xkxlE26Y',
    openai: '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'
  };

  const testPrompt = 'Explain what JavaScript is in one sentence.';

  console.log('\n🔑 TESTING WITH PROVIDED API KEYS:');
  console.log('Gemini Key Length:', apiKeys.gemini.length);
  console.log('OpenAI Key Length:', apiKeys.openai.length);

  const results = {
    gemini: await testGeminiAPI(apiKeys.gemini, testPrompt),
    openai: await testOpenAIAPI(apiKeys.openai, testPrompt)
  };

  console.log('\n' + '='.repeat(60));
  console.log('📊 NEW API TEST SUMMARY:');
  console.log('Gemini API:', results.gemini.success ? '✅ WORKING' : '❌ FAILED');
  console.log('OpenAI API:', results.openai.success ? '✅ WORKING' : '❌ FAILED');
  
  if (results.gemini.success) {
    console.log('✅ Gemini Working Model:', results.gemini.model);
    console.log('🔧 Update service to use: gemini-1.5-flash-latest (if available)');
  }
  if (results.openai.success) {
    console.log('✅ OpenAI Working Model:', results.openai.model);
    console.log('🔧 Update service to use:', results.openai.model);
  }
  
  console.log('\n🎯 RECOMMENDED SERVICE CONFIGURATIONS:');
  console.log('Gemini:', results.gemini.success ? `Use model: ${results.gemini.model}` : 'API key needs to be fixed');
  console.log('OpenAI:', results.openai.success ? `Use model: ${results.openai.model}` : 'API key needs to be fixed');
};

// Run the tests
runTests().catch(console.error);