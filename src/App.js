import React, { Component, PropTypes } from 'react'
import QuestionList from './Containers/QuestionList'
import { connect } from 'react-redux'
import { VisibleOnlyAdmin, VisibleOnlyUser } from './utils/wrappers.js'
import { loadUsers } from './actions'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  componentDidMount() {
    if(this.context.instanceLoaded && !this.props.user.loaded) {
      this.props.dispatch(
        loadUsers(this.context.predMarketInstance, this.context.accounts)
      )
    }
  }

  render() {
    const AdminOnlyLinks = VisibleOnlyAdmin(() =>
      <span>
        <li className="pure-menu-item">
          <div>Add Question</div>
        </li>
      </span>
    )

    const UserOnlyLinks = VisibleOnlyUser(() =>
      <span>
        <li className="pure-menu-item">
          <div>placeholder for user info or navigation</div>
        </li>
      </span>)

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <ul className="pure-menu-list navbar-right">
            <AdminOnlyLinks/>
            <UserOnlyLinks/>
          </ul>
        </nav>
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <QuestionList/>
            </div>
          </div>
        </main>
      </div>
    )
  }
}

App.contextTypes = {
  instanceLoaded: PropTypes.bool,
  accounts: PropTypes.array,
  web3: PropTypes.object,
  predMarketInstance: PropTypes.object
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(App)
