## 1. Introduction

MinMin is a tiny web framework entirely written in typescript, based on [ExpressJS](https://expressjs.com/) and inspired by Java Web

## 2. How to use

### Getting started

#### Install minmin

```npm install --save minmin```

Change tsconfig.json looks like

```json
{
  "compilerOptions": {     
      "lib": [
      "dom",
      "es2015"
      ],
      "target": "es5",
      "moduleResolution": "node",
      "experimentalDecorators": true,
      "emitDecoratorMetadata": true,      
  }
}
```

#### Define controller 

Firstly we create ```ApiController.ts``` file then define controller with ```base url``` is ```/api```

```ts
@Controller('api')
class ApiController {
}
```

#### Define request handler

The next step, we need define request handler like this

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
The upper code is equivalent to http method handler in expressjs like bellow
```js
app.post('/api/login', function(req, res) {
   var username = req.body.username
   var password = req.body.password  
   ...
})
```

#### Start server

The last step is starting web server

```ts
import {WebServer} from "minmin"
import './controllers/ApiController' // very important

const server = new WebServer();
server.setPort(3000);
server.start();
```

### Support Dependency Injection

Support dependency injection since version 0.0.32

```ts
import {Controller, Service, Inject} from "minmin"

@Service()
class MyService {

  action(): void {
  }
  
}

@Controller('api')
class ApiController {

  @Inject()
  myService: MyService;
  
  
}

```

## 3. Decorators list

### Methods

```@Get```
```@Post```
```@Put```
```@Delete```

### Parameters

```@Param```
```@Query```
```@Data```
```@Session``` (deprecated)
```@Request```

### Dependency Injection

```@Inject```
```@Service```

## 4. Classes list

```WebServer```
```Result```
```Error```
```View```

## 5. Template and demo

#### simple: https://github.com/minhdtb/minmin-template
#### with NuxtJS: https://github.com/minhdtb/minmin-nuxt-template
