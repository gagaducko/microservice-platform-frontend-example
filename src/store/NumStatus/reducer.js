import handler from '.'

let reducer = (state = {...handler.state}, action) => {
    let newState = JSON.parse(JSON.stringify(state));

    handler.actions[action.type] && handler.actions[action.type](newState, action)

    return newState;
}

export default reducer;