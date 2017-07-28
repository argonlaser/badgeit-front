/* global io, Vue, $ */

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
      // create mark down based on the style
      // [![Travis](https://img.shields.io/travis/rust-lang/rust.svg)]() --sample --flat
      // [![Travis](https://img.shields.io/travis/rust-lang/rust.svg?style=plastic)]()
      // [![Travis](https://img.shields.io/travis/rust-lang/rust.svg?style=flat-square)]()

      this.copyTextLogic()
    },
    changeStyle: function (event) {
      window.alert('style changed to ' + this.selectedStyle)
      window.alert('copy text ' + this.copyText)
    },
    copyTextLogic: function () {
      this.copyText = ''
      for (var i = 0; i < this.selectedArrayUpdated.length; i++) {
        this.copyText += '[![' + this.selectedArrayUpdated[i].Name + ']'
        this.copyText += '(' + this.selectedArrayUpdated[i].ImageURL
        this.copyText += ')]()'
        if (this.selectedStyle == 'flat-square' || this.selectedStyle == 'plastic')				{
          this.copyText += '?style=' + this.selectedStyle + ')]()'
        }
      }
      copyToClipboard(this.copyText)
      showMessage()
    }
  }
})

// remove Function
var removeByAttr = function (arr, attr, value) {
  var i = arr.length
  while (i--) {
    if (arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value)) {
      arr.splice(i, 1)
    }
  }
  return arr
}

// Copy to clipboard
function copyToClipboard (copyText) {
  var $temp = $('<input>')
  $('body').append($temp)
  $temp.val(copyText).select()
  document.execCommand('copy')
  $temp.remove()
}

// showing alert on copy
function showMessage () {
  $('#alertMessage').hide()
  $('#alertMessage').css('display', 'inline')
  setTimeout(function () {
    $('#alertMessage').alert('close')
  }, 2000)
  vmSelected.copyTextLen = vmSelected.selectedArrayUpdated.length
	$('#showLabel').append('<div id="alertMessage" class="alert alert-success fade in">' +
  '<a href="#" class="close closeMark" data-dismiss="alert">&times;</a> <strong>Success </strong>' +
  vmSelected.copyTextLen + ' - Badges are copied!.</div>')
}

var host = window.location.href
var socket = io.connect(host, {secure: true, forceNew: true})

socket.on('news', function (data) {
  console.log('Socket : ', socket.id, 'data : ', data.badges)
// TBD: Display in a user friendly format using a view engine framework
  vm.modifiedInput = _.groupBy(data.badges, 'Group')
})
