import React from "react";
import { useLocation } from "react-router-dom";
import Searching from "../components/search/Searching";

const Search = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  return (
    <div style={{ padding: "20px" }}>
      <Searching query={query} /> {/* Arama sorgusunu Searching bileşenine geçiyoruz */}
    </div>
  );
};

export default Search;
