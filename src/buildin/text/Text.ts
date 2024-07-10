

export interface Text {
    apply(context: any, globalArgs?: any): TextBlock; 
}

export interface TextBlock {
    content: string | Array<TextBlock>;
    types?: Array<string>; 
}
