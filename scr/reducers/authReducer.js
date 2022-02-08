export const actions = {
  loginOrRegister: 'LOGIN_OR_REGISTER',
  logout: 'LOGOUT',
  update_info: 'UPDATE_AVATAR',
  update_state: 'UPDATE_STATE',
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case actions.loginOrRegister:
      return { ...state, user: action.user };
    case actions.logout:
      return { ...state, user: null };
    case actions.update_info:
      return { ...state, user: action.updatedUser };
    case actions.update_state:
      return { ...state, updateState: action.updateState };
    default:
      return state;
  }
};
