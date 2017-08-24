/* global io, Vue, $, _ */
/**
 *
 * Script to compute  logic on Result page
 *
 * Get the data from socket
 * Display as a group of badges based on the 'Group' field
 * Select badges by clicking on the respective badges
 * Selected badges will show in the selected area in the UI
 * Can copy the badges by clicking copy button from the UI
 * Alert message will shown after clicking on the copy button
 */

var vm = new Vue({
  el: '#dynamicData',
  data: {
    message: [],
    modifiedInput: '',
    selectedArray: ''
  },
  // define methods under the `methods` object
  methods: {
    clickOnBadgeFromSelector: function (obj, event) {
      // `this` inside methods points to the Vue instance
      if (event) {
        var targetId = event.currentTarget.id
        $('#' + targetId).css('display', 'none')
        var targetToBackId = targetId.replace('option', 'selected')

        var available = vmSelected.selectedArray.some(function (el) {
          return el.eleId === targetToBackId
        })
        // Push key for identification
        obj.eleId = targetToBackId

        if (!available) {
        // Push to selected array
          vmSelected.selectedArray.push(obj)
        } else {
          $('#' + targetToBackId).css('display', 'inline')
        }
        // Copy for consistency
        vmSelected.selectedArrayUpdated.push(obj)
      }
    },
    randomFun: function () {
    // Generate random number for id
      return ('option' + Math.ceil(Math.random() * 100000))
    }
  }
})
/**
 * New Vue instance for selected operation
 */
var vmSelected = new Vue({
  el: '#staticDiv',
  data: {
    selectedArray: [],
    selectedArrayUpdated: [],
    selectedStyle: 'flat',
    copyText: '',
    copyTextLen: 0
  },
  methods: {
    clickOnBadgeFromSelected: function (obj, event) {
      if (event) {
        var targetId = event.currentTarget.id
        // subtract selected from Updated array
        this.selectedArrayUpdated = removeByAttr(this.selectedArrayUpdated, 'eleId', targetId)
        $('#' + targetId).css('display', 'none')
        var targetToBackId = targetId.replace('selected', 'option')
        $('#' + targetToBackId).css('display', 'inline')
        event.stopPropagation()
      }
    },
    copyItem: function (event) {
            // create mark down based on the style -Sample
            // [![Travis](https://img.shields.io/travis/rust-lang/rust.svg)]() --sample --flat
            // [![Travis](https://img.shields.io/travis/rust-lang/rust.svg?style=plastic)]()
            // [![Travis](https://img.shields.io/travis/rust-lang/rust.svg?style=flat-square)]()

      this.copyTextLogic()
    },
    changeStyle: function (event) {
      window.alert('style changed to ' + this.selectedStyle)
      // Show the reflection in UI
      // Add style parameters if chosen
      for (var i = 0; i < this.selectedArrayUpdated.length; i++) {
        var localChagesForStyle = ''

        var imageUrl = this.selectedArrayUpdated[i].ImageURL
        var index = imageUrl.indexOf('?style=')
        if (index > -1) {
          imageUrl = imageUrl.substring(0, index)
        }
        localChagesForStyle = imageUrl
        if (this.selectedStyle.toLowerCase() === 'flat-square' || this.selectedStyle.toLowerCase() === 'plastic') {
          localChagesForStyle = imageUrl + '?style=' + this.selectedStyle.toLowerCase()
        }
        this.selectedArrayUpdated[i].ImageURL = localChagesForStyle
      }
    },
    copyTextLogic: function () {
      this.copyText = ''
      for (var i = 0; i < this.selectedArrayUpdated.length; i++) {
        this.copyText += '[!'
        this.copyText += '[' + this.selectedArrayUpdated[i].Name + ']'
        this.copyText += '(' + this.selectedArrayUpdated[i].ImageURL
        // Add style parameters if chosen
        if (this.selectedStyle.toLowerCase() === 'flat-square' || this.selectedStyle.toLowerCase() === 'plastic') {
          this.copyText += '?style=' + this.selectedStyle.toLowerCase()
        }
        this.copyText += ')]'
        this.copyText += '(' + this.selectedArrayUpdated[i].LinkURL + ')'
      }
      copyToClipboard(this.copyText)
      showMessage()
    }
  }
})

/**
 * remove Function - To remove unselected badges from array
 */
var removeByAttr = function (arr, attr, value) {
  var i = arr.length
  while (i--) {
    if (arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value)) {
      arr.splice(i, 1)
    }
  }
  return arr
}

/**
 * Copy to clipboard
 * @param copyText -Paste content
 */
function copyToClipboard (copyText) {
  var $temp = $('<input>')
  $('body').append($temp)
  $temp.val(copyText).select()
  document.execCommand('copy')
  $temp.remove()
}

/**
 * showing alert on copy
 */
function showMessage () {
  vmSelected.copyTextLen = vmSelected.selectedArrayUpdated.length
  $('#alertMessage').hide()
  $('#alertMessage').css('display', 'inline')
  setTimeout(function () {
    $('#alertMessage').css('display', 'none')
  }, 3000)
}

var host = window.location.href
var socket = io.connect(host, {secure: true, forceNew: true})
/**
* Socket To get the data from server
* Used socket instead ajax to avoid Conjunctions
*/
socket.on('news', function (data) {
  console.log('Socket : ', socket.id, 'data : ', data.badges)

  if ((data.badges && data.badges.length === 0) || data.error) {
    // hide static div
    $('#contentDiv').css('display', 'none')
    // show error div
    $('#errorContainer').css('display', 'block')
  } else {
    vm.modifiedInput = _.groupBy(data.badges, 'Group')
    $('#errorContainer').css('display', 'none')
    $('#contentDiv').css('display', 'block')
  }
})
