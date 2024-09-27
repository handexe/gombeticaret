import React , { useState} from "react";
import { BsSearch } from "react-icons/bs";
import { Form, Button } from "react-bootstrap";
import { useHref } from "react-router-dom"; 

const SearchForm = () => {
  const [query, setQuery] = useState("");
  const href = useHref();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
  };
  const handleSumbits = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (query) {
      // Redirect to search results page with query
      href.push(`/sonuclar?query=${query}`);
    }
  };
  return (
    <div>
      <Form className="d-flex" onSubmit={handleSumbits}>
        <Form.Control
          type="search"
          placeholder="Arama..."
          className="me-2"
          aria-label="Arama..."
          value={query}
          onChange={handleInputChange} // Arama inputu ile arama işlemi başlatılır
        />
        <Button
          className="text-light"
          variant="outline-secondary"
          href={`/sonuclar?query=${query}`}>
          <BsSearch size={20} />
        </Button>
      </Form>
    </div>
  );
};

export default SearchForm;
