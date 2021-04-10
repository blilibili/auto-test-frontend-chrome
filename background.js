chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if(request.direct === 'saveTestPlan') {
    const targetModel = request.data.slice()
    chrome.storage.local.set({
      testModel: JSON.stringify(targetModel)
    }, function() {
      console.log('保存自动测试对象', targetModel)
    });
  }
});