import {Component} from 'react'

import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    hold: ['rahul', 'rahul@2021'],
    errorMsg: '',
    errorStatus: false,
  }

  inputChange = event => {
    this.setState({username: event.target.value})
    console.log(event.target.value)
  }

  passwordChange = event => {
    this.setState({password: event.target.value})
    console.log(event.target.value)
  }

  onSubmitSuccess = jwtToken => {
    console.log('hist')
    this.setState({errorStatus: false})
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    const {history} = this.props
    history.replace('/')
  }

  tt = async event => {
    event.preventDefault()
    const {username, password} = this.state
    console.log(username, password)
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {method: 'POST', body: JSON.stringify(userDetails)}
    const t = await fetch(url, options)
    const data = await t.json()
    console.log(data)
    console.log(t)
    if (t.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
      console.log(t)
    } else {
      this.setState({errorMsg: data.error_msg, errorStatus: true})
    }
  }

  render() {
    const {errorMsg, errorStatus} = this.state

    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="bg">
        <div className="form-cont">
          <img
            className="logo-image"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          />
          <form className="form-input" onSubmit={this.tt}>
            <label className="label-text" htmlFor="username">
              USERNAME
            </label>

            <input
              className="input-box"
              type="text"
              id="username"
              onChange={this.inputChange}
            />
            <br />
            <label className="label-text" htmlFor="password">
              PASSWORD
            </label>

            <input
              className="input-box"
              type="password"
              id="password"
              onChange={this.passwordChange}
            />
            <br />
            <button className="login-button" type="submit">
              LOGIN
            </button>
          </form>
          {errorStatus ? <p>{errorMsg}</p> : <></>}
        </div>
      </div>
    )
  }
}
export default Login
