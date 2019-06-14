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

## 初步实现过程 form发请求法来实现
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
* 以上的防范都需要刷新页面，或者刷新iframe页面，并且都是用form表单提交的,也就是post方法发请求。那么除了form可以发请求，还有别的也可以尝试，比如a标签、img标签、link标签、script标签等。这些都是**get请求**。
## 测试img标签发请求来实现
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
如果用img发请求，让后端告诉你成功，必须要有真正的图片才可以，需要后端写出如下代码
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
***
### 目前实现了的效果需要手动刷新页面，那么我们在前端部分增加API使得能够自动刷新。
* [Location](https://developer.mozilla.org/zh-CN/docs/Web/API/Location) 接口表示其链接到的对象的位置（URL）。所做的修改反映在与之相关的对象上。 Document 和 Window 接口都有这样一个链接的Location，分别通过 Document.location和Window.location 访问。
* [window.location](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/location) 只读属性，返回一个 Location  对象，其中包含有关文档当前位置的信息。
> window.location : 所有字母必须小写！
> 尽管 window.location 是一个只读 Location 对象，你仍然可以赋给它一个 DOMString。这意味着您可以在大多数情况下处理 location，就像它是一个字符串一样：window.location = 'http://www.example.com'，是 window.location.href = 'http://www.example.com'的同义词 。
* [Location​.reload()](https://developer.mozilla.org/zh-CN/docs/Web/API/Location/reload)方法用来刷新当前页面。该方法只有一个参数，当值为 true 时，将强制浏览器从服务器加载页面资源，当值为 false 或者未传参时，浏览器则可能从缓存中读取页面。
* 前端部分代码增加一条使得
```
    img.onload=function(){
      alert('success')
      window.location.reload()
    }
```
***
* 目前为止还**存在一个问题，就是刷新了页面还是会渲染整个页面**，性能有所提高就不刷新页面来是实现。
***
### 不刷新页面的方法，也就是只修改100这个数字文本，只要我们取到这个数字文本即可
* 用[innerText](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText)属性表示一个节点及其后代的“渲染”文本内容,用它来取这个100数字文本。
* 前端代码修改为：
```
    img.onload=function(){
      alert('success')
      amount.innerText=amount.innerText-1
    }
```
## 测试script标签发请求来实现
* 相对于img来说，**script发请求必须要把它放到页面里面才能实现发请求的功能**，比如需要用到[appenChild()](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/appendChild)这个API
* 并且此方法后端响应中不需要返回一个图片，只需要返回一个空字符串也可以，所以可以看出请求会更快一些。
* 前端代码修改为：
```
    let script = document.createElement('script')
    script.src = './pay'
    document.body.appendChild(script)//script发请求必须要把它放到页面里面才能实现发请求的功能
    script.onload = function () {
      alert('success')
      amount.innerText = amount.innerText - 1
    }
    script.onerror = function () {
      alert('fail')
    }
```
* 后端代码修改为：
```
    if(Math.random()>0.5){
      fs.writeFileSync('./db',newAmout)//重新往文件数据中写入一个新的数字
      response.setHeader('Content-Type','application/javascript')//script请求需要把类型修改了
      response.statusCode=200
      response.write('')//script请求就写空字符串即可
    }
```

### script需要注意的问题，就是这个标签是会执行的
怎么理解呢，两点：
1. 前端代码每次都会在DOM中生成一个script。
2. 在后端中返回的script也会执行，并且使先于前端代码执行。
* 我们打开开发者工具中的ELEMENTS可以看到多出一个
```
<script src="./pay"></script>
```
另外后端代码如果我们修改为一个供前端可以执行的script代码，比如后端代码修改为：
```
    response.write('alert("我是pay")')//script请求就写上提供前端可以执行的代码alert("我是pay")
```
* 此时会**先执行后端**里面写的代码'alert("我是pay")，**然后再执行前端**里面的代码alert('success'),那么前端和后端都在这里写出了执行代码，是不是有点多此一举，那么只需要写一个就好了，选择在后端写入该script的执行代码即可。而前端保留失败的时候执行的代码——onerror。也就是只要在服务器返回在浏览器执行的一段javascript的代码(字符串)即可。通过后端的write可以传到浏览器.
* 那么前端可以把onload代码删除，放在后端(服务器)
* 后端代码可以修改为**需要刷新页面的代码**
```
    response.write(`
    alert("success")
    window.location.reload()
    `)//script请求就写上提供前端可以执行的代码，这里用到多行字符串
```
* 后端也可以修改为**不需要刷新页面的代码,此体验是相对比较优化的**
```
    response.write(`
    amount.innerText=amount.innerText-1
    `)//script请求就写上提供前端可以执行的代码，这里用到多行字符串
```
***
### 解决一个小问题，每次都会添加script，那么添加后删除即可
* 在前端部分使用[remove](https://developer.mozilla.org/zh-CN/docs/Web/API/ChildNode/remove)这个API
* [debugger](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/debugger) 语句调用任何可用的调试功能，例如设置断点。 如果没有调试功能可用，则此语句不起作用。
* 前端部分代码为
```
    document.body.appendChild(script)//script发请求必须要把它放到页面里面才能实现发请求的功能
    script.onload = function (e) {
      debugger//这个debugger只是用来断点调试,可以删除掉
      e.currentTarget.remove()
    }
```
* 执行上面的代码后，**script的变量还在内存中，但是script这个标签在DOM中被删除啦**。
***
* 再次提醒，后端中的代码能够执行javascript有两个条件。
```
    response.write(`
    amount.innerText=amount.innerText-1
    `)//script请求就写上提供前端可以执行的代码，这里用到多行字符串
```
1. 会被javascript执行，是基于http协议，并且后端前面代码也写了这句
```
    response.setHeader('Content-Type', 'application/javascript')//script请求需要把类型修改了
```
2. 前端把script的路径放到script标签里面，也就是script的路径就是script.scr='./pay'
这样浏览器就会认为这个javascirpt是刚刚创建的，所以就去执行它啦。
***
* 上面的这个方案叫做**SRJ(Server rendered javascript),也就是服务器返回的javascript。**不是前端写的javascirpt，而是后台服务器返回的javascirpt。这个是在AJAX出现之前一些厉害的**后端程序员想出来的无刷新，局部更新页面内容的方案**。
***
* 接下来继续升级，首先我们要知道script是不受域名限制的，比如**我们随时都可以在jsbin中使用script来引入JQ，所以这就很容易说明不受域名限制**。但是也有不可以的情况，就是防盗链。或者有相关安全措施(比如验明是否为真实的用户，验证码，手机短信验证码等)的情况。
### 所以这里的路径'/pay'如果写成'http://alipay.com/pay'就可以让阿里来打钱给我的网站
* 所以这就是get请求的一个很大的漏洞，**一般打钱或者取钱不要使用get请求，都需要使用post请求**。
* 前端部分代码修改为：
```
    script.src = 'http://alipay.com/pay?number=10000&user=bomber'//意思是让阿里支付一万元给bomber
```
* 就是当点击button的时候就可以请求阿里的网站。
* 如果把button的点击代码直接放到外面，也可就是不用点击button也可以请求
```
<script>
  let script = document.createElement('script')
    script.src = 'http://alipay.com/pay?number=10000&user=bomber'//意思是让阿里支付一万元给bomber
    document.body.appendChild(script)//script发请求必须要把它放到页面里面才能实现发请求的功能
    script.onload = function (e) {
      // alert('success')
      // amount.innerText = amount.innerText - 1
      e.currentTarget.remove()
    }
    script.onerror = function () {
      alert('fail')
      e.currentTarget.remove()
    }
</script>
```
* 以上都属于一种对网站的攻击，但是都是get请求。当然阿里pay肯定会把get变成post的，所以没有办法很容易的伪造来攻击它。
* 另外提一下是先有JSONP，然后再有AJAX。
### 做两个网站来测试
* Windows 用户
> Windows 没有 /etc/hosts 文件，请按照如下方法修改 hosts：
> 用管理员身份打开记事本（在记事本的快捷方式图标上右键可以看到）
> 用这个记事本打开 hosts（菜单->文件->定位到C:\Windows\System32\drivers\etc目录，然后切换到所有文件）
* 我建立了两个域名，他们的IP地址都是一样的
1. 127.0.0.1 bomber.com
2. 127.0.0.1 bomber2.com
* 然后我们在git bash上面运行两个端口，比如
```
PORT=8001 node index
```
另一个
```
PORT=8002 node index
```
* 这样就有**两个网站啦，但是他们对应的都是同一个IP**。
* 对于目前的网站，他们两个的源代码也是一样的，因为和http://localhost 是一样的地址
* 这里我把前端路径(这个路径的前部分域名是另一个网站的域名)部分代码修改一点：
```
    script.src = 'http://bomber.com:8002/pay'

```
* 我们打开网站bomber2，可以通过http://bomber2.com:8002/ 查询到'/pay'的路径是在bomber.com的域名里面获取到的。
* 可以在pay的preview里面看到,这个bomber.com返回的一段script。
```
amount.innerText=amount.innerText-1
```
* 此时通过**bomber2网站**打的是**bomber网站**的钱。
* 所以再次证明网站之间是可以实现调用对方的script的。
*** 
### 以上有一个问题bomber网站的的后端程序员需要对bomber2网站的页面细节了解很清楚
* 因为bomber网站的后端代码里面有操作bomber2网站前端部分的代码。
* 一般后端程序员是不会去了解一个大网页某个小按钮的具体功能，因为前端了解都很累，何况后端去了解就更加累了。这叫做耦合，就是前后端不要耦合，最好分离开，有分界线，不要关系太紧密。
### 因此我们要解耦合
* 我们在前端部分定义一个函数，提供给后端来调用即可，提供给别的地方调用的函数也可以叫做**回调函数**。
* 前端代码增加
```
  window.xxx=function(result){
    alert('这是bomber2网页的前端程序员写的前端代码')
    alert(`bomber2网页的前端程序员得到bomber网页的后端返回的结果是${result}`)
  }
```
* 后端代码部分修改为
```
    response.write(`
    response.write(`xxx.call(undefined,'success')`)//这只是用来调用前端提供的xxx函数.
    response.end()
  }
```
* 当点击按钮后，首先会弹出前端部分的提示——这是bomber2网页的前端程序员写的前端代码,然后会提示后端返回的提示——bomber2网页的前端程序员得到bomber网页的后端返回的结果是${result}，因为这里传的参数是success，那么提示就是———bomber2网页的前端程序员得到bomber网页的后端返回的结果是success。
* 现在bomber.com后端的程序就不需要知道bomber2.com的前端网页的任何细节都没关系，只需要调用xxx这个函数就帮它做了想做的事情，因为bomber2.com的前端工程师已经定义好了xxx函数，bomber.com后端程序员只需要去调用这个函数，然后把结果告诉bomber2.com的前端部分即可。这两个网站就可以进行无缝的沟通啦。

### 这个xxx函数怎么让后端知道
* 可以通过查询参数传入
* 后端代码
```
    response.write(`${query.callbackName}.call(undefined,'success')`)//这只是用来调用前端提供的xxx函数.
```
* 前端代码
```
    script.src = 'http://bomber.com:8002/pay?callbackName=xxx'
```
* 后端的query和前端的?callbackName=xxx是http对应的关系，这里并不是什么代码,也可以把前端部分的xxx改成yyy，后端代码完全不用改。
### URL即统一资源定位符 (Uniform Resource Locator, URL)，完整的URL由这几个部分构成：
* scheme://host:port/path?query#fragment
* scheme:通信协议，常用的http,ftp,maito等。
* host:主机，服务器(计算机)域名系统 (DNS) 主机名或 IP 地址。
* port:端口号，整数，可选，省略时使用方案的默认端口，如http的默认端口为80。
* path:路径，由零或多个”/”符号隔开的字符串，一般用来表示主机上的一个目录或文件地址。
* **query**:查询，可选，用于给动态网页（如使用CGI、ISAPI、PHP/JSP/ASP/ASP.NET等技术制作的网页）传递参数，可有多个参数，用”&”符号隔开，每个参数的名和值用”=”符号隔开。
* fragment:信息片断，字符串，用于指定网络资源中的片断。例如一个网页中有多个名词解释，可 - ##### 使用fragment直接定位到某一名词解释。(也称为锚点)
--------------------- 
作者：一波万波 
来源：CSDN 
原文：[链接](https://blog.csdn.net/yibowanbo/article/details/80233083)
***
### 目前为止的回顾
* 两个网站之间的交流可以用script来实现，因为script是不受域名限制。而AJAX是受域名限制。
* 前端定义一个函数，后端来调用这个前端定义的函数，然后把参数传入到这个回调函数的第一个参数(除了this以外的第一个参数)。
* 后端把前端传入的参数放到call前面，后端传递给前端的参数放到回调函数的第一个参数里面。

### 把这个success字符串改成JSONP样式的对象就叫做JSON啦，然后加上左padding(左边距)和右padding(右边距)就是JSONP
* [JSON](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON)的语法必须要加用双引号
* 例如后端代码修改为
```
      ${query.callbackName}.call(undefined,{
        "success":true,
        "left":${newAmount}
      })
```
* 其中左边这一块叫做左padding(左边距)
```
      ${query.callbackName}.call(undefined,
```
* 中间这一块叫做JSON
```
                                           {
        "success":true,
        "left":${newAmount}
      }
```
* 右边的一个反括号叫做右padding(右边距)
```
       )
```
* 合起来就叫做JSON+Padding=JSONP
* 而前面我们只需要返回一个字符串'success',**以下的StringP只是用来理解**。
```
      ${query.callbackName}.call(undefined,'success')
```
* 其中左边这一块叫做左padding(左边距)
```
      ${query.callbackName}.call(undefined,
```
* 中间这一块叫做String
```
        'success'
```
* 右边的一个反括号叫做右padding(右边距)
```
       )
```
* 合起来就叫做String+Padding=StringP
* 实际就是利用动态script标签进行跨域请求的一个技术

## JSONP的最后总结
* JSONP
* 请求方：bomber2.com的前端程序员(其实就是指浏览器执行的)
* 响应方：另一个网站bomber.com的后端程序员(其实就是指服务器执行)
1. 请求放创建script标签,src指向响应方,同时穿一个查询参数，比如?callbackName=xxx，等于号后面的就是需要前端部分定义的一个回调函数名字。
2. 响应方根据查询参数callbackName,构造形如：
    1. xxx.call(undefined,'你要的数据')
    2. xxx('你要的数据')  
    这样的响应
3. 浏览器接收到响应，就会执行xxx.call(undefined,'你要的数据')
4. 那么请求放就知道了他要的数据
* 这就是JSONP，但是看不出来为什么叫做JSONP

## 约定
1. callbackName一般都必须叫做callback(在JQuery里面叫做jQuery_callback)
2. xxx这个名字一般是个随机数，因为有可能同时调用十个网站的JSONP，每个网站想一个名字是不是很麻烦，并且这个函数调用后就会被删除掉，这样也不会出现函数名字重复的问题，不会污染全局变量啦，比如用jQuery12312442(),调用完后就删除它，用到这里用到[delete操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/delete)
* 删除script这个标签外，把回调函数一起也删除啦。
* 所以前端代码增加定义一个函数名的操作：
```
    let script = document.createElement('script')
    let functionName = 'bomber' + parseInt(Math.random() * 100000, 10)//因为Math.random()是小数（浮点数），一般不用小数，所以乘以十万,parseInt是取整数部分，后面的10是十进制。
    window[functionName] = function (result) {
      if (result = 'success') {
        amount.innerText = amount.innerText - 1
      } else {

      }
    }
    script.src = 'http://bomber.com:8002/pay?callback='+functionName
```

* 并且在前后端都操作完后删除该函数名
```
      delete window[functionName]
```
***
## jQuery里面的JSONP
* jQuery里面的JSONP说明[链接](https://learn.jquery.com/ajax/working-with-jsonp/)
* jQuery里面的把JSONP放到AJAX里面了：
* 举例代码：
```
<script>
  button.addEventListener('click', function (e) {
    $.ajax({
      url: "http://bomber.com:8001/pay",
      jsonp: "callback",//这个删除也不影响，因为默认就是callback
      dataType: "jsonp",
      success: function (response) {
        if (response = 'success') {
          amount.innerText = amount.innerText - 1
        }
      }
    });
  })
```
* jQ后端返回的信息，比如jQuery341014233197432177835_1560497741157.call(undefined,'success')
* **虽然JQ里面吧JSONP放到AJAX里面，但是JSONP并不是AJAX**。
***
## 最后一个关于JSONP的面试题
* 请问为什么JSONP为什么不支持POST
* 回答
1. 因为JSONP是通过动态创建script实现的。
2. 动态创建script只能用GET，没有办法用POST
* 另外script的src只能写入url,可以写入get数据，没办法写入post数据















