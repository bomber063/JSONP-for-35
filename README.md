# JSONP-for-35
## 用node.js开启一个服务器
* 当运行node index后就代表开启了一个服务器。
* index.js代码主要关注如下路径代码
```
  if(path === '/'){  // 如果用户请求的是 / 路径
    var string = fs.readFileSync('./index.html', 'utf8')  
    response.setHeader('Content-Type', 'text/html;charset=utf-8')  
    response.write(string)
    response.end()   
  }else if(path === '/style.css'){   // 如果用户请求的是 /style.css 路径
    var string = fs.readFileSync('./style.css', 'utf8')
    response.setHeader('Content-Type', 'text/css')
    response.write(string)
    response.end()   
  }else if(path === '/main.js'){  // 如果用户请求的是 /main.js 路径
    var string = fs.readFileSync('./main.js', 'utf8')
    response.setHeader('Content-Type', 'application/javascript')
    response.write(string)
    response.end()   
  }else{  // 如果用户请求的不是以上的三种路径，那么就会写出write的信息，并且开发者工具显示的代码是404
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8') 
    response.write('找不到对应的路径，你需要自行修改 index.js')
    response.end()
  }
```
* 比如运行node index后，在git bash里面会显示：监听 8888 成功，请用在空中转体720度然后用电饭煲打开 http://localhost:8888
> 如果在浏览器输入http://localhost:8888，就相当于根目录http://localhost:8888/，返回的是接下来readFileSync('./index.html', 'utf8')里面的index.html文件。

> 如果在浏览器输入http://localhost:8888/style.css，返回的是接下来var string = fs.readFileSync('./style.css', 'utf8')
里面的style.css文件。

> 如果在浏览器输入http://localhost:8888/main.js，返回的是接下来var string = fs.readFileSync('./main.js', 'utf8')
里面的main.js文件。

> 如果在浏览器输入http://localhost:8888，后面的路径不是以上三个，那么就会在开发者工具里面显示404代码——response.statusCode = 404
,并会返回找不到对应的路径，你需要自行修改 index.js——response.write('找不到对应的路径，你需要自行修改 index.js')

