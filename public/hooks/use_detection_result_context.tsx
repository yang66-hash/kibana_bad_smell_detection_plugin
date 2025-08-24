import { DetectionResTableListItem } from '../../common/interfaces/interfaces';
import React, { createContext, useContext, useState } from 'react';


const DetectionResContext = createContext<{
    detectionResItem: DetectionResTableListItem | null;
    setDetectionResItem: React.Dispatch<React.SetStateAction<DetectionResTableListItem | null>>;
  } | undefined>(undefined);

export const DetectionResProvider = ({ children }: { children: React.ReactNode }) =>{
    const [detectionResItem, setDetectionResItem] = useState<DetectionResTableListItem | null>(null);


    return (
        <DetectionResContext.Provider  value={{ detectionResItem, setDetectionResItem }}>
            {children}
        </DetectionResContext.Provider>
    );
};

export const useDetectionRes = () => {
    const context = useContext(DetectionResContext);
    if (!context) {
      throw new Error('useDetectionRes must be used within a DetectionResProvider');
    }
    return context;
  };