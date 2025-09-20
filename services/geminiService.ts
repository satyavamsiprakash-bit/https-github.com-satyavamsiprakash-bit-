import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { Attendee } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will be mocked.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generatePersonalizedMessage = async (attendee: Omit<Attendee, 'id' | 'submittedAt'>): Promise<string> => {
  if (!process.env.API_KEY) {
    return new Promise(resolve => setTimeout(() => resolve(`
<h2 class="text-xl font-bold text-gray-800 mb-2">Dear ${attendee.name}, welcome to DS Digital Solutions Connect!</h2>
<p class="text-gray-600 mb-4">We're thrilled to have a ${attendee.profession} join our community. Based on your interest in "${attendee.supportRequired}", here are some tailored suggestions to expand your digital reach:</p>
<ul class="list-disc list-inside text-gray-600 space-y-2">
  <li><strong>Content Marketing Strategy:</strong> Develop high-quality content that resonates with your target audience and establishes you as a thought leader.</li>
  <li><strong>Social Media Engagement:</strong> Boost your presence on key platforms to connect with potential clients and collaborators.</li>
  <li><strong>Search Engine Optimization (SEO):</strong> Improve your website's visibility on search engines to attract organic traffic.</li>
</ul>
<p class="text-gray-600 mt-4">We look forward to connecting with you during the summit!</p>
    `), 1500));
  }

  const prompt = `
    An attendee named "${attendee.name}" who is a "${attendee.profession}" has just registered for our digital marketing summit.
    They mentioned their required support is: "${attendee.supportRequired}".

    Your task is to generate a warm, welcoming, and professional message for them. The message should be in HTML format.

    The message must:
    1.  Start with a personalized greeting including their name.
    2.  Acknowledge their profession.
    3.  Based on their "support required", suggest 3 distinct and relevant digital marketing services our company could offer them. Frame these as helpful recommendations for their professional growth.
    4.  The suggestions should be an unordered list (<ul> with <li> items). Each list item should have a bolded title (<strong>).
    5.  End with a positive closing statement about seeing them at the summit.
    6.  Do not include any opening or closing HTML, head, or body tags. Only generate the content that would go inside a div.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating personalized message:", error);
    return `
      <h2 class="text-xl font-bold text-gray-800 mb-2">Welcome, ${attendee.name}!</h2>
      <p class="text-gray-600">Thank you for registering for DS Digital Solutions Connect. We've received your information and are excited to have you with us. We'll be in touch with more details soon.</p>
    `;
  }
};