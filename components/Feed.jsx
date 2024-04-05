"use client";

import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);

  // Search states
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  // Filter States
  const [filtered, setFiltered] = useState("all");

  const fetchPosts = async () => {
    const response = await fetch("/api/prompt");
    const data = await response.json();

    setAllPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filterPrompts = () => {
    const regex = new RegExp(searchText, "i"); // 'i' for case-insensitive

    if (filtered === "tag") {
      return allPosts.filter((item) => regex.test(item.tag));
    }
    if (filtered === "prompt") {
      return allPosts.filter((item) => regex.test(item.prompt));
    }
    if (filtered === "username") {
      return allPosts.filter((item) => regex.test(item.creator.username));
    }

    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  useEffect(() => {
    clearTimeout(searchTimeout);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts();
        setSearchedResults(searchResult);
      }, 300)
    );
  }, [filtered, searchText]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchFilter = (e) => {
    setFiltered(e.target.value);
  };

  const handleTagClick = (tagName) => {
    setFiltered("tag");
    setSearchText(tagName);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <select
          className="select_input"
          onChange={handleSearchFilter}
          value={filtered}
        >
          <option default value="all">
            All
          </option>
          <option value="tag">Tag</option>
          <option value="username">Username</option>
          <option value="prompt">Prompt</option>
        </select>
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input"
        />
      </form>

      {/* All Prompts */}
      {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList data={allPosts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
