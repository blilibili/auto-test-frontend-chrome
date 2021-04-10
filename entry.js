var app = new Vue({
  el: '#app',
  data() {
    return {
      testModuleList: []
    }
  },
  mounted() {
    this.updatePlanList()
  },
  methods: {
    addNewPlan() {
      window.open('page/addNewPlan/addNewPlan.html')
    },
    updatePlanList() {
      chrome.storage.local.get('testModel', (result) => {
        this.testModuleList = result.testModel? JSON.parse(result.testModel): []
      })
    },
    startTest() {
      // 发送消息 开始赋值测试
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {message: {
            direct: 'startTest',
            test: '123',
            moduleList: this.testModuleList
          }}, function(response) {// popup直接给contentscript发消息

        });
      });
    },
    clearPlanList() {
      chrome.storage.local.clear()
      this.updatePlanList()
    }
  }
})