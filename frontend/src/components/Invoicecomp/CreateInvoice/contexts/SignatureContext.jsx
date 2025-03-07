import React, { createContext, useContext, useRef, useState } from 'react';

const SignatureContext = createContext();

export const SignatureProvider = ({ children }) => {
  const signatureRef = useRef(null);
  const uploadSignatureRef = useRef(null);
  const [signatureData, setSignatureData] = useState('');
  const [typedSignature, setTypedSignature] = useState('');
  const [selectedFont, setSelectedFont] = useState({ name: 'Roboto', variable: 'Roboto' });
  const [typedSignatureFontSize] = useState(24);
  const [typedSignatureFonts] = useState([
    { name: 'Roboto', variable: 'Roboto' },
    { name: 'Open Sans', variable: 'Open+Sans' },
  ]);
  const [uploadSignatureImg, setUploadSignatureImg] = useState('');

  const handleUploadSignatureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUploadSignatureImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveUploadedSignature = () => {
    setUploadSignatureImg('');
  };

  const clearSignature = () => {
    setSignatureData('');
  };

  const handleCanvasEnd = () => {
    if (signatureRef.current) {
      setSignatureData(signatureRef.current.toDataURL());
    }
  };

  const clearTypedSignature = () => {
    setTypedSignature('');
  };

  return (
    <SignatureContext.Provider
      value={{
        signatureRef,
        uploadSignatureRef,
        signatureData,
        setSignatureData,
        typedSignature,
        setTypedSignature,
        selectedFont,
        setSelectedFont,
        typedSignatureFontSize,
        typedSignatureFonts,
        uploadSignatureImg,
        setUploadSignatureImg,
        handleUploadSignatureChange,
        handleRemoveUploadedSignature,
        clearSignature,
        handleCanvasEnd,
        clearTypedSignature,
      }}
    >
      {children}
    </SignatureContext.Provider>
  );
};

export const useSignatureContext = () => useContext(SignatureContext);
