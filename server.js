const express = require('express')
const app = express();
const session = require('express-session');
const db = require('./db');
require('dotenv').config();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.set('view engine', 'ejs');
const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); // req.body
const PORT = process.env.PORT || 3000;

// Import the router files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

// Use the routers
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

app.get('/bharatvoter' , async (req, res) => {
    
        res.render('logouthome'); 
      
  });

  app.get('/process??' , async (req, res) => {
    
    res.render('logout_process'); 
  
});

app.get('/about??' , async (req, res) => {
    
  res.render('logout_aboutpage'); 

});

// node --version # Should be >= 18
// npm install @google/generative-ai

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = "AIzaSyARQ0asnqriiUdmEQNAFANKTCoMMfV50k4";

async function runChat() {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 1,
    topK: 64,
    topP: 0.95,
    maxOutputTokens: 8192,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [{ text: "hey"}],
      },
      {
        role: "model",
        parts: [{ text: "Hey there! 👋  What's on your mind today? Tell me what's going on and I'll do my best to help. Remember, I can't give actual medical advice, but I can offer information and support. 😊"}],
      },
      {
        role: "user",
        parts: [{ text: "I got mild fever what to do?"}],
      },
      {
        role: "model",
        parts: [{ text: "I understand you're dealing with a mild fever. It's great that you're paying attention to your body!  Unfortunately, I can't offer medical advice.  A mild fever is usually nothing to worry too much about, but it's always best to be cautious. \n\nHere are some general tips that might help:\n\n* **Stay hydrated:**  Drink plenty of fluids like water or clear broth.\n* **Rest:** Give your body a chance to recover.\n* **Over-the-counter relief:**  Acetaminophen or ibuprofen can help reduce fever and discomfort. *Always follow dosage instructions.*\n* **Cool down:** A lukewarm bath or cool compress can help.\n* **Monitor your symptoms:** If your fever persists, worsens, or you experience other concerning symptoms, it's crucial to contact your doctor. \n\n **Remember, it's always best to consult a medical professional for personalized advice and treatment.** They can assess your specific situation and provide the best guidance for your health. \n\nFeel better soon!"}],
      },
    ],
  });

  const result = await chat.sendMessage("YOUR_USER_INPUT");
  const response = result.response;
  console.log(response.text());
}

runChat();

app.listen(PORT, ()=>{
    console.log('listening on port 7000');
})