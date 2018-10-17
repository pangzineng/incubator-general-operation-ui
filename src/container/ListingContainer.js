import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import Listing from "../components/Listing"
import {
  onSetSnacker, onSetDefinitionQuery
} from "../store/actions"

const mapStateToProps = ({user, selectedDefinition, properties, definitionQuery}) =>
  ({
    userID: user.userID,
    selectedDefinition: selectedDefinition,
    selectedDefinitionProperty: properties[selectedDefinition],
    selectedDefinitionQuery: definitionQuery[selectedDefinition],
    uiConfig: user.profile ? user.profile.access[selectedDefinition] : null
  })

const mapDispatchToProps = dispatch =>
  ({
    onSetSnacker(snacker) {
      dispatch(onSetSnacker(snacker))
    },
    onSetDefinitionQuery(query) {
      dispatch(onSetDefinitionQuery(query))
    }
  })


const mergeProps = (state, actions, props) =>
  ({
    ...state,
    ...actions,
    history: props.history,
    params: props.match.params
  })

export const ListingContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Listing))
