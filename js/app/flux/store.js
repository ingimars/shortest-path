import AppDispatcher from './dispatcher.js'
import Constant from './constants.js';
import { EventEmitter } from 'events';
import ExhaustiveSearch from "../logic/algorithms/exhaustive_search";
import NearestNeighbour from "../logic/algorithms/nearest_neighbour";
import KNearestNeighbour from "../logic/algorithms/k_nearest_neighbour";

let CHANGE_EVENT = 'change';
class Store extends EventEmitter {

  constructor() {
    super();
    this.points = [];
    this.algorithms = {
      "Nearest neighbour": new NearestNeighbour(),
      "KNearest neighbour": new KNearestNeighbour(),
      "Exhaustive search": new ExhaustiveSearch()
    };
    this.selectedAlgorithm = "Nearest neighbour";
    this.selectedPoint = null;
    this.startPoint = null;
    this.runResult = {
      distance: null,
      duration: null
    };
    this.loading = false;
    this.dialogData = {visible: false};
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  }

  isLoading() {
    return this.loading;
  }

  setIsLoading(isLoadingVal) {
    this.loading = isLoadingVal;
  }

  getAlgorithms() {
    return this.algorithms;
  }

  getDialogData() {
    return this.dialogData;
  }

  setDialogData(dialogData) {
    this.dialogData = dialogData;
  }

  removeDialog() {
    this.dialogData.visible = false;
  }

  showDialog() {
    this.dialogData.visible = true;
  }

  getPoints() {
    return this.points;
  }

  setPoints(points) {
    this.points = points;
  }

  getRunResult() {
    return this.runResult;
  }

  setRunResult(runResult) {
    this.runResult = runResult;
  }

  getSelectedAlgorithm() {
    return this.selectedAlgorithm;
  }

  setSelectedAlgorithm(selectedAlgorithm) {
    this.selectedAlgorithm = selectedAlgorithm;
  }

  getSelectedPoint() {
    return this.selectedPoint;
  }

  setSelectedPoint(selectedPoint) {
    this.selectedPoint = selectedPoint;
  }

  getStartPoint() {
    return this.startPoint;
  }

  setStartPoint(startPoint) {
    console.log('store setStartPoint...', startPoint);
    this.startPoint = startPoint;
  }

};


let AppStore = new Store();
AppDispatcher.register(function(payload){
  let action = payload.action;
  switch(action.actionType) {
    case Constant.SET_IS_LOADING:
      AppStore.setIsLoading(payload.action.item);
      break;
    case Constant.REMOVE_DIALOG:
      AppStore.removeDialog();
      break;
    case Constant.SHOW_DIALOG:
      AppStore.showDialog();
      break;
    case Constant.SET_DIALOG_DATA:
      AppStore.setDialogData(payload.action.item);
      break;
    case Constant.SET_POINTS:
      AppStore.setPoints(payload.action.item);
      break;
    case Constant.SET_SELECTED_ALGORITHM:
      AppStore.setSelectedAlgorithm(payload.action.item);
      break;
    case Constant.SET_SELECTED_POINT:
      AppStore.setSelectedPoint(payload.action.item);
      break;
    case Constant.SET_START_POINT:
      AppStore.setStartPoint(payload.action.item);
      break;
    case Constant.SET_RUN_RESULT:
      AppStore.setRunResult(payload.action.item);
      break;
    }
  AppStore.emitChange();
  return true;
})

export default AppStore;