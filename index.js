var http = require('http')
var fs = require('fs')
var url = require('url')

//console.log(Object.keys(http))
var port = process.env.PORT || 8888;

var server = http.createServer(function(request, response){

  var temp = url.parse(request.url, true)
  var path = temp.pathname
  var query = temp.query
  var method = request.method

  //从这里开始看，上面不要看

  if(path === '/'){  // 如果用户请求的是 / 路径
    var string = fs.readFileSync('./index.html', 'utf8') 
    var amount = fs.readFileSync('./db', 'utf8')//db的类型是字符串
    string=string.replace('&&&amount&&&',amount)//代表把前端的占位符&&&amount&&&替换为后端的amount
    response.setHeader('Content-Type', 'text/html;charset=utf-8')  
    response.write(string)
    response.end()   
  }else if(path === '/style.css'){   
    var string = fs.readFileSync('./style.css', 'utf8')
    response.setHeader('Content-Type', 'text/css')
    response.write(string)
    response.end()   
  }else if(path === '/main.js'){  
    var string = fs.readFileSync('./main.js', 'utf8')
    response.setHeader('Content-Type', 'application/javascript')
    response.write(string)
    response.end()   
  }else if(path==='/pay' && method.toUpperCase()==='POST'){
    var amount=fs.readFileSync('./db', 'utf8') //文件数据里面存的100
    var newAmout=amount-1
    if(Math.random()>0.5){
      fs.writeFileSync('./db',newAmout)//重新往文件数据中写入一个新的数字
      response.write('success')//告诉用户付款成功
    }else{
      response.write('fail')//什么都没做，并告诉用户付款失败
    }
    response.end()
  }else{  
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8') 
    response.write('找不到对应的路径，你需要自行修改 index.js')
    response.end()
  }

  // 代码结束，下面不要看
  console.log(method + ' ' + request.url)
})

server.listen(port)
console.log('监听 ' + port + ' 成功，请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)
