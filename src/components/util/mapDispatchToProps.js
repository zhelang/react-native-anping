import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/actionCreators';

//Map Dispatch To Props
export function mapDispatchToProps(dispatch){
  return {actions: bindActionCreators(actionCreators, dispatch)};
}