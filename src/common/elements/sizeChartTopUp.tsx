import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label } from 'reactstrap';

interface PhotoTopUpModalProps {
  isOpen: boolean;
  toggle: () => void;
  imageUrl: string | null;
}

const SizeChartTopUp: React.FC<PhotoTopUpModalProps> = ({ isOpen, toggle, imageUrl }) => {
  return (
    <Modal  style={{ borderRadius: "100px" }} isOpen={isOpen} toggle={toggle}>
      {/* Wrap content in a container to ensure proper styling */}
      <div style={{ borderRadius: "50px", overflow: "hidden", padding: "5px", width: "100%" }}>
        <ModalHeader toggle={toggle}><Label for="photo" style={{fontWeight:"bold" ,fontSize:"16px"}}>SIZE CHART</Label></ModalHeader>
        <ModalBody>
          <FormGroup>
            {imageUrl ? (
              <div>
                <img
                  src={imageUrl}
                  alt="current-top-up-photo"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    marginBottom: '10px',
                    borderRadius: '8px', // Maintain the image corner radius
                    backgroundColor:"white"
                  }}
                />
              </div>
            ) : (
              <p>No size chart available.</p>
            )}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button style={{borderRadius:"20px", padding:"20px", fontSize:"12px", backgroundColor:"#dc3545"}}  onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};

export default SizeChartTopUp;
