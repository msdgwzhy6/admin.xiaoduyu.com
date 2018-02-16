import Ajax from '../common/ajax'

import grapgQLClient from '../common/grapgql-client'

export function loadSummary({ name, filters = {} }) {
  return async (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    let variables = []

    for (let i in filters) {

      let v = ''

      switch (typeof filters[i]) {
        case 'string':
          v = '"'+filters[i]+'"'
          break
        case 'number':
          v = filters[i]
          break
        default:
          v = filters[i]
          break
      }

      variables.push(i+':'+v)
    }

    if (variables.length > 0) {
      variables = `(${variables})`
    } else {
      variables = ''
    }

    let sql = `
      {
      	analysis${variables}{
          user_count
          posts_count
          comment_count
          notification_count
          userNotification_count
        }
      }
    `

    let [ err, res ] = await grapgQLClient({
      query:sql,
      headers: accessToken ? { 'AccessToken': accessToken } : null
    })

    if (err) return alert('提交失败')

    dispatch({
      type: 'SET_ANALYSIS_LIST_BY_NAME',
      name,
      data: res.data.analysis
    })

    /*


    // console.log('1233');

    return Ajax({
      url: '/analysis/summary',
      type: 'post',
      data: filters,
      headers: { 'AccessToken': accessToken }
    }).then(result => {
      // console.log(result)

      if (result && result.success) {
        dispatch({
          type: 'SET_ANALYSIS_LIST_BY_NAME',
          name,
          data: result.data
        })
      }

    })
    */
  }
}
