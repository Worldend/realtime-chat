import Vue from 'vuex'

const state = {
  user: null
}

const mutations = {
  SET_AUTH_USER (state, user) {
    state.authUser = user
  }
}

const actions = {
  setAuthUser: ({commit}, user) {
    let user = window.localStorage.getItem('authUser')

    commit('SET_AUTH_USER', user)
  }
}

export default {
  state, mutations, actions
}