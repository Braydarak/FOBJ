import { UPDATE_INPUTS, UPDATE_SUCCESS, UPDATE_ERROR, UPDATE_LOADING, CLEAR_INPUTS } from "./types";

export interface Inputs {
  [key: string]: string;
}

export interface ObjectState {
  dniInputs: Inputs;
  phoneInputs: Inputs;
  clothingInputs: Inputs;
  cashInputs: Inputs;
  otherInputs: Inputs;
  error: any;
  loading: boolean;
  success: boolean;
}

const initialState: ObjectState = {
  dniInputs: {
    name: '',
    address: '',
    date: '',
    documentNumber: '',
    map: '',
  },
  phoneInputs: {
    model: '',
    color: '',
    date: '',
    information: '',
    map: '',
  },
  clothingInputs:{
    brand: '',
    date: '',
    description: '',
    map: '',
  },
  cashInputs:{
    amount: '',
    date: '',
    location: '',
    map: '',
  },
  otherInputs:{
    description: '',
    date: '',
    map: '',
  },
  error: null,
  loading: false,
  success: false,
};
const objectReducer = (state = initialState, action: any): ObjectState => {
  switch (action.type) {
    case UPDATE_INPUTS:
      return {
        ...state,
        [action.payload.category]: {
          ...state[action.payload.category as keyof ObjectState],
          ...action.payload.inputs,
        },
        success: false,
      };
    case UPDATE_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
      };
    case UPDATE_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
      case UPDATE_LOADING:
        return {
          ...state,
          loading: true,
        };
        case CLEAR_INPUTS:
          return {
            ...state,
            [`${action.payload}Inputs`]: {},
            success: false,
          };
    default:
      return state;
  }
};

export default objectReducer;
