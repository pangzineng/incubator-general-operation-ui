import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import Header from "../components/Header"
import {
  onSetDefinitions,
  onSetProperties,
  onSetUIConfig,
  onSelectDefinition,
  onSetUser,
  onSetSnacker
} from "../store/actions"
const mapStateToProps = ({user, definitions, selectedDefinition}) =>
  ({
    user: user,
    selectedDefinition: selectedDefinition,
    definitions: definitions
  })

const mapDispatchToProps = dispatch =>
  ({
    onSetDefinitions(definitions) {
      dispatch(onSetDefinitions(definitions))
    },
    onSetProperties(properties) {
      dispatch(onSetProperties(properties))
    },
    onSetUIConfig(uiConfig) {
      dispatch(onSetUIConfig(uiConfig))
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

export const HeaderContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Header))
