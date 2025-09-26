
//use to receive bad smell types
export interface IBadSmellType{
    name:string;
    description:string;
    orderIndex:string;
    parentId:string|null;
}

export interface IBadSmell{
    name:string; 
    aliases:string[] // other names
    description:string;
    detection:string;
    consequences:string;
    cause:string|null;
    example:string;
    sources:IBibTexObj[];
    categoryName:string;
    categoryIndex:string;
    typeName:string;
    typeIndex:string;
    evidence:string;
    detectMethod:string;
    detectable:boolean;
    realized:boolean;
}

//use to parse source of bad smells
export interface IBibTexObj{
    publisher:string;
    year:string;
    pages:string;
    volume:string;
    journal:string;
    author:string;
    title:string;
    ENTRYTYPE:string;
    ID:string;
}


export interface BadSmellListItem {
    badSmellName: string;
    primaryCategory:string;
    secondaryCategory:string;
    detectable?: boolean;
    detectMethod?:string;
    activeStatus?:boolean;
}
//use to receive list item of detection results
export interface DetectionResListItem {
id:string;
detectionID:string;
targetInstance:string;
status: boolean;
timestamp: string;
detector: string;
name: string;
categoryName: string;
categoryIndex: string;
typeName: string;
detectMethod:string;
context?:object;
}

export interface DetectionResTableListItem {
targetInstance:string;
status: boolean;
involvedBSSet:string[];
involvedBSPriType:string[];
involvedBSSecType:string[];
}

  
export interface IBSDStatistics {
    categoryName: string;
    count: number;
}