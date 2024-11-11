import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { HttpsProxyAgent } from 'https-proxy-agent';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  httpAgent: process.env.https_proxy
    ? new HttpsProxyAgent(process.env.https_proxy || '')
    : undefined,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const password = formData.get('password') as string;

    if (!audioFile) {
      return NextResponse.json({ error: '没有找到音频文件' }, { status: 400 });
    }

    // 验证密码
    if (!password || password !== process.env.APP_PASSWORD) {
      return NextResponse.json({ error: '密码错误' }, { status: 401 });
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error('转换错误:', error);
    return NextResponse.json({ error: '音频转换失败' }, { status: 500 });
  }
}
