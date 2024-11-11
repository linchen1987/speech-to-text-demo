'use client';

import { useState } from 'react';

export default function AudioTranscription() {
  const [, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioBlob(file);
    try {
      await handleTranscribe(file);
      e.target.value = '';
    } catch {
      e.target.value = '';
    }
  };

  const handleTranscribe = async (audioFile: File) => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('password', password);

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '转换失败');
      }

      setTranscription(data.text);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '发生未知错误');
      console.error('转换错误:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          type="password"
          placeholder="请输入访问密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        <label
          htmlFor="audio-upload"
          className={`cursor-pointer ${
            isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2`}
        >
          {isLoading ? (
            <>
              <span className="inline-block animate-spin">⏳</span>
              <span>转换中...</span>
            </>
          ) : (
            '选择音频文件'
          )}
          <input
            id="audio-upload"
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isLoading}
          />
        </label>
        <p className="text-sm text-gray-500">支持 MP3、WAV、M4A 等音频格式</p>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {transcription && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">转换结果：</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="whitespace-pre-wrap">{transcription}</p>
          </div>
        </div>
      )}
    </div>
  );
}
