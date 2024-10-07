import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [file, setFile] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData);
      setSalesData(response.data.salesPerSalesman);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!prompt || !salesData) return;

    try {
      const response = await axios.post('/api/chat', { prompt, csvData: salesData });
      setChatHistory([...chatHistory, { prompt, answer: response.data.answer }]);
      setPrompt('');
    } catch (error) {
      console.error('Error getting chat response:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sales Analysis</h1>
      
      <form onSubmit={handleFileUpload} className="mb-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Upload CSV
        </button>
      </form>

      {salesData && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Sales Data</h2>
          <pre>{JSON.stringify(salesData, null, 2)}</pre>
        </div>
      )}

      <form onSubmit={handleChat} className="mb-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask a question about the sales data"
          className="w-full p-2 border rounded mb-2"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Ask
        </button>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-2">Chat History</h2>
        {chatHistory.map((item, index) => (
          <div key={index} className="mb-2">
            <p><strong>Q:</strong> {item.prompt}</p>
            <p><strong>A:</strong> {item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}