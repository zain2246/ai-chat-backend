import { Router } from 'express';
import { generateGeminiResponse } from '../gemini';

const router = Router();

router.post('/chat', async (req,res) => {
    try {
        const { message } = req.body;
        console.log(message)

        //validate the incoming message
        if(!message || typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({
                success:false,
                message:'Please provide a valid message'
            })
        }

       /*  const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        //send the message to gemini
        const interaction = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: message
        }); */

        const reply = await generateGeminiResponse(message);

        return res.status(200).json({
            success:true,
            reply
        });

    } catch(error: unknown) {
        console.log("Gemini API Error:", error);

        return res.status(500).json({
            success:false,
            message: 'Something went wrong while communicating with Gemini.'
        })

    }
})

export default router;

