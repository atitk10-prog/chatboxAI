import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const SYSTEM_PROMPT_TEMPLATE = `Vai trò: Bạn là Robot Thông Thái, quản trò vui vẻ dẫn dắt trò chơi toán học cho trẻ em.

Chủ đề: {{TOPIC}}
Tổng số câu: {{TOTAL_QUESTIONS}}

Cốt truyện: Học sinh đóng vai Hiệp sĩ Toán học giải cứu Vương quốc Con Số.
- Rừng Xanh Kỳ Bí: gặp muông thú, chỉ hỏi bảng nhân 2, 3, 4.
- Vũ Trụ Bao La: bay qua hành tinh, chỉ hỏi bảng nhân 5, 6, 7.
- Lâu Đài Phép Thuật: đối đầu phù thủy, chỉ hỏi bảng nhân 8, 9.
- Chủ đề khác: tạo câu chuyện phù hợp.

Câu hỏi phải là toán đố có lời văn, không hỏi phép tính trần.
Ví dụ: "Hiệp sĩ ơi! Có 3 đàn bướm, mỗi đàn có 4 con. Có tất cả bao nhiêu con bướm?"

Cách đánh giá đáp án:
- Nếu học sinh trả lời số đúng (VD: "12", "mười hai", "12 con", "có 12 con bướm") thì isCorrect=true.
- Chấp nhận: số, chữ số, có đơn vị, câu đầy đủ. Không phân biệt hoa thường.
- Chỉ cần kết quả số đúng là đúng, không cần đúng định dạng.

Quy trình:
1. Nhận "Bắt đầu trò chơi!" thì kể chuyện ngắn và đưa toán đố 1 ngay. action=ASK_QUESTION, currentQuestionIndex=1.
2. Trả lời đúng thì khen ngắn, kể tiếp câu chuyện và đưa toán đố tiếp theo ngay. action=ASK_QUESTION, isCorrect=true, currentQuestionIndex tăng 1.
3. Trả lời sai thì gợi ý, hỏi lại câu đó. action=FEEDBACK, isCorrect=false, heartsToSubtract=1.
4. Chỉ khi trả lời đúng câu cuối cùng (câu {{TOTAL_QUESTIONS}}) thì action=WIN.
5. Không bao giờ tự kết thúc sớm.

Quan trọng:
- Luôn viết tiếng Việt có dấu đầy đủ.
- Luôn có câu hỏi trong message khi action là ASK_QUESTION. Message PHẢI kết thúc bằng dấu "?".
- KHÔNG BAO GIỜ gửi message chỉ có câu chuyện mà không có câu hỏi toán.
- Chỉ trả về JSON, không có text ngoài JSON.

JSON: {"message":"(tiếng Việt có dấu)","action":"ASK_QUESTION","heartsToSubtract":0,"currentQuestionIndex":1,"isCorrect":null,"characterExpression":"HAPPY"}`;

