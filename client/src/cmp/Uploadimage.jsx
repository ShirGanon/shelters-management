import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 0;
`;

const Button = styled.button`
  padding: 14px 40px;
  background-color: #d3d3d3;
  color: #333;
  border: none;
  font-size: 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: background-color 0.3s ease;
  width: 1300px;
  max-width: 100%;
  margin: 0 auto;

  &:hover {
    background-color: #c0c0c0;
  }
`;

const UploadImage = () => (
  <Wrapper>
    <Button>Upload a New Image</Button>
  </Wrapper>
);

export default UploadImage;
