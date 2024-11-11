import AudioTranscription from '@/app/components/AudioTranscription';

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 flex flex-col items-center justify-center">
      <main className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-8">语音转文字</h1>
        <div className="flex flex-col gap-4">
          <AudioTranscription />
        </div>
      </main>
    </div>
  );
}
