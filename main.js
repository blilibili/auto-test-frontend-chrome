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
            setValue(dom, item.content, currentWebsiteObj)
          })
        } else if(currentWebsiteObj.checkTestType === '1') {
          const testSetValueList = currentWebsiteObj.testModule
          const targetDom = currentWebsiteObj.targetDom.indexOf('.') !==-1 ?currentWebsiteObj.targetDom: `.${currentWebsiteObj.targetDom}`
          const targetClassDom = currentWebsiteObj.targetDom !== ''?`${targetDom} input`: 'input'
          const inputList = $(targetClassDom)
          // 所有值赋值完 开始处理按钮点击事件
          for(let i = 0;i < inputList.length;i++) {
            const dom = inputList[i]
            // @params dom  插入值  当前测试大对象  当前输入框类型  当前输入框位置
            if(testSetValueList[i]) {
              setValue(dom, testSetValueList[i].inputValue, currentWebsiteObj, testSetValueList[i].type, i)
            }
          }
        }
        const buttonList = currentWebsiteObj.testModule.filter((result) => {
          return result.type === 'click'
        })

        buttonList.forEach((item) => {
          const findList = findLoginButton(item.name)
          console.log('找到按钮列表', findList, item)
          findList.forEach((childItem) => {
            childItem.click()
          })
        })
      }
    });
}

function setValue(dom, value, currentWebsiteObj, inputType='', inputIndex='') {
  try{
    const testDom = dom
    if(currentWebsiteObj.checkTestType === '0' || (currentWebsiteObj.checkTestType === '1' && inputType === 'default')) {
      const evt = new InputEvent('input', {
        inputType: 'insertText',
        data: value,
        dataTransfer: null,
        isComposing: false
      });
      testDom.value = value
      testDom.dispatchEvent(evt);
    } else if (currentWebsiteObj.checkTestType === '1' && inputType === 'select') {
      testDom.click()
      const targetDom = currentWebsiteObj.targetDom.indexOf('.') !== -1 ?currentWebsiteObj.targetDom: `.${currentWebsiteObj.targetDom}`

      const ulDom = $(`${targetDom} .el-select-dropdown__list`)
      $(ulDom[inputIndex]).find('li')[parseInt(value, 10)].click()
    }
  } catch (e) {
    console.warn('异常: ', e)
  }
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