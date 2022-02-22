export const actions = {
  loginOrRegister: 'LOGIN_OR_REGISTER',
  logout: 'LOGOUT',
  update_info: 'UPDATE_AVATAR',
  update_state: 'UPDATE_STATE',
  set_push_token: 'DEVICE_PUSH_TOKEN',
  select_user: 'SELECT_USER',
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
    case 'DEVICE_PUSH_TOKEN':
      return { ...state, devicePushToken: action.token };
    case 'SELECT_USER':
      return { ...state, selectedUser: action.user };
    default:
      return state;
  }
};
