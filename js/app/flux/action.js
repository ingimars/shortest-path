import AppDispatcher from './dispatcher.js';
import Constant from './constants.js';

export default {
  setIsLoading : (isLoading) => {
    AppDispatcher.handleViewAction({
      actionType: Constant.SET_IS_LOADING,
      item: isLoading
    })
  },
  removeDialog : () => {
    AppDispatcher.handleViewAction({actionType: Constant.REMOVE_DIALOG})
  },
  showDialog : () => {
    AppDispatcher.handleViewAction({actionType: Constant.SHOW_DIALOG})
  },
  setDialogData : (dialogData) => {
    AppDispatcher.handleViewAction({
      actionType: Constant.SET_DIALOG_DATA,
      item: dialogData
    })
  },
  setDialogData : (dialogData) => {
    AppDispatcher.handleViewAction({
      actionType: Constant.SET_DIALOG_DATA,
      item: dialogData
    })
  },
  setPoints : (points) => {
    AppDispatcher.handleViewAction({
      actionType: Constant.SET_POINTS,
      item: points
    })
  },
  setRunResult : (result) => {
    AppDispatcher.handleViewAction({
      actionType: Constant.SET_RUN_RESULT,
      item: result
    })
  },
  setSelectedAlgorithm : (algorithm) => {
    AppDispatcher.handleViewAction({
      actionType: Constant.SET_SELECTED_ALGORITHM,
      item: algorithm
    })
  },
  setSelectedPoint : (point) => {
    AppDispatcher.handleViewAction({
      actionType: Constant.SET_SELECTED_POINT,
      item: point
    })
  },
  setStartPoint : (point) => {
    AppDispatcher.handleViewAction({
      actionType: Constant.SET_START_POINT,
      item: point
    })
  },  
}