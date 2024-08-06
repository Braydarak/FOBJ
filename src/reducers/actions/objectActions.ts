import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { initializeApp } from "firebase/app";
import { collection, addDoc, getFirestore, query, where, getDocs } from "firebase/firestore";
import firebaseConfig from "../../firebase";
import { UPDATE_INPUTS,
    UPDATE_SUCCESS,
    UPDATE_ERROR,
    UPDATE_LOADING,
    CLEAR_INPUTS, 
    } from '../types';


interface UpdateInputsAction {
    type: typeof UPDATE_INPUTS;
    payload: any;
  }
  
  interface UpdateSuccessAction {
    type: typeof UPDATE_SUCCESS;
  }
  
  interface UpdateErrorAction {
    type: typeof UPDATE_ERROR;
    payload: any;
  }
  interface UpdateLoadingAction {
    type: typeof UPDATE_LOADING;
    payload: boolean;
  }
  interface ClearInputsAction {
    type: typeof CLEAR_INPUTS;
    payload: string;
  }
  
// Tipos de acción para el dispatch
export type ObjectActionTypes = UpdateInputsAction | UpdateSuccessAction | UpdateErrorAction| UpdateLoadingAction | ClearInputsAction;

// Definir tipo para Thunk
export type AppThunk = ThunkAction<void, any, unknown, Action<string>>;

// Acciones
export const updateInputs = (category: string, inputs: any): UpdateInputsAction => ({
  type: UPDATE_INPUTS,
  payload: { category, inputs },
});
export const setLoading = (loading: boolean): UpdateLoadingAction => ({
  type: UPDATE_LOADING,
  payload: loading,
});
export const updateError = (errorMessage: string): UpdateErrorAction => ({
  type: UPDATE_ERROR,
  payload: errorMessage,
});
export const clearInputs = (category: string): ClearInputsAction => ({
  type: CLEAR_INPUTS,
  payload: category,
});


// Enviar datos a Firebase
export const writeToFirebase = (data: any, selectedOption: string): AppThunk => {
    return async (dispatch) => {
      try {
        dispatch({ type: UPDATE_LOADING });
        const firebaseApp = initializeApp(firebaseConfig);
        const firestore = getFirestore(firebaseApp);

        if (selectedOption === "Dni" && !data.documentNumber) {
          throw new Error('Document number is undefined.');
        }
        

        if (selectedOption === "Dni") {
          const q = query(collection(firestore, selectedOption), where("documentNumber", "==", data.documentNumber));
          const querySnapshot = await getDocs(q);
  
          if (!querySnapshot.empty) {
            throw new Error('Document with the same number already exists.');
          }
        }
  
        await addDoc(collection(firestore, selectedOption), data);
        dispatch({ type: UPDATE_SUCCESS });
      } catch (e: any) {
        dispatch({ type: UPDATE_ERROR, payload: e.message });
      }
    };
  };