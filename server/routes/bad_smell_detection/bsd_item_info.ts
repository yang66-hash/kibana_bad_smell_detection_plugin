export interface IBSDetectionItem {
    id: string;
    detectionID:string;
    status: boolean;
    timestamp: Date;
    detector:string;
    name: string;
    categoryName:string;
    typeName:string;
    detectMethod:string;
    targetInstance:string;
    context: object;
}

export interface IBSDFurtherItem {
    status: boolean;
    targetInstance:string;
    involvedBSSet:string[];
    involvedBSPriType:string[];
    involvedBSSecType:string[];
}

export interface IBSDStatistics {
    categoryName: string;
    count: number;
}