import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();
    
    console.log('API: generatePromoCopy called with:', productData);
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `Generate ONE compelling promotional tagline for this product.

Product: ${productData.name}
Price: $${productData.price}
Original Price: ${productData.oldPrice ? `$${productData.oldPrice}` : 'N/A'}
Description: ${productData.description}

Create a single catchy tagline (max 12 words) that:
- Highlights value or savings
- Uses action words
- Is memorable and impactful
- Emphasizes benefits or urgency

Example: "Smart lighting that saves you 40% - Transform your home today!"

Tagline:`;

    console.log('API: Sending prompt to AI:', prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text().trim();
    
    console.log('API: AI generated text:', generatedText);
    
    return NextResponse.json({ 
      success: true, 
      promoCopy: generatedText 
    });

  } catch (error) {
    console.error('API: Error generating promo copy:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate promo copy',
      promoCopy: 'Discover amazing deals on premium products!' 
    }, { status: 500 });
  }
} 