import styled from 'styled-components';
import { MdBugReport } from 'react-icons/md';

const Wrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
`;

const Button = styled.button`
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

const ReportButton = () => (
  <Wrapper>
    <Button title="Report a bug" aria-label="Report a bug">
      <MdBugReport /> Report an Issue
    </Button>
  </Wrapper>
);

export default ReportButton;
