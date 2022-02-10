export const uploaderActions = {
  signRequest: 'SIGN_UPLOAD_REQUEST',
};

export const fileUploaderReducer = (state, action) => {
  switch (action.type) {
    case uploaderActions.signRequest:
      return { ...state, signedRequestArray: action.signedArray };
    default:
      return state;
  }
};
