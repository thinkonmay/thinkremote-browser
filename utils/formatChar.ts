
const special = "!@#$%^&*()_+"
export function useShift(char: string) : boolean {
    if (char.length != 1) 
        return false
    else if (char.toLowerCase() != char)
        return true
    else if (special.includes(char))
        return true
        

    switch (char) {
        default:
            return false;
    }
    
}