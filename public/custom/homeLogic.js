window.handleKeypress = function (event) {
  if (event.which === 13 || event.keyCode === 13) {
    openResultsPage()
  }
}

function openResultsPage () {
  var repoUrl = document.getElementById('inputLink').value

  if (!repoUrl) {
    // Change the border of textbox to red
    document.getElementById('inputLink').className = document.getElementById('inputLink').className + ' error' // this adds the error class
    return
  }

  window.parent.location = '/w/' + repoUrl
}
