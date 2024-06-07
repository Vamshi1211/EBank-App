import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {userId: '', pin: '', onSubmitFailure: false, errorMsg: ''}

  onChangeUserId = event => {
    this.setState({userId: event.target.value})
  }

  onChangePin = event => {
    this.setState({pin: event.target.value})
  }

  onFormSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onFormSubmitFailure = errorMsg => {
    this.setState({onSubmitFailure: true, errorMsg})
  }

  onFormSubmit = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const updatedData = {user_id: userId, pin}

    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(updatedData),
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onFormSubmitSuccess(data.jwt_token)
    } else {
      this.onFormSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {userId, pin, onSubmitFailure, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <div className="card-container">
          <div className="image-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="login-image"
            />
          </div>

          <form className="login-card-container" onSubmit={this.onFormSubmit}>
            <h1 className="login-heading">Welcome Back! </h1>
            <label className="label-text" htmlFor="userId">
              User ID
            </label>
            <input
              className="input-element"
              placeholder="Enter User ID"
              id="userId"
              onChange={this.onChangeUserId}
              value={userId}
            />
            <label className="label-text" htmlFor="pin">
              Pin
            </label>
            <input
              type="password"
              className="input-element"
              placeholder="Enter Pin"
              id="pin"
              onChange={this.onChangePin}
              value={pin}
            />
            <button type="submit" className="login-button">
              Login
            </button>
            {onSubmitFailure && <p className="error-msg">{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