* 用到的node.js的API说明:
1. [fs.readFileSync](http://nodejs.cn/api/fs.html#fs_fs_readfilesync_path_options)，简单理解就是**同步**读取某个路径的文件。
2. [response.setHeader](http://nodejs.cn/api/http.html#http_response_setheader_name_value)，简单理解就是响应头的名字和格式。
3. [response.write](http://nodejs.cn/api/http.html#http_response_write_chunk_encoding_callback)，简单理解就是服务器会返回给前端写下的东西并显示在浏览器上。
4. [response.end()](http://nodejs.cn/api/http.html#http_response_end_data_encoding_callback)，代表该相应结束。
5. [response.statusCode](http://nodejs.cn/api/http.html#http_response_statuscode)，代表服务器返回的状态码。

* 需要注意的是上面的**路径path和readFileSync里面的文件不一定一一对应，比如路径是style.css也可以返回main.js，主要看后台代码如何写的**。

## 前端代码来控制账户余额(此为非永久性，刷新页面后还是100)
* 点击按钮后数组会减一，**但是刷新页面后继续数字继续变成了100,说明不能永久保存**。
```
<h5>您的账户余额是<span id="amount">100</span></h5>
<button id="button">付款1块钱</button>
<script>
  button.addEventListener('click',function(e){
    let n=amount.innerText//n的类型是字符串
    let number=parseInt(n,10)
    let newNumber=number-1
    amount.innerText=newNumber
  })
```

# 那怎么样才能永久保存呢，就需要用数据库或者硬盘等,此方法大部分需要后端支持.
* MySQL 是一种数据库.
* 文件系统也是一种数据库

## 新建一个文件
* touch db,然后打开db里面输入100,也就是db文件里面就存入一个数字100.
* db的后缀在git bash里面可以不用给出，没有太大的用处。
* 此时后端的代码需要把这个100混进入，然后前端的代码需要获取到后端返回的这个100.

##初步实现过程
### 前端代码中的100用一个占位符来表示，比如这个占位符是&&&amount&&&
```
<h5>您的账户余额是<span id="amount">&&&amount&&&</span></h5>
```
### 后端代码需要取到db文件里面的100,然后把前端代码的占位符&&amount&&&(写成这样的占位符是为了防止与其他代码重复，代表特殊最好唯一的符号)用100或者变化后的数字替换掉。
* db的类型是字符串
* 后端修改的代码
```
    var amount = fs.readFileSync('./db', 'utf8')//db的类型是字符串，db文件里面存了数字100
    string=string.replace('&&&amount&&&',amount)//代表把前端的占位符&&&amount&&&替换为后端的amount
```
* 此时响应还是没有改变数据库，也就是db文件里面的100,所以就算点击按钮后会以此减少1，**但是刷新后**还是会显示100。
* replace的情况[链接](https://stackoverflow.com/questions/21162097/node-js-string-replace-doesnt-work)，这个[replace](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace)是javascirpt里面的API，但是可以在node.js使用。
### 前端点击按钮后告诉服务器，请把后端的数据库里面存的100减少1。
* 因为**要提交数据，那么需要前端发出一个post请求**，而get请求是读取信息，前面了解过，JS目前做不到，但是html语言的form标签就可以发post请求。此时前端的JS代码也可以删除，因为不需要JS来改变这个数字100。
* 前端代码需要修改为
```
<form action="/pay" method="post">
  <input type="submit" value="付款1元">
</form>
```
* [form](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/form)，需要注意一下**form表单一旦提交后会刷新当前页面**
* action
> 一个处理这个form信息的程序所在的URL。这个值可以被 <button> 或者 <input> 元素中的 formaction 属性重载（覆盖）。可以理解为路径，**这里的路径要和后端的path路径一致**。  
* method
> 浏览器使用这种 HTTP 方式来提交 form. 可能的值有:  
post: 指的是 HTTP POST 方法 ; 表单数据会包含在表单体内然后发送给服务器.  
get: 指的是 HTTP GET 方法; 表单数据会附加在 action 属性的URI中，并以 '?' 作为分隔符, 然后这样得到的 URI 再发送给服务器. 当这样做  （数据暴露在URI里面）没什么副作用，或者表单仅包含ASCII字符时，再使用这种方法吧。   
这个值可以被 <button> 或者 <input> 元素中的 formmethod 属性重载（覆盖）。  
* [input](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input)
* [type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types)要呈现的控件类型。
* name
> 控件的名称，与表单数据一起提交。
* value
> 控件的初始值. 此属性是可选的，除非type 属性是radio或checkbox。注意，当重新加载页面时，如果在重新加载之前更改了值，[Gecko和IE将忽略HTML源代码中指定的值](https://bugzilla.mozilla.org/show_bug.cgi?id=46845#c186)。

* 后端修改的代码
```
else if(path==='/pay' && method.toUpperCase()==='POST'){
    var amount=fs.readFileSync('./db', 'utf8') //文件数据里面存的100
    var newAmout=amount-1
    fs.writeFileSync('./db',newAmout)//重新往文件数据中写入一个新的数字
    response.write('success')//告诉用户付款成功
    response.end()
  }
```
* **后端这里的path路径/pay要和前端的action路径/pay一致**。
* 用到的node.js的API说明:
1. [fs.writeFileSync](http://nodejs.cn/api/fs.html#fs_fs_writefilesync_file_data_options),简单理解就是**同步**在某个路径写入一个数据。

* 此时实现的效果就是后端的文件数据库里面的100会在按钮按下后减一，**但是会跳转到显示success的页面，需要返回上一个页面查看减少后的金额，并且如果浏览器存在缓存还需要刷新页面，是不是显得比较麻烦呢**。

### 上面的修改代码是都显示成功，但是我们在测试下存在失败的情况
* 我们在后端中用到javascirpt的一个[Math.random()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/random)随机函数返回一个浮点,  伪随机数在范围[0，1).
* 把后端代码修改为
```
else if(path==='/pay' && method.toUpperCase()==='POST'){
    var amount=fs.readFileSync('./db', 'utf8') //文件数据里面存的100
    var newAmout=amount-1
    if(Math.random()>0.5){
      fs.writeFileSync('./db',newAmout)//重新往文件数据中写入一个新的数字
      response.write('success')//告诉用户付款成功
    }else{
      response.write('fail')//什么都没做，并告诉用户付款失败
    }
    response.end()
  }
```
* 此时就有可能出现fail，并且返回上一个页面刷新（在没有自动清除缓存的前提下需要刷新页面）后减一不会减一，但是也可能成功后，返回上一个页面刷新（在没有自动清除缓存的前提下需要刷新页面）后减一。
***
* 以上的代码都是旧时代（大约在2005年之前）的前后端交互的代码，那个时候会显得很变扭体验和很不好，因为**每次成功后还需要返回上一个页面，并且刷新页面才能看到显示的数字**，是不是很麻烦。
* 再次提醒**form表单一旦提交后会刷新当前页面,因为form有一个target属性，如果不写该属性。默认也会写上改属性为target='_self'，也就是当前页面重新加载(也就是刷新当前页面的意思)**，这里也可以自己简单测试一下，效果就是不写target的时候，与写上target='_self'的时候效果一样。

### 我们可以通过一个iframe控制只刷新iframe的页面
* [form](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/form)标签的MDN中关于target还有一个iframename的属性——iframename: 返回值在指定[iframe](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/iframe)中加载。
* src
> 要嵌入的页面的URL。使用值about:blank来嵌入符合同源策略的空页面。另请注意，以编程方式删除<iframe>src属性（例如via Element.removeAttribute()）会导致about:blank在Firefox（从版本65），基于Chromium的浏览器和Safari / iOS的框架中加载。

* 前端代码修改如下：
```
<form action="/pay" method="post" target="aaa">
  <input type="submit" value="付款1元">
</form> 
<iframe name='aaa'src="about:blank" frameborder="0" height="200"></iframe>
```
* 这样增加了一个iframe，并且设置name，在form中的target指向这个name,就使得刷新的时候不刷新当前页面，而是只刷新iframe页面。
*** 
* 以上的防范都需要刷新页面，或者刷新iframe页面，并且都是用form表单提交的,也就是post方法发请求。那么除了form可以发请求，还有别的也可以尝试，比如a标签、img标签、link标签、script标签等。
### 测试img标签来发请求
把前端代码改成
```
<button id='button'>付款1元</button>
<script> 
  button.addEventListener('click',function(e){
    let img=document.createElement('img')
    img.src='/pay'
  })
</script>
```
* 这样之后我们通过点击button按钮后会看到开发者工具中的Network里面会有**一个路径为pay，并发出一个GET请求**。但是它的缺陷是没有办法来发出POST请求。
接下来**我们需要知道图片请求成功的前后端如何实现，前端需要用到[onload](https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onload)和[onerror](https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onerror)**
* GlobalEventHandlers mixin 的 onload 属性是一个事件处理程序用于处理Window, XMLHttpRequest, <img> 等元素的加载事件，当资源已加载时被触发。
* 当一项资源（如<img>或<script>）加载失败，加载资源的元素会触发一个Event接口的error事件，并执行该元素上的onerror()处理函数。这些error事件不会向上冒泡到window，不过（至少在Firefox中）能被单一的window.addEventListener捕获。
* **那么后端的也需要知道加载成功或者失败，此时需要用到状态码**
* 如果用img发请求，让后端告诉你成功，必须要有真正的图片才可以，需要写出如下代码
```
    if(Math.random()>0.5){
      fs.writeFileSync('./db',newAmout)//重新往文件数据中写入一个新的数字
      response.setHeader('Content-Type','image/jpg')
      response.statusCode=200
      response.write(fs.readFileSync('./dog.jpg'))//必须是真的图片才可以实现img发请求，浏览器才会告诉你成功了。
    }else{
      response.statusCode=400
      response.write('fail')//什么都没做，并告诉用户付款失败
    }
    response.end()
```


