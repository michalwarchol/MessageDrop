export const generateVerificationCode = () => {
    let code = "";
    for(let i=0; i<6; i++){
        let num = Math.floor(Math.random()*10);
        code+=num;
    }
    return code;
}