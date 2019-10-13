App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = web3.eth.accounts[0]
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const Basic = await $.getJSON('basicapp.json')
    App.contracts.basicapp = TruffleContract(Basic)
    App.contracts.basicapp.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.Basic = await App.contracts.basicapp.deployed()
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    $('#account').html(App.account)

    // Render Temps
    await App.renderTemp()

    // Update loading state
    App.setLoading(false)
  },

  renderTemp: async () => {
    // Load the total task count from the blockchain
    const count = await App.Basic.count()
    const $tempTemplate = $('.tempTemplate')

    // Render out each task with a new task template
    for (var i = 1; i <= count; i++) {
      // Fetch the task data from the blockchain
      const temp = await App.Basic.temps(i)
      const tempId = temp[0].toNumber()
      const tempContent = temp[1]

      // Create the html for the task
      const $newTempTemplate = $tempTemplate.clone()
      $newTempTemplate.find('.content').html(tempContent)
 /*     $newTempTemplate.prop('name', taskId)*/

      $('#tempList').append($newTempTemplate)

      // Show the temp
      $newTempTemplate.show()
    }
  },

  addTemp: async () => {
    App.setLoading(true)
    const content = $('#newTemp').val()
    await App.Basic.addTemp(content)
    window.location.reload()
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})


