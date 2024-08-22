import React, { useState } from 'react';
import styled from "styled-components";

const FilterSort = ({ onFilterSortChange }) => {
    const [type, setType] = useState('');
    const [sort, setSort] = useState('');

    const handleFilterSortChange = () => {
        onFilterSortChange({ type, sort });
    };

    const FilterContainer = styled.div`
    display: flex;
    justify-content: space-between;
  `;
  
    const Filter = styled.div`
        margin-left: 20px;
        ${{ width: "0px 20px", display: "flex", flexDirection: "column" }}
    `;
    
    const FilterText = styled.span`
        color: #ff6f00;
        font-size: 20px;
        font-weight: 600;
        margin-right: 20px;
        ${{ marginRight: "0px" }}
    `;
    
    const Select = styled.select`
        font-size: 16px;
        padding: 10px;
        margin-right: 20px;
        ${{ margin: "10px 0px" }}
    `;
    const Option = styled.option``;

    const  Button = styled.button`
        margin-right: 1200px;
        margin-top: 35px;
        font-size: 16px;
        border-radius: 5px;
        background-color: #ff6f00;
        color: white;
        border: none;
        height: 40px;
        width: 80px;
        cursor: pointer;
        align-content: center;
    `;

    return (
        <FilterContainer>
            <Filter>
                <FilterText>CATEGORIES:</FilterText>
                    <Select value={type} onChange={(e) => setType(e.target.value)}>
                        <Option value="">All</Option>
                        <Option value="Chinese">Chinese</Option>
                         <Option value="German">German</Option>
                        <Option value="Italian">Italian</Option>
                        <Option value="Korean">Korean</Option>
                    </Select>
            </Filter>
            <Filter>
                <FilterText>SORTED BY:</FilterText>
                    <Select value={sort} onChange={(e) => setSort(e.target.value)}>
                        <Option value="">Select</Option>
                        <Option value="rating:desc">Best Rating</Option>
                        <Option value="price:asc">Lowest Price</Option>
                        <Option value="numReviews:desc">Most Reviews</Option>
                    </Select>
            </Filter>
            <Button onClick={handleFilterSortChange}>Apply</Button>

        </FilterContainer>
    );
};

export default FilterSort;









