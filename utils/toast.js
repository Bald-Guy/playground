function showSuccess(title) {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: 1000
  })
}

function showError(title) {
  wx.showToast({
    title: title,
    icon: 'error',
    duration: 1000
  })
}

module.exports.showSuccess = showSuccess;
module.exports.showError = showError;