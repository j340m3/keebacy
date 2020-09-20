const initialState = {
    charsTyped: 0,
    errorPercent: 0,
    textPosition: 0,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_CHARS_TYPED':
        case 'CHANGE_TEXT_POSITION':
        case 'CHANGE_ERROR_PERCENT':
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state
    }
}
