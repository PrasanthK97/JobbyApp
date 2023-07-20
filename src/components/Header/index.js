import {Link, withRouter} from 'react-router-dom'

import './index.css'

import Cookies from 'js-cookie'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    console.log('his', history)
    history.replace('/login')
  }

  return (
    <nav>
      <div className="header">
        <Link to="/">
          <img
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          />
        </Link>
        <ul className="tabList">
          <Link to="/">
            <li className="tabList">Home</li>
          </Link>
          <Link to="/jobs">
            <li className="tabList">Jobs</li>
          </Link>
          <li>.</li>
        </ul>

        <button className="logout-button" type="button" onClick={onClickLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