// Groq API
async function callGroqAPI(apiKey: string, messages: { role: string, content: string }[]): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages,
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API Error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export class AIService {
  private ai: GoogleGenAI | null = null;
  private chat: any = null;
  private groqMessages: { role: string, content: string }[] = [];
  private useGroq = false;
  private systemPrompt: string = '';

  constructor(topic: string = 'Bảng nhân 2, 3, 4', totalQuestions: number = 5) {
    this.systemPrompt = SYSTEM_PROMPT_TEMPLATE
      .replace(/\{\{TOPIC\}\}/g, topic)
      .replace(/\{\{TOTAL_QUESTIONS\}\}/g, String(totalQuestions));

    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        this.ai = new GoogleGenAI({ apiKey: geminiKey });
        this.chat = this.ai.chats.create({
          model: "gemini-2.0-flash",
          config: {
            systemInstruction: this.systemPrompt,
            responseMimeType: "application/json",
          },
        });
        console.log("Gemini initialized");
      } catch (e) {
        console.warn("Gemini init failed:", e);
      }
    }

    this.groqMessages = [{ role: 'system', content: this.systemPrompt }];
  }

  async sendMessage(message: string): Promise<any> {
    console.log("Sending:", message, "useGroq:", this.useGroq);

    if (!this.useGroq && this.chat) {
      try {
        const result: GenerateContentResponse = await this.chat.sendMessage({ message });
        const text = result.text || "{}";
        console.log("Gemini raw:", text);
        const parsed = JSON.parse(text);
        this.groqMessages.push({ role: 'user', content: message });
        this.groqMessages.push({ role: 'assistant', content: text });
        return parsed;
      } catch (error: any) {
        console.error("Gemini Error:", error?.message || error);
        this.useGroq = true;
        this.groqMessages.push({ role: 'user', content: message });
      }
    }

    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      try {
        if (!this.groqMessages.some(m => m.content === message && m.role === 'user')) {
          this.groqMessages.push({ role: 'user', content: message });
        }
        const responseText = await callGroqAPI(groqKey, this.groqMessages);
        console.log("Groq raw:", responseText);
        this.groqMessages.push({ role: 'assistant', content: responseText });
        return JSON.parse(responseText);
      } catch (error) {
        console.error("Groq Error:", error);
      }
    }

    return {
      message: "Hiệp sĩ ơi! Có 2 rổ táo, mỗi rổ có 3 quả. Hỏi có tất cả bao nhiêu quả táo?",
      action: "ASK_QUESTION",
      heartsToSubtract: 0,
      currentQuestionIndex: 1,
      isCorrect: null,
      characterExpression: "THINKING"
    };
  }
}

// Generate questions for custom topics using AI (Groq only)
export async function generateQuestions(topic: string, count: number): Promise<{ id: number; story: string; answer: number; difficulty: 1 | 2 | 3 }[]> {
  const prompt = `Tạo ${count} câu hỏi toán đố cho trẻ em lớp 2-3 với chủ đề: "${topic}".

QUAN TRỌNG - QUY TẮC BẮT BUỘC:
- Mỗi câu CHỈ dùng DUY NHẤT 1 phép nhân đơn giản: a × b. KHÔNG được dùng 2 phép nhân, KHÔNG a × b × c.
- Ví dụ ĐÚNG: "Có 3 rổ, mỗi rổ có 5 quả cam. Hỏi có bao nhiêu quả cam?" (3 × 5 = 15)
- Ví dụ SAI: "Có 3 xe, mỗi xe 5 thùng, mỗi thùng 2 hộp" (3 × 5 × 2 - QUÁ PHỨC TẠP!)
- Đáp án luôn là tích của đúng 2 số nguyên
- Nếu chủ đề có nói bảng nhân cụ thể (ví dụ "3 đến 7"), CHỈ dùng các bảng nhân đó
- Nếu không nói rõ, dùng bảng nhân 2-9
- Mỗi câu phải có bối cảnh rõ ràng, đủ chủ ngữ vị ngữ, kết thúc bằng "Hỏi ... bao nhiêu ...?"
- Phân bổ: 30% dễ (difficulty 1), 40% trung bình (difficulty 2), 30% khó (difficulty 3)
- Viết tiếng Việt có dấu đầy đủ
- CHỈ trả về JSON array, không có text nào khác

Format: [{"id":1,"story":"...","answer":15,"difficulty":1}, ...]`;

  try {
    const groqKey = (typeof process !== 'undefined' && (process as any).env?.GROQ_API_KEY) || '';
    if (!groqKey) { console.warn('❌ No GROQ_API_KEY'); return []; }

    console.log('🤖 Generating questions via Groq...');
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqKey}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 3000,
      }),
    });
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const questions = JSON.parse(cleaned);
    if (Array.isArray(questions) && questions.length > 0) {
      console.log('✅ Groq generated', questions.length, 'questions');
      return questions.map((q: any, i: number) => ({
        id: i + 1,
        story: q.story || q.question || '',
        answer: Number(q.answer),
        difficulty: ([1, 2, 3].includes(q.difficulty) ? q.difficulty : 2) as 1 | 2 | 3,
      }));
    }
  } catch (e) {
    console.error('❌ Groq generate failed:', e);
  }

  return [];
}
