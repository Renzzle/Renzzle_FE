import React, { createContext, ReactNode, useState, useContext } from 'react';

interface EmailAuthCodeContextType {
  emailAuthCode: string | null;
  setEmailAuthCode: (code: string) => void;
  clearEmailAuthCode: () => void;
}

const EmailAuthCodeContext = createContext<EmailAuthCodeContextType | undefined>(undefined);

interface EmailAuthCodeProviderProps {
  children: ReactNode;
}

export const EmailAuthCodeProvider = ({ children }: EmailAuthCodeProviderProps) => {
  const [emailAuthCode, setEmailAuthCodeState] = useState<string | null>(null);

  const setEmailAuthCode = (code: string) => {
    setEmailAuthCodeState(code);
  };

  const clearEmailAuthCode = () => {
    setEmailAuthCodeState(null);
  };

  return (
    <EmailAuthCodeContext.Provider value={{ emailAuthCode, setEmailAuthCode, clearEmailAuthCode }}>
      {children}
    </EmailAuthCodeContext.Provider>
  );
};

export const useEmailAuthCode = () => {
  const context = useContext(EmailAuthCodeContext);
  if (!context) {
    throw new Error('useEmailAuthCode must be used within an EmailAuthCodeProvider');
  }
  return context;
};

export default EmailAuthCodeContext;
