import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import Home from "../components/Home"
import {
  onSetDefinitions,
  onSetProperties,
  onSelectDefinition,
  onSetUser,
  onSetSnacker
} from "../store/actions"

const mapStateToProps = ({user}) =>
  ({
    user
  })

const mapDispatchToProps = dispatch =>
({
  onSetDefinitions(definitions) {
    dispatch(onSetDefinitions(definitions))
  },
  onSetProperties(properties) {
    dispatch(onSetProperties(properties))
  },
  onSelectDefinition(definition) {
    dispatch(onSelectDefinition(definition))
  },
  onSetSnacker(snacker) {
    dispatch(onSetSnacker(snacker))
  },
  onSetUser(user) {
    dispatch(onSetUser(user))
  }
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
