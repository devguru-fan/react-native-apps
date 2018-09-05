
import { combineReducers } from 'redux';

const EmptyCommitment = {
    commitment: '',
    remindAt: '6:00 PM',
    doneDates: []
};

const commitment = (state = {}, action) => {
    const { commitment, remindAt } = action;

    switch (action.type) {
        case "createCommitment":
            return Object.assign({}, state, {
                commitment,
                remindAt,
                doneDates: []
            });
        case "updateCommitment":
            return Object.assign({}, state, {
                commitment,
                remindAt
            });
        case "doneCommitment":
            let doneDates = state.doneDates.concat(new Date());

            return Object.assign({}, state, {
                doneDates
            });
        default:
            return state;
    }
}

const commitments = (state = {'ADD': EmptyCommitment}, action) => {
    let { id } = action;

    switch (action.type) {
        case "updateCommitment":
            if (id === 'ADD') {
                id = new Date().getTime();
                action.type = 'createCommitment';
            }

            return Object.assign({},
                                 state,
                                 {[id]: commitment(state[id], action)},
                                 {'ADD': EmptyCommitment});
        case "doneCommitment":
            return Object.assign({},
                                 state,
                                 {[id]: commitment(state[id], action)},
                                 {'ADD': EmptyCommitment});
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    commitments
});

export default rootReducer;
