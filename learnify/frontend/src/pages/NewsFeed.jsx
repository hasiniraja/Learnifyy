import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const NewsFeed = () => {
  const [query, setQuery] = useState("latest news"); // Default to valid query
  const [news, setNews] = useState([]);

  const fetchNews = async (searchQuery) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return; // Prevent empty requests

    const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
    const CX_CODE = import.meta.env.VITE_GOOGLE_CX_CODE;

    if (!API_KEY || !CX_CODE) {
      console.error("Missing API Key or CX Code in .env file!");
      return;
    }

    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(trimmedQuery)}&cx=${CX_CODE}&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      const data = await response.json();
      setNews(data.items || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  useEffect(() => {
    fetchNews(query); // Fetch news when component mounts
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNews(query);
  };

  return (
    <div className="p-4">
      <Sidebar />
      <h1 className="text-3xl font-extrabold mb-6 text-center">News</h1>
      <form onSubmit={handleSearch} className="flex space-x-2 mb-4 ml-10 mr-10">
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Search news..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="bg-black text-white px-4 py-2">
          Search
        </button>
      </form>

      <div className="space-y-4">
        {news.length > 0 ? (
          news.map((article, index) => (
            <div key={index} className="p-4 border rounded-xl bg-[#cecdcd]">
              <h3 className="text-lg font-bold">{article.title}</h3>
              <p>{article.snippet}</p>
              <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-black">
                Read more
              </a>
            </div>
          ))
        ) : (
          <p>No news articles found.</p>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;


