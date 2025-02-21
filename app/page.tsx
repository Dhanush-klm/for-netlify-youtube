'use client';
import { useState } from 'react';

interface TranscriptItem {
  text: string;
  duration: number;
  offset: number;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setTranscript(data.transcript);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">YouTube Transcript</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube URL"
            className="w-full p-2 border rounded-md"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : 'Get Transcript'}
          </button>
        </form>

        {transcript.length > 0 && (
          <div className="mt-8 p-4 border rounded-md space-y-2">
            {transcript.map((item, index) => (
              <p key={index}>{item.text}</p>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
