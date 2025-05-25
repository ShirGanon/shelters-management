import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { MdReportProblem } from 'react-icons/md';
import hitImage from '../../HIT.png'; // adjust path if needed

const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  position: relative;  /* for absolute positioning Report button */
`;

const ReportButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  background-color: #f44336; /* red */
  color: white;
  border: none;
  border-radius: 50%; /* circle */
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  padding: 0;

  &:hover {
    background-color: #d32f2f;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 10px;
`;

const Title = styled.h1`
  font-size: 52px;
  margin: 0;
  font-weight: bold;
`;

const MainContent = styled.div`
  display: flex;
  flex-wrap: nowrap;   /* prevent wrapping so content area can be wider */
`;

const Sidebar = styled.div`
  width: 200px;
  margin-right: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
`;

const Select = styled.select`
  width: 100%;
  padding: 6px;
`;

const ContentArea = styled.div`
  flex-grow: 1;
  border: 1px solid #ddd;
  padding: 10px;
  position: relative;
  min-height: 200px;
  max-width: 1600px;
  margin: 0 auto; /* center horizontally */
`;

const AddButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
`;

const UploadButton = styled.button`
  width: 100%;          /* full width of container */
  padding: 14px 20px;
  background-color: #d3d3d3;
  color: #333;
  border: none;
  font-size: 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: background-color 0.3s ease;
  margin-bottom: 20px;

  &:hover {
    background-color: #c0c0c0;
  }
`;

const StyledImage = styled.img`
  width: 100%;
  max-width: none;      /* Remove max-width restriction */
  height: auto;
  border: 2px solid #ccc;
  border-radius: 10px;
  margin-top: 30px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  min-width: 1000px;    /* Force image minimum width */
  max-width: 1800px;    /* Optional max width */
`;

const ShelterFinder = () => {
  const [selectedBuilding, setSelectedBuilding] = useState("Building A");
  const [buildings, setBuildings] = useState(["Building A", "Building B", "Building C"]);

  useEffect(() => {
    axios.get('http://localhost:8080/shelters/list')
      .then((res) => {
        // Could dynamically set building names from response if needed
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <Container>
      <ReportButton title="Report Issue">
        <MdReportProblem size={22} />
      </ReportButton>

      <Header>
        <Title>College Shelter Finder & Manager</Title>
      </Header>

      <MainContent>
        <Sidebar>
          <Label htmlFor="areaSelect">Area</Label>
          <Select
            id="areaSelect"
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
          >
            {buildings.map((building) => (
              <option key={building} value={building}>
                {building}
              </option>
            ))}
          </Select>
        </Sidebar>

        <ContentArea>
          <p>Showing shelters for: <strong>{selectedBuilding}</strong></p>
          <AddButton>Add Shelter</AddButton>

          <UploadButton>Upload a New Image</UploadButton>

          <StyledImage src={hitImage} alt="HIT Campus Map" />
        </ContentArea>
      </MainContent>
    </Container>
  );
};

export default ShelterFinder;
