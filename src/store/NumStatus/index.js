const store = {
    state: {
        num: 20
    },
    actions: {
        add(newState, action) {
            newState.num += action.val
        }
    }
}

export default store;