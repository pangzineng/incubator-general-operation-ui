import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import Home from "../components/Home"
import {
  onSetUIConfig
} from "../store/actions"
const mapStateToProps = ({uiConfig}) =>
  ({
    uiConfig: uiConfig
  })

const mapDispatchToProps = dispatch =>
  ({
    onSetUIConfig(uiConfig) {
      dispatch(onSetUIConfig(uiConfig))
    },
  })


const mergeProps = (state, actions, props) =>
  ({
    ...state,
    ...actions,
    history: props.history
  })

export const HomeContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Home))
