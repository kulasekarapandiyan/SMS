import React from 'react';
import AddSubject from './AddSubject';

// Reuse AddSubject form for editing for now. In a real app, prefill data via API by id.
const EditSubject: React.FC = () => {
  return <AddSubject />;
};

export default EditSubject;


