import { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <Search size={18} color="#999" style={{ position: 'absolute', left: '12px' }} />
      <input 
        type="text" 
        placeholder="Search transactions..." 
        value={query}
        onChange={handleChange}
        style={{ 
          padding: '0.6rem 1rem 0.6rem 2.5rem', 
          borderRadius: '20px', 
          border: '1px solid rgba(0,0,0,0.1)', 
          background: '#FCF9F2', 
          fontSize: '0.9rem', 
          outline: 'none', 
          width: '250px' 
        }} 
      />
    </div>
  );
};

export default SearchBar;
