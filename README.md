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

* 需要注意的是上面的**路径path和readFileSync里面的文件不一定一一对应，比如路径是style.css也可以返回main.js，主要看后台代码如何写的**。

## 前端代码来控制账户余额(此为非永久性，刷新页面后还是100)
* 点击按钮后数组会减一，但是刷新页面后继续数字继续变成了100,说明**不能永久保存**。
```
<h5>您的账户余额是<span id="amount">100</span></h5>
<button id="button">付款1块钱</button>
<script>
  button.addEventListener('click',function(e){
    let n=amount.innerText
    let number=parseInt(n,10)
    let newNumber=number-1
    amount.innerText=newNumber
  })
```

## 那怎么样才能永久保存呢，就需要用数据库（）或者硬盘等.
* MySQL 是一种数据库.
* 文件系统也是一种数据库