window.addEventListener('load', (event) => {
    var mdBlocks = document.querySelectorAll('md-block');
    Array.prototype.forEach.call(mdBlocks, (block) => {
        afterBlockRenderred(block, highlightCodeInBlock);
    })
});

// 在 md 代码块渲染结束后，将代码块传入回调函数并调用
function afterBlockRenderred(mdBlock, callback) {
    let observer = new MutationObserver(function (mutations, observer) {
        mutations.forEach(function (mutation) {
            if (mutation.type === "attributes") {
                callback(mutation.target)
            }
        });
        observer.disconnect();
    });

    // 观察 markdown 块的属性变化
    observer.observe(mdBlock, {
        attributes: true
    });
}

// 高亮 md 块内的所有代码块
function highlightCodeInBlock(mdBlock) {
    console.log(mdBlock);
    let codeBlocks = mdBlock.getElementsByTagName('code')
    Array.prototype.forEach.call(codeBlocks, (codeBlock) => {
        hljs.highlightElement(codeBlock);
    });
}