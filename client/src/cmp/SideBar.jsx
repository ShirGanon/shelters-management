import React from 'react';
import styled from 'styled-components';

const Sidebar = styled.div`
  width: 200px;
  margin-right: 20px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  appearance: none;
  background-color: #f8f8f8;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    border-color: #aaa;
  }

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const SideBar = ({ selected, onChange, buildings }) => {
  return (
    <Sidebar>
      <Label htmlFor="areaSelect">Area</Label>
      <Select
        id="areaSelect"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        {buildings.map((building) => (
          <option key={building} value={building}>
            {building}
          </option>
        ))}
      </Select>
    </Sidebar>
  );
};

export default SideBar;
