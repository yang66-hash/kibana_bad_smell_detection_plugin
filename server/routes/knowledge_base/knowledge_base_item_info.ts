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
