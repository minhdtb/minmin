import {Controller, Data, Inject, Post, Result, Service, WebServer} from "../src";
import {expect} from "chai";

@Service()
class Service2 {

    private testStr = "test2 nha";

    public test2() {
        return this.testStr;
    }
}

@Service()
class MyService {

    @Inject()
    private service2: Service2;

    public test() {
        return this.service2.test2();
    }
}

@Controller("api")
class TestController {

    @Inject()
    testService: MyService;

    public callTest() {
        return this.testService.test();
    }

    @Post("test")
    private testParam(@Data("testNumber") testNumber: string) {
        console.log(testNumber);
    }
}

describe("Testing...", function () {
    let web: WebServer;

    beforeEach(async function () {
        web = new WebServer();
        web.setPort(3001);
        await web.start();
    });

    it("Case 1", function () {
        let controller = web.getControllers()[0];
        let value = controller.callTest();
        expect(value).to.be.equal("test2 nha");
    });
});