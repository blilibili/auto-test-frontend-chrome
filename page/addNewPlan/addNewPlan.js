var app = new Vue({
  el: '#app',
  data() {
    return {
      testPlanModel: {
        planName: '',
        website: ''
      },
      targetDom: '',
      testModule: [],
      testObj: {
        type: '',
        content: '',
        typeValue: ''
      },
      // 顺序匹配输入框
      testInputObj: {
        type: 'default',
        inputValue: ''
      },
      checkTestType: '0',
      isShowAddButtonModal: false,
      buttonObj: {
        name: '',
        type: 'click'
      }
    }
  },
  methods: {
    closeShowAddButtonMethods() {
      this.isShowAddButtonModal = false
    },
    addNewTestModule() {
      const testObj = Object.assign({}, this.testObj)
      this.testModule.push(testObj)
    },
    addNewTestInputModule() {
      const testObj = Object.assign({}, this.testInputObj)
      this.testModule.push(testObj)
    },
    changeTestTypeMethods() {
      console.log('切换')
      this.testModule = []
    },
    saveTestPlan() {
      chrome.storage.local.get('testModel', (result) => {
        const savePlanList = result.testModel? JSON.parse(result.testModel): []
        const savePlanModel = Object.assign({}, this.testPlanModel)
        savePlanModel.testModule = this.testModule
        savePlanModel.checkTestType = this.checkTestType
        savePlanModel.targetDom = this.targetDom

        savePlanList.push(savePlanModel)

        console.log(savePlanList)
        chrome.runtime.sendMessage({direct: 'saveTestPlan', data: savePlanList}, function(response) {
          alert('保存成功')
          window.close()
        });
      })
    },
    // 保存按钮 到testModuleList里
    saveButtonClick() {
      const {buttonObj} = this
      console.log('buttonObj', buttonObj)
      this.testModule.push(buttonObj)
      this.isShowAddButtonModal = false
    },
    delModuleHandler(index) {
      this.testModule.splice(index, 1)
    },
    openInsertButtonModal() {
      this.buttonObj['name'] = ''
      this.isShowAddButtonModal = true
    }
  }
})