'use client'
import { useState } from 'react';
import Link from 'next/link';

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          My Governance
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06-.02L10 10.94l3.71-3.75a.75.75 0 011.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01-.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
        >
          <div className="py-1" role="none">
            <Link href="/governance/add" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex="-1">
                Add Member
            </Link>
            <Link href="/governance/remove" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex="-1">
                Remove Member
            </Link>
            <Link href="/proposal/create" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex="-1">
                Create Proposal
            </Link>
            <Link href="/proposal/execute" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex="-1">
                Execute Proposal
            </Link>
            <Link href="/governance/distribute" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex="-1">
                Distribute Rewards
            </Link>
            <Link href="/governance/change-admin" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex="-1">
                Change Admin
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
