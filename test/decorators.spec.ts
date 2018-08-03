import {Controller, Inject, Service, WebServer} from "../src";

@Service()
class Service2 {

    public test2() {

    }
}

@Service()
class MyService {

    @Inject()
    private service2: Service2;

    public test() {
        console.log("hello");
    }
}

@Controller()
class TestController {

    @Inject()
    testService: MyService;

    public callTest() {
        this.testService.test();
    }
}

describe("Testing...", function () {
    let web: WebServer;

    beforeEach(function () {
        web = new WebServer();
        web.setPort(3001);
        web.start();
    });

    it("Test 1", function () {
        process.exit(0);
    });
});