import React, { useState, useEffect } from 'react';
import useDebounce from '../hooks/useDebounce';
import { HiOutlineSearch, HiOutlineX } from 'react-icons/hi';

const ProductSearch = ({ onSearch, initialSearch = '' }) => {
  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 max-w-2xl">
      <div className="relative flex-1">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={handleChange}
          placeholder="Search products by name, category, brand..."
          className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100/50 focus:outline-none bg-white shadow-sm transition-all placeholder-slate-400 text-slate-900"
        />
        {search && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap min-w-[100px]"
      >
        Search
      </button>
    </form>
  )
};

export default ProductSearch

