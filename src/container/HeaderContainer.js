import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import Header from "../components/Header"
import {
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
