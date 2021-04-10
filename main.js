function startCode() {
  chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
      const currentHref = window.location.href
      const testModuleList = request.message.moduleList
      if(request.message.direct === 'startTest') {
        const currentWebsiteObj = testModuleList.filter((res) => {
          return res.website === currentHref
        })[0]

        console.log('currentWebsiteObj', currentWebsiteObj)

        if(currentWebsiteObj.checkTestType === '0') {
          currentWebsiteObj.testModule.forEach((item) => {
            let dom = ''
            if(item.type === 'id') {
              dom = document.getElementById(item.typeValue)
            }
            setValue(dom, item.content)
          })
        } else if(currentWebsiteObj.checkTestType === '1') {
          const testSetValueList = currentWebsiteObj.testModule
          const targetDom = currentWebsiteObj.targetDom.indexOf('.') !==-1 ?currentWebsiteObj.targetDom: `.${currentWebsiteObj.targetDom}`
          const targetClassDom = currentWebsiteObj.targetDom !== ''?`${targetDom} input`: 'input'
          console.log(targetClassDom)
          const inputList = $(targetClassDom)
          // 所有值赋值完 开始处理按钮点击事件
          for(let i = 0;i < inputList.length;i++) {
            const dom = inputList[i]
            console.log(typeof parseInt(testSetValueList[i].inputValue, 10))
            setValue(dom, parseInt(testSetValueList[i].inputValue, 10), currentWebsiteObj)
          }
        }
        const buttonList = currentWebsiteObj.testModule.filter((result) => {
          return result.type === 'click'
        })

        buttonList.forEach((item) => {
          const findList = findLoginButton(item.name)
          findList.forEach((childItem) => {
            childItem.click()
          })
        })
      }
    });
}

function setValue(dom, value, currentWebsiteObj) {
  const testDom = dom
  const evt = new InputEvent('input', {
    inputType: 'insertText',
    data: value,
    dataTransfer: null,
    isComposing: false
  });
  testDom.value = value
  testDom.dispatchEvent(evt);
  testDom.click()
  const targetDom = currentWebsiteObj.targetDom.indexOf('.') !==-1 ?currentWebsiteObj.targetDom: `.${currentWebsiteObj.targetDom}`

  console.log('dom', targetDom, `${targetDom} .el-select-dropdown__list`)
  $(`${targetDom} .el-select-dropdown__list`).find('li')[0].click()
}

// 查找页面中 登录的按钮
function findLoginButton(loginText) {
  const eles = document.getElementsByTagName("*")
  // 切割掉前八个头部
  let sliceEles = []
  let simLoginButton = []
  for(let i = 0;i < eles.length;i++){
    if(i > 7){
      sliceEles.push(eles[i])
    }
  }

  for(let i = 0;i < sliceEles.length;i++){
    if(sliceEles[i].innerText === loginText && sliceEles[i].nodeName === "BUTTON"){
      simLoginButton.push(sliceEles[i])
    }
  }

  return simLoginButton
}

// 递归判断是否加载完成
testIsComplete()
function testIsComplete() {
  if(window.document.readyState === 'complete'){
    console.log('注入代码')
    startCode()
  }else{
    setTimeout(() => {
      testIsComplete()
    }, 200)
  }
}