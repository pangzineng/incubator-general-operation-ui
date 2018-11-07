import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import Listing from "../components/Listing"
import {
  onSetSnacker, onSetDefinitionQuery
} from "../store/actions"
var _ = require('lodash')

const mapStateToProps = ({user, selectedDefinition, properties, definitionQuery}) =>
  ({
    userID: user._id,
    selectedDefinition: selectedDefinition,
    selectedDefinitionProperty: properties[selectedDefinition],
    selectedDefinitionQuery: definitionQuery[selectedDefinition],
    profile: user.activeProfile ? _.find(user.profiles, {name: user.activeProfile}) : null
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
