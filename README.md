Touchjs Getsture Library
=======

### API

[API Docs](http://cloudajs.org/docs/step4_API_Documentation#h2_7)

### EXAMPLES
[Examples](http://code.baidu.com/examples.html)

### NOTE

与0.2.6及之前的touch.js兼容问题

##### 兼容原因 
0.2.6及之前的touch.js不支持事件代理机制，而新的touch.js通过手势识别，事件冒泡及原生的事件对象，提供事件代理机制和自定义事件的能力，从而极大提升性能。原有的stopPropagation会阻止原生事件冒泡，从而使手势识别失效，因此，需要手动删除/注释stopPropagation语句。麻烦各位根据自己项目的实际情况，选择性升级touch.js。

##### 兼容方法 
删除/注释所有绑定中的stopPropagation方法

```js
touch.on('#rotation .target', 'touchstart', function(ev){ ev.startRotate();
	ev.originEvent.preventDefault(); 
	//ev.originEvent.stopPropagation(); 	//注释掉或者删掉stopPropagation方法
});
```

### 包管理器

`Touchjs`已发布至多种包管理器,可以通过以下包管理器来管理`Touchjs`:
- ##### NPM
  安装: `npm install touchjs`  
  
  更新: `npm update touchjs`  
  
  卸载: `npm uninstall touchjs`  

- ##### spm
  安装: `spm install touchjs`  
  [![](http://spmjs.io/badge/touchjs)](http://spmjs.io/package/touchjs)
  
- ##### Bower
  安装: `bower install touchjs`  
  
  更新: `bower update touchjs`  
  
  卸载: `bower uninstall touchjs` 
  
- ##### Component
  安装: `conponent install brandnewera/touchjs`

### 问题反馈

如有疑问, 可以直接提issue, 我们会及时为您解答.
欢迎就`touch.js`提出宝贵的批评和建议.
