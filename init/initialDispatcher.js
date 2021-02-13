// Actions

import { serverDispatch } from "../helpers/serverDispatch";

export const initialDispatcher = async (context, store) => {
  await serverDispatch(store, (dispatch) => {
    // dispatch(profileActions.setVerified());
  });

  // const state = store.getState();

  const stateUpdates = {
  //   profile: {
  //     isVerified: selectIsVerified(true),
  //   }
  }

  return {
    store,
    stateUpdates,
  };
}

