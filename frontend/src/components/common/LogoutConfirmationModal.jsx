import React from 'react';
import Modal from '../ui/Modal';
import { LogOut, AlertCircle } from 'lucide-react';
import './LogoutConfirmationModal.css';

const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Logout"
      footer={
        <div className="logout-modal-footer">
          <button className="logout-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="logout-btn-confirm" onClick={onConfirm}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      }
    >
      <div className="logout-modal-content">
        <div className="logout-icon-container">
          <AlertCircle size={48} className="logout-warning-icon" />
        </div>
        <h3>Are you sure you want to sign out?</h3>
        <p>You will need to login again to access your dashboard and manage your events.</p>
      </div>
    </Modal>
  );
};

export default LogoutConfirmationModal;
