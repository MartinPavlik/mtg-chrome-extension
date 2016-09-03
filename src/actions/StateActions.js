export const LOAD_PREVIOUS_STATES = 'LOAD_PREVIOUS_STATES';
export const LOAD_STATE = 'LOAD_STATE';
export const SAVE_STATE = 'SAVE_STATE';

export function loadState(state) {
   return {
      type: LOAD_STATE,
      state
   }
}

export function saveState(state) {
   return {
      type: SAVE_STATE,
      state
   }
}

export function loadPreviousStates() {
   return {
      type: LOAD_PREVIOUS_STATES,
      states
   }
}