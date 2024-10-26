import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase";
import { UPDATE_INPUTS,
    UPDATE_SUCCESS,
    UPDATE_ERROR,
    UPDATE_LOADING,
    CLEAR_INPUTS,
    SET_COLLECTION_DATA, 
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
  interface SetCollectionDataAction {
    type: typeof SET_COLLECTION_DATA;
    payload: {
      collectionName: string;
      data: any[];
    };
  }
  
// Tipos de acción para el dispatch
export type ObjectActionTypes = UpdateInputsAction | UpdateSuccessAction | UpdateErrorAction| UpdateLoadingAction | ClearInputsAction  | SetCollectionDataAction;

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
export const updateError = (errorMessage: string | null): UpdateErrorAction => ({
  type: UPDATE_ERROR,
  payload: errorMessage,
});
export const clearInputs = (category: string): ClearInputsAction => ({
  type: CLEAR_INPUTS,
  payload: category,
});
export const setCollectionData = (collectionName: string, data: any[]): SetCollectionDataAction => ({
  type: SET_COLLECTION_DATA,
  payload: { collectionName, data },
});


// Enviar datos a Firebase
export const writeToFirebase = (data: any, selectedOption: string): AppThunk => {
    return async (dispatch) => {
      try {
        dispatch(setLoading(true))

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
      finally {
        dispatch(setLoading(false));
      }
    };
  };


  // Obtener datos de Firebase
export const fetchCollectionData = (collectionName: string, searchInput: string): AppThunk => {
  return async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));
      dispatch(updateError(null));
      let q;

      
      if (searchInput) {
        if (collectionName === 'Dni') {
          q = query(collection(firestore, collectionName), where('documentNumber', '==', searchInput));
        } else if (collectionName === 'Cash') {
          q = query(collection(firestore, collectionName), where('amount', '==', searchInput));
        } else if (collectionName === 'Clothing') {
          q = query(collection(firestore, collectionName), where('brand', '==', searchInput));
        }  else if (collectionName === 'Phone') {
          q = query(collection(firestore, collectionName), where('model', '==', searchInput));
        }  else if (collectionName === 'Other') {
          q = query(collection(firestore, collectionName), where('description', '==', searchInput));
        }
      }

      // Si no se especifica búsqueda, consulta toda la colección
      if (!q) {
        q = query(collection(firestore, collectionName));
      }
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc =>  ({
        ...doc.data(),
        id: doc.id, // Incluye el ID del documento en los datos
      }));
      


      if (data.length === 0) {
        // Si no hay datos, lanzar un error
        throw new Error('No se encontraron datos para la búsqueda.');
      }

      // Despacha la acción para guardar los datos en el estado
      dispatch(setCollectionData(collectionName, data));
      
      const state = getState();
      const dataToStore = state.objects.collectionData[collectionName];
      sessionStorage.setItem("searchedCollectionData", JSON.stringify(dataToStore));
      
    
    } catch (error: any) {
      dispatch(updateError(error.message));
    } finally {
      console.log('Setting loading to false');
      dispatch(setLoading(false));
    }
    
  };
};