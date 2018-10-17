import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import Home from "../components/Home"
const mapStateToProps = ({user}) =>
  ({
    profile: user.profile
  })

const mapDispatchToProps = dispatch =>
  ({
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
