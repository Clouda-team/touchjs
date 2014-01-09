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

### Release note

##### v0.2.11 更新日期： 2013-01-09

- 增加代理/绑定方法对`return false`的支持, 其效果等同于同时执行`e.stopPropagation`和`e.preventDefault`方法.
- 修复代理元素为`document`时出现的bug.

##### v0.2.10 更新日期： 2013-01-08

- 支持require.js shim方式异步加载

##### v0.2.9 更新日期： 2013-12-04

- 修复touch.off接口

##### v0.2.8 更新日期： 2013-11-29

- 事件兼容性升级

##### v0.2.7 更新日期： 2013-11-26

- 添加事件代理机制

- 添加自定义事件支持

- 添加trigger方法

- 支持事件冒泡

##### v0.2.6 更新日期： 2013-07-09

- 修正了在iOS5设备上scale操作在特定情况下报错的问题

##### v0.2.4 更新日期： 2013-07-01

- 修复了在iOS4系统下的文本节点会点击无效的情况

##### v0.2.2 更新日期： 2013-01-17

- 增加了live绑定事件接口

- 解决了在有设置采样频率情况下， 有些处理函数失效问题。

- 修改了mouseup事件不能正常绑定的问题

- touch.off接口支持接受元素对象参数

##### v0.2.1 更新日期： 2013-01-14

- 增加drag事件名

- 修改swipe开关不可用的问题

- 修改了rotation角度在pc浏览器下不连续的问题

##### v0.2.0 更新日期： 2013-01-11

- 增加了采样频率：interval

- 更新on传递options（可选）参数的方式

### 问题反馈

如有疑问, 可以直接提issue, 我们会及时为您解答.
欢迎就`touch.js`提出宝贵的批评和建议.