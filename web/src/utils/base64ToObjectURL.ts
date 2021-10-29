export const base64ToObjectURL = (base64: string): string => {
    if(base64){
        let arrayBufferView = Uint8Array.from(Buffer.from(base64, "base64"), c => c);
        let blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
        let objectURL = URL.createObjectURL(blob);
        return objectURL;
    }
    return "";
}