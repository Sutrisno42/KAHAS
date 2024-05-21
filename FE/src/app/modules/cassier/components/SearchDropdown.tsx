import React, { useState } from 'react';

// Data contoh, Anda dapat menggantinya dengan data asli Anda
const data = [
    {
        id: 97,
        code: 'SA',
        name: 'AISH ACNE SERUM',
        price: 119000.0,
        weight: 60.0,
    },
    {
        id: 117,
        code: 'TON',
        name: 'TONER AISH',
        price: 49000.0,
        weight: 1.0,
    },
    {
        id: 237,
        code: 'SB',
        name: 'AISH BRIGHTENING SERUM',
        price: 119000.0,
        weight: 60.0,
    },
    {
        id: 238,
        code: 'SD',
        name: 'AISH DARKSPOT SERUM',
        price: 123000.0,
        weight: 60.0,
    },
    {
        id: 239,
        code: 'FW',
        name: 'AISH FACIAL WASH',
        price: 99000.0,
        weight: 100.0,
    },
    {
        id: 240,
        code: 'DNC',
        name: 'AISH DAY & NIGHT CREAM',
        price: 149000.0,
        weight: 100.0,
    },
    {
        id: 241,
        code: 'ARM',
        name: 'AISH UNDERARM',
        price: 109000.0,
        weight: 100.0,
    },
    {
        id: 252,
        code: 'NE',
        name: 'AISH NECK BRIGHTENING SERUM',
        price: 99000.0,
        weight: 100.0,
    },
    {
        id: 322,
        code: 'QU',
        name: 'Queensi Romantic Brightening Body Lotion ',
        price: 75000.0,
        weight: 300.0,
    },
    {
        id: 377,
        code: 'QP',
        name: 'Queensi Brightening Body Lotion Elegant',
        price: 75000.0,
        weight: 300.0,
    },
];

const SearchDropdown: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Fungsi untuk menangani perubahan input pencarian
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Filter data berdasarkan nilai pencarian
        const filteredResults = data.filter(item =>
            item.name.toLowerCase().includes(value.toLowerCase())
        );
        setSearchResults(filteredResults);
        setIsOpen(true);
    };

    // Fungsi untuk menangani seleksi item hasil pencarian
    const handleResultClick = (result: { id: number, name: string }) => {
        // Di sini Anda dapat menentukan tindakan yang akan diambil ketika item hasil pencarian dipilih
        setSearchTerm(result.name);
        setIsOpen(false);
    };

    return (
        <div className="dropdown">
            <input
                type="text"
                className="form-control"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            {isOpen && (
                <div className="dropdown-menu show">
                    <div className='table-responsive'>
                        <table className='table'>
                            {/* <thead className=''>
                                <tr>
                                    <th scope='col'>ID</th>
                                    <th scope='col'>Code</th>
                                    <th scope='col'>Name</th>
                                    <th scope='col'>Price</th>
                                </tr>
                            </thead> */}
                            <tbody>
                                {searchResults.map((result: any) => (
                                    <tr
                                        key={result.id}
                                        className="dropdown-item"
                                        onClick={() => handleResultClick(result)}
                                    >
                                        <td>{result.id}</td>
                                        <td>{result.code}</td>
                                        <td>{result.name}</td>
                                        <td>Rp. {result.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            )}
        </div>
    );
};

export default SearchDropdown;
