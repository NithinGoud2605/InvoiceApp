import React, { createContext, useContext, useRef, useState, useCallback } from 'react';

const SignatureContext = createContext();

export const SignatureProvider = ({ children }) => {
  const signatureRef = useRef(null);

  // Contains base64 data of the drawn signature
  const [signatureData, setSignatureData] = useState(null);

  // Typed signature text
  const [typedSignature, setTypedSignature] = useState('');

  // Chosen font for typed signature
  const [selectedFont, setSelectedFont] = useState({
    name: 'Dancing Script',
    value: "'Dancing Script', cursive"
  });

  // Stores uploaded signature image data
  const [uploadSignatureImg, setUploadSignatureImg] = useState(null);

  // Called when drawing on the canvas ends
  const handleCanvasEnd = useCallback(() => {
    if (signatureRef.current) {
      setSignatureData(signatureRef.current.toDataURL());
    }
  }, []);

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
        setUploadSignatureImg
      }}
    >
      {children}
    </SignatureContext.Provider>
  );
};

export const useSignatureContext = () => useContext(SignatureContext);
