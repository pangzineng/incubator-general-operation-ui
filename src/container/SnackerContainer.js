import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import Snacker from "../components/Snacker"
import {
  onSetSnacker
} from "../store/actions"

const mapStateToProps = ({snacker}) =>
  ({
    snacker: snacker
  })

const mapDispatchToProps = dispatch =>
  ({
    onSetSnacker(snacker) {
      dispatch(onSetSnacker(snacker))
    }
  })

export const SnackerContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Snacker))
