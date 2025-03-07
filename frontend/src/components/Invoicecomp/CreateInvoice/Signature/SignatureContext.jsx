import React, { createContext, useContext, useRef, useState } from 'react';

const SignatureContext = createContext();

export const SignatureProvider = ({ children }) => {
  const signatureRef = useRef(null);
  const [signatureData, setSignatureData] = useState(null);
  const [typedSignature, setTypedSignature] = useState('');
  const [selectedFont, setSelectedFont] = useState({ name: 'Dancing Script', value: "'Dancing Script', cursive" });
  const [uploadSignatureImg, setUploadSignatureImg] = useState(null);

  const handleCanvasEnd = () => {
    if (signatureRef.current) {
      setSignatureData(signatureRef.current.toDataURL());
    }
  };

  return (
    <SignatureContext.Provider
      value={{
        signatureRef,
        signatureData,
        setSignatureData,
        handleCanvasEnd,
        typedSignature,
        setTypedSignature,
        selectedFont,
        setSelectedFont,
        uploadSignatureImg,
        setUploadSignatureImg,
      }}
    >
      {children}
    </SignatureContext.Provider>
  );
};

export const useSignatureContext = () => useContext(SignatureContext);