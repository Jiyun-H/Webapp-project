import React, { useState } from 'react';
import styled from "styled-components";

const ReviewSort = ({ onSortChange }) => {
    const [sort, setSort] = useState('');

    const handleSortChange = () => {
        onSortChange({ sort });
    };

    const FilterContainer = styled.div`
    padding: 20px;
    display: flex;
    justify-content: space-between;
  `;
  
    const Filter = styled.div`
        ${{ width: "0px 20px", display: "flex", flexDirection: "row" }}
        align-items: center;
        justify-content: center;
    `;
    
    const FilterText = styled.span`
        color: #ff6f00;
        font-size: 0.95rem;
        font-weight: 600;
        margin-right: 40px;
    `;
    
    const Select = styled.select`
        font-size: 0.95rem;
        padding: 5px;
        margin-right: 20px;
        margin: 10px 0px;
    `;
    const Option = styled.option``;

    const  Button = styled.button`
        padding: 5px 20px;
        background-color: #ff7f50;
        border: none;
        border-radius: 4px;
        color: #ffffff;
        cursor: pointer;
        transition: background-color 0.3s ease;
        margin-bottom: 1rem;
    `;

    return (
        <FilterContainer>
            <Filter>
                <FilterText>SORTED BY:</FilterText>
                    <Select value={sort} onChange={(e) => setSort(e.target.value)}>
                        <Option value="">Select</Option>
                        <Option value="rating:desc">Highest Rating</Option>
                        <Option value="rating:asc">Lowest Rating</Option>
                        <Option value="date:desc">Most Recent Reviews</Option>
                    </Select>
            </Filter>
            <Button onClick={handleSortChange}>Apply</Button>

        </FilterContainer>
    );
};

export default ReviewSort;









