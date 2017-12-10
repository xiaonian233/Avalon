import BaseApi from './_baseApi'

export default class extends BaseApi {
  getLoginUser () {
    return this.http.post('door/user')
  }

  login ({ access, secret, remember, method, geetest }) {
    return this.http.post('door/login', {
      access, secret, remember, method, geetest
    })
  }

  register ({ method, access, secret, nickname, authCode, inviteCode, geetest }) {
    return this.http.post('door/register', {
      method, access, secret, nickname, authCode, inviteCode, geetest
    })
  }

  logout () {
    return this.http.post('door/logout')
  }

  sendSignAuthCode ({ method, access, nickname, mustNotRegister, mustRegistered }) {
    return this.http.post('door/send', {
      method, access, nickname, mustNotRegister, mustRegistered
    })
  }

  getUserInfo ({ zone }) {
    return this.http.get('user/show', {
      params: { zone }
    })
  }

  settingProfile (params) {
    return this.http.post('user/setting/profile', params)
  }

  followBangumis (zone) {
    return this.http.get(`user/${zone}/followed/bangumi`)
  }

  settingImage ({ type, url }) {
    return this.http.post('user/setting/image', { type, url })
  }

  feedback ({ type, desc }) {
    return this.http.post('user/feedback', { type, desc })
  }
}
