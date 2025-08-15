import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { MdBugReport } from "react-icons/md";
import SideBar from "./SideBar";
import MapView from "./MapView";

const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  position: relative;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 10px;
`;

const Title = styled.h1`
  font-size: 52px;
  margin: 0;
  font-weight: bold;
  cursor: default;
`;

const ReportWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
`;

const ReportButton = styled.button`
  padding: 6px 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #d32f2f;
  }
`;

const UploadWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 0;
`;

const UploadButton = styled.button`
  padding: 14px 40px;
  background-color: #d3d3d3;
  color: #333;
  border: none;
  font-size: 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  width: 1300px;
  max-width: 100%;
  margin: 0 auto;

  &:hover {
    background-color: #c0c0c0;
  }
`;

const MainContent = styled.div`
  display: flex;
  margin-top: 20px;
`;

const ContentArea = styled.div`
  flex-grow: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AddButton = styled.button`
  align-self: flex-end;
  margin-bottom: 10px;
  padding: 10px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  z-index: 10;

  &:hover {
    background-color: #0056b3;
  }
`;

const CenteredMapWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px 0;
  box-sizing: border-box;
`;

const MapResponsiveWrapper = styled.div`
  width: 100%;
  max-width: 500px; // reduced from 800px to 500px
  aspect-ratio: 16 / 9;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ShelterFinder = () => {
  const [selectedBuilding, setSelectedBuilding] = useState("Building A");
  const [buildings, setBuildings] = useState([
    "Building A",
    "Building B",
    "Building C",
  ]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/shelters/list")
      .then((res) => {
        // אם ה־API מחזיר רשימה, אפשר לעדכן את buildings כאן
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleAddShelter = () => {
    alert("Add Shelter clicked!");
  };

  return (
    <Container>
      <ReportWrapper>
        <ReportButton title="Report a bug" aria-label="Report a bug">
          <MdBugReport /> Report an Issue
        </ReportButton>
      </ReportWrapper>

      <Header>
        <Title>College Shelter Finder & Manager</Title>
      </Header>

      <UploadWrapper>
        <UploadButton>Upload a New Image</UploadButton>
      </UploadWrapper>

      <MainContent>
        <SideBar
          selected={selectedBuilding}
          onChange={setSelectedBuilding}
          buildings={buildings}
        />

        <ContentArea>
          <AddButton onClick={handleAddShelter}>הפעל הוספת מקלטים</AddButton>

          <CenteredMapWrapper>
            <MapResponsiveWrapper>
              <MapView
                imageUrl="../HIT1.png"
                area="1"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </MapResponsiveWrapper>
          </CenteredMapWrapper>
        </ContentArea>
      </MainContent>
    </Container>
  );
};

export default ShelterFinder;
