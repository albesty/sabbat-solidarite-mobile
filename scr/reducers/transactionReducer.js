export const transactionActions = {
  add_transaction: 'ADD_NEW_TRANSACTION',
  all_user_transaction: 'ALL_TRANSACTION',
};

export const transactionReducer = (state, action) => {
  switch (action.type) {
    case transactionActions.add_transaction:
      const newList = [...state.transactionList, action.transaction];
      return { ...state, transactionList: newList };
    case transactionActions.all_user_transaction:
      return { ...state, transactionList: action.list };
    default:
      return state;
  }
};
