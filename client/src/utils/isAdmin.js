const isAdmin = (s) => {
    // Handle undefined, null, or non-string values safely
    if (!s || typeof s !== 'string') {
        return false
    }
    
    if (s === 'ADMIN') {
        return true
    }

    return false
}

export default isAdmin
