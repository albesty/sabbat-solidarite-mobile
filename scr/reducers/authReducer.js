export const actions = {
  loginOrRegister: 'LOGIN_OR_REGISTER',
  logout: 'LOGOUT',
  update_avatar: 'UPDATE_AVATAR',
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case actions.loginOrRegister:
      return { ...state, user: action.user };
    case actions.logout:
      return { ...state, user: null };
    case actions.update_avatar:
      return { ...state, user: action.updatedUser };
    default:
      return state;
  }
};
