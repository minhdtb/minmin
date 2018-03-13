## 1. Intro

MinMin là một web framework nhỏ được viết bằng typescript dựa trên expressjs và lấy cảm hứng từ Spring Web

## 2. Hướng dẫn sử dụng

### Cài đặt

Cài đặt minmin

```npm install --save minmin```


Thay đổi config của typescript trong tsconfig.json

```json
{
  "compilerOptions": {
      ...
      "lib": [
      "dom",
      "es2015"
      ],
      "target": "es5",
      "moduleResolution": "node",
      "experimentalDecorators": true,
      "emitDecoratorMetadata": true,
      ...
  }
}
```

### Khai báo Controller 

Đầu tiên chúng ta tạo file ```ApiController.ts``` sau đó khai báo controller với ```base url``` tương ứng là ```/api```

```ts
@Controller('api')
class ApiController {
}
```

### Khai báo thêm  request handler

Bước tiếp theo chúng ta khai báo request handler ví dụ như sau

```ts
@Controller('api')
class ApiController {

  @Post('login')
  private async login(@Data('username') username: string,
                      @Data('password') password: string) {
    let user = await User.findOne({username: username});
    if (user) {
      let compare = await user.comparePassword(password);
      if (compare) {              
        return new Result('user', user);
      } else {
        return new Error(401, "Invalid username or password.");
      }
    } else {
        return new Error(404, "Username not found.");
    }
  }
}
```

Đoạn code trên sẽ tương đương với http method handler trong expressjs như sau
```js
app.post('/api/login', function(req, res) {
   var username = req.body.username
   var password = req.body.password  
   ...
})
```

### Start server

Bước cuối cùng là start web server

```ts
import {WebServer} from "minmin"
import './controllers/ApiController' // rất quan trọng

const server = new WebServer();
server.setPort(3000);
server.start();
  ```
## 3. Decorators

### Methods

```@Get```
```@Post```
```@Put```
```@Delete```

### Parameters

```@Param```
```@Query```
```@Data```

## 4. Classes

```WebServer```
```Result```
```Error```
```View```

